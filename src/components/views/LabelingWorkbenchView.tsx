import React, { useState, useEffect } from 'react';
import {
  StageRecord,
  InferenceCandidate,
  UserProfile,
  AspectVotes,
  ModelRubricScores,
} from '../../types/flywheel';

interface LabelingWorkbenchProps {
  records: StageRecord[];
  currentRecordIndex: number;
  onSelectRecordIndex: (index: number) => void;
  currentUser: UserProfile;
  onSaveVerdict: (
    recordId: string,
    selectedCandidateId: 'A' | 'B' | 'C' | 'D',
    action: 'adopt' | 'fix' | 'drop' | 'escalate',
    rationale: string,
    editedPayload?: string,
    aspectVotes?: AspectVotes,
    candidateScores?: Record<'A' | 'B' | 'C' | 'D', ModelRubricScores>
  ) => void;
  onOpenInPlayground: (record: StageRecord) => void;
}

export const LabelingWorkbenchView: React.FC<LabelingWorkbenchProps> = ({
  records,
  currentRecordIndex,
  onSelectRecordIndex,
  currentUser,
  onSaveVerdict,
  onOpenInPlayground,
}) => {
  const currentRecord = records[currentRecordIndex] || records[0];

  // Selected winner candidate
  const [selectedCandidateId, setSelectedCandidateId] = useState<'A' | 'B' | 'C' | 'D'>('C');
  const [actionVerdict, setActionVerdict] = useState<'adopt' | 'fix' | 'drop' | 'escalate'>('adopt');
  const [rationale, setRationale] = useState<string>('');
  const [isSysPromptOpen, setIsSysPromptOpen] = useState(false);
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(true);
  const [isPayloadEditorOpen, setIsPayloadEditorOpen] = useState(false);
  const [customPayload, setCustomPayload] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Playback simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Active view tab for candidates: 'overview' | 'tool_json' | 'speech_tts' | 'diff'
  const [candidateViewTab, setCandidateViewTab] = useState<'overview' | 'tool_json' | 'speech_tts' | 'diff'>('overview');

  // Aspect-level granular votes
  const [aspectVotes, setAspectVotes] = useState<AspectVotes>({
    intent: 'C',
    toolCalls: 'C',
    parameters: 'C',
    responseText: 'A',
  });

  // Candidate Rubric Scores (1-5 stars)
  const [rubricScoresState, setRubricScoresState] = useState<Record<'A' | 'B' | 'C' | 'D', ModelRubricScores>>({
    A: { intentAccuracy: 4, toolPrecision: 4, parameterCompleteness: 3, naturalness: 5, overall: 4.0 },
    B: { intentAccuracy: 2, toolPrecision: 1, parameterCompleteness: 1, naturalness: 2, overall: 1.5 },
    C: { intentAccuracy: 5, toolPrecision: 5, parameterCompleteness: 5, naturalness: 5, overall: 5.0 },
    D: { intentAccuracy: 5, toolPrecision: 4, parameterCompleteness: 4, naturalness: 5, overall: 4.5 },
  });

  // Diff comparison modal / pairwise selection
  const [diffBaseCandidate, setDiffBaseCandidate] = useState<'A' | 'B' | 'C' | 'D'>('B'); // Student
  const [diffTargetCandidate, setDiffTargetCandidate] = useState<'A' | 'B' | 'C' | 'D'>('C'); // Teacher
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  // Sync state when record changes
  useEffect(() => {
    if (currentRecord) {
      const defaultCandidate =
        currentRecord.reviewDecision?.selectedCandidateId ||
        currentRecord.candidates.find((c) => c.isRecommended)?.id ||
        'C';
      setSelectedCandidateId(defaultCandidate);
      setActionVerdict(currentRecord.reviewDecision?.action || 'adopt');

      // Initialize rationale
      setRationale(
        currentRecord.reviewDecision?.rationale ||
          '학생 모델(Distill v1.2)은 멀티인텐트(공조+내비) 결합 시 네비게이션 Tool Call을 아예 누락함. 좌석 파라미터 및 POI 명확화를 위해 Claude 3.5 Sonnet(후보 C)의 Tool Call 구조를 Ground-Truth 정답으로 승인함.'
      );

      // Initialize aspect votes
      if (currentRecord.reviewDecision?.aspectVotes) {
        setAspectVotes(currentRecord.reviewDecision.aspectVotes);
      } else {
        setAspectVotes({
          intent: defaultCandidate,
          toolCalls: defaultCandidate,
          parameters: defaultCandidate,
          responseText: 'A',
        });
      }

      // Initialize rubric scores from candidates
      const initialRubrics: Record<'A' | 'B' | 'C' | 'D', ModelRubricScores> = {
        A: { intentAccuracy: 4, toolPrecision: 4, parameterCompleteness: 3, naturalness: 4, overall: 3.8 },
        B: { intentAccuracy: 2, toolPrecision: 2, parameterCompleteness: 2, naturalness: 2, overall: 2.0 },
        C: { intentAccuracy: 5, toolPrecision: 5, parameterCompleteness: 5, naturalness: 5, overall: 5.0 },
        D: { intentAccuracy: 4, toolPrecision: 4, parameterCompleteness: 4, naturalness: 4, overall: 4.0 },
      };

      currentRecord.candidates.forEach((cand) => {
        if (cand.rubricScores) {
          initialRubrics[cand.id] = { ...cand.rubricScores };
        }
      });
      setRubricScoresState(initialRubrics);

      const chosenCand = currentRecord.candidates.find((c) => c.id === defaultCandidate);
      setCustomPayload(chosenCand?.outputJson || '');
      setIsPlayingAudio(false);
      setAudioProgress(0);
    }
  }, [currentRecordIndex, currentRecord]);

  // Simulated audio playback effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 10;
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleVoteCandidate = (candId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedCandidateId(candId);
    const cand = currentRecord.candidates.find((c) => c.id === candId);
    if (cand) {
      setCustomPayload(cand.outputJson);
      // Auto-update rationale draft
      if (cand.modelRole === 'teacher1' || cand.modelRole === 'teacher2') {
        setRationale(
          `${cand.modelName}(후보 ${cand.id})의 출력을 기준 정답으로 선정함. 표준 스키마 준수 및 인자 완성도가 우수하여 학습/평가 Ground-Truth로 승인함.`
        );
      } else if (cand.modelRole === 'production') {
        setRationale(`실운영 프로덕션(후보 ${cand.id})의 실행 결과가 가장 현업 정책 및 자연어 발화에 부합하여 Ground-Truth로 채택함.`);
      }
    }
    showToast(`후보 ${candId} (${cand?.modelName})을(를) 최고 정답(Best Model)으로 투표했습니다.`);
  };

  const handleScoreChange = (candId: 'A' | 'B' | 'C' | 'D', metric: keyof ModelRubricScores, value: number) => {
    setRubricScoresState((prev) => {
      const current = prev[candId];
      const updated = { ...current, [metric]: value };
      const avg =
        (updated.intentAccuracy + updated.toolPrecision + updated.parameterCompleteness + updated.naturalness) / 4;
      updated.overall = Number(avg.toFixed(1));
      return { ...prev, [candId]: updated };
    });
  };

  const handleAspectVote = (aspectKey: keyof AspectVotes, candId: 'A' | 'B' | 'C' | 'D') => {
    setAspectVotes((prev) => ({
      ...prev,
      [aspectKey]: candId,
    }));
  };

  // Smart Synthesis: Combine best aspects into custom payload
  const handleSynthesizeFromVotes = () => {
    const toolCand = currentRecord.candidates.find((c) => c.id === aspectVotes.toolCalls) || currentRecord.candidates[2];
    const textCand = currentRecord.candidates.find((c) => c.id === aspectVotes.responseText) || currentRecord.candidates[0];

    const synthesizedComment = `// [Smart Synthesized Ground-Truth]\n// - Tool Calls & Schema adopted from Candidate ${toolCand.id} (${toolCand.modelName})\n// - Natural Voice TTS guidance inspired by Candidate ${textCand.id} (${textCand.modelName})\n`;
    setCustomPayload(`${synthesizedComment}${toolCand.outputJson}`);
    setActionVerdict('fix');
    setIsPayloadEditorOpen(true);
    setRationale(
      `부분별 투표 결과 반영: 도구 호출은 후보 ${toolCand.id}(${toolCand.modelName})의 스키마를 채택하고, 안내 발화는 후보 ${textCand.id}(${textCand.modelName})의 자연스러운 어조를 결합하여 최종 정답으로 합성함.`
    );
    showToast(`후보 ${toolCand.id}(도구) + 후보 ${textCand.id}(발화)를 결합한 페이로드를 에디터에 로드했습니다.`);
  };

  const handleCommitNext = () => {
    if (!currentRecord) return;
    onSaveVerdict(
      currentRecord.id,
      selectedCandidateId,
      actionVerdict,
      rationale,
      actionVerdict === 'fix' ? customPayload : undefined,
      aspectVotes,
      rubricScoresState
    );
    showToast(`레코드 #${currentRecord.id} 투표 & 판정 완료 (${currentUser.name}) - 다음 레코드로 이동`);

    if (currentRecordIndex < records.length - 1) {
      onSelectRecordIndex(currentRecordIndex + 1);
    }
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'TEXTAREA' || targetTag === 'INPUT') {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          handleCommitNext();
        }
        return;
      }

      if (e.key === '1') handleVoteCandidate('A');
      if (e.key === '2') handleVoteCandidate('B');
      if (e.key === '3') handleVoteCandidate('C');
      if (e.key === '4') handleVoteCandidate('D');

      if (e.key.toLowerCase() === 'a') setActionVerdict('adopt');
      if (e.key.toLowerCase() === 'f') {
        setActionVerdict('fix');
        setIsPayloadEditorOpen(true);
      }
      if (e.key.toLowerCase() === 'd') setActionVerdict('drop');
      if (e.key.toLowerCase() === 'u') setActionVerdict('escalate');

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCommitNext();
      }
      if (e.key === 'Escape') {
        if (currentRecordIndex < records.length - 1) {
          onSelectRecordIndex(currentRecordIndex + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRecordIndex, selectedCandidateId, actionVerdict, rationale, customPayload, aspectVotes, rubricScoresState]);

  if (!currentRecord) {
    return <div className="p-8 text-center text-[#908fa0]">검수할 레코드가 없습니다.</div>;
  }

  const selectedCandidate = currentRecord.candidates.find((c) => c.id === selectedCandidateId);
  const baseCandForDiff = currentRecord.candidates.find((c) => c.id === diffBaseCandidate);
  const targetCandForDiff = currentRecord.candidates.find((c) => c.id === diffTargetCandidate);

  return (
    <div className="flex flex-col w-full gap-5 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#4cd7f6]/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">task_alt</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">평가 & 투표 반영 완료</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Command & Queue Navigator Bar */}
      <section className="bg-[#181c24] p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-[#262a33]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded border border-[#262a33]">
            <span className="font-mono text-xs uppercase text-[#908fa0]">Queue Run</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-semibold">#{currentRecord.runId}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded border border-[#262a33]">
            <span className="font-mono text-xs uppercase text-[#908fa0]">Stage</span>
            <span className="font-mono text-xs text-[#4edea3] font-medium">{currentRecord.stage} (1차 라벨링 검수)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded border border-[#262a33]">
            <span className="font-mono text-xs uppercase text-[#908fa0]">Domain</span>
            <span className="font-mono text-xs text-[#dfe2ee]">{currentRecord.category}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#93000a]/30 border border-[#ffb4ab]/30 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <span className="font-mono text-xs uppercase text-[#ffb4ab] font-semibold">
              {currentRecord.insightLabel}
            </span>
          </div>
        </div>

        {/* Queue Navigator */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[#908fa0]">RECORD</span>
            <span className="font-semibold text-[#c0c1ff]">#{currentRecord.id}</span>
            <span className="text-[#464554]">/ {records.length} items</span>
          </div>

          <div className="w-28 bg-[#31353e] h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-[#8083ff] h-full transition-all duration-300"
              style={{ width: `${((currentRecordIndex + 1) / records.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectRecordIndex(Math.max(0, currentRecordIndex - 1))}
              disabled={currentRecordIndex === 0}
              className="p-1.5 bg-[#1c2028] hover:bg-[#262a33] disabled:opacity-40 rounded text-[#dfe2ee] transition-colors border border-[#262a33]"
              title="이전 레코드 (Alt+Left)"
            >
              <span className="material-symbols-outlined text-[1.125rem]">chevron_left</span>
            </button>
            <button
              onClick={() => onSelectRecordIndex(Math.min(records.length - 1, currentRecordIndex + 1))}
              disabled={currentRecordIndex === records.length - 1}
              className="p-1.5 bg-[#1c2028] hover:bg-[#262a33] disabled:opacity-40 rounded text-[#dfe2ee] transition-colors border border-[#262a33]"
              title="다음 레코드 (Alt+Right)"
            >
              <span className="material-symbols-outlined text-[1.125rem]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: Original In-Cabin LLM Log & Vehicle Telemetry Context */}
      <section className="bg-gradient-to-r from-[#181c24] to-[#12161f] rounded-2xl p-4 shadow-xl border border-[#262a33] flex flex-col gap-3.5">
        {/* Source Header */}
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#262a33] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[1.25rem]">record_voice_over</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#dfe2ee] tracking-tight">
                  원천 LLM 차량 로그 (Original In-Cabin Log)
                </span>
                <span className="bg-[#31353e] px-2 py-0.5 rounded font-mono text-[0.6875rem] text-[#4cd7f6]">
                  {currentRecord.carModel} • {currentRecord.clientVersion}
                </span>
                <span className="font-mono text-[0.6875rem] text-[#908fa0]">Hash: {currentRecord.hash}</span>
              </div>
              <p className="text-xs text-[#908fa0]">
                차량 운행 중 발생한 실사용자 음성 발화 및 텔레메트리 상황 로그입니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInPlayground(currentRecord)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8083ff]/15 hover:bg-[#8083ff]/25 text-[#c0c1ff] rounded-lg font-mono text-xs border border-[#8083ff]/30 transition-all shadow-sm"
              title="Eval Playground에서 열기"
            >
              <span className="material-symbols-outlined text-[0.875rem]">terminal</span>
              <span>Playground에서 열기</span>
            </button>
            <button
              onClick={() => setIsCriteriaOpen(!isCriteriaOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] rounded-lg font-mono text-xs border border-[#262a33] transition-colors"
            >
              <span className="material-symbols-outlined text-[0.875rem] text-[#4edea3]">fact_check</span>
              <span>정답 가이드라인 {isCriteriaOpen ? '접기' : '보기'}</span>
            </button>
          </div>
        </div>

        {/* Voice Query Bar & Audio Waveform Player */}
        <div className="bg-[#0a0e16] p-4 rounded-xl border border-[#262a33] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Audio Play Button */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
                isPlayingAudio
                  ? 'bg-[#4cd7f6] text-[#001f26] ring-4 ring-[#4cd7f6]/30'
                  : 'bg-[#1c2028] hover:bg-[#262a33] text-[#4cd7f6] border border-[#4cd7f6]/40'
              }`}
              title="음성 로그 재생/정지"
            >
              <span className="material-symbols-outlined text-[1.5rem]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>

            {/* Target Query Text with Highlights */}
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider flex items-center gap-1">
                <span>차량 인포테인먼트 마이크 수신 음성 (User Audio Query)</span>
                {isPlayingAudio && (
                  <span className="text-[#4cd7f6] font-semibold animate-pulse">• 재생 중 (TTS Audio Streaming)</span>
                )}
              </span>
              <p className="font-medium text-lg text-[#dfe2ee] tracking-tight truncate max-w-3xl">
                {currentRecord.currentTargetQuery}
              </p>
            </div>
          </div>

          {/* Audio Visualizer Waves */}
          <div className="flex items-center gap-1 h-7 px-3 py-1 bg-[#181c24] rounded-lg border border-[#262a33] shrink-0">
            {[18, 40, 65, 90, 45, 75, 30, 85, 50, 95, 60, 35, 70, 20].map((height, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlayingAudio ? 'bg-[#4cd7f6] animate-pulse' : 'bg-[#31353e]'
                }`}
                style={{
                  height: isPlayingAudio ? `${Math.max(6, (height * (audioProgress + 10)) % 24)}px` : `${Math.max(4, height / 4)}px`,
                }}
              ></span>
            ))}
            <span className="font-mono text-[0.6875rem] text-[#908fa0] ml-2">
              {isPlayingAudio ? `${Math.round(audioProgress / 10)}s / 3.4s` : '00:03.4'}
            </span>
          </div>
        </div>

        {/* Live In-Cabin Vehicle Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <div className="bg-[#0f131c] p-2.5 rounded-lg border border-[#262a33] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">speed</span>
            <div className="flex flex-col">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">차량 주속</span>
              <span className="font-mono text-sm font-bold text-[#dfe2ee]">
                {currentRecord.vehicleContext?.speedKmh ?? 64} km/h
              </span>
            </div>
          </div>

          <div className="bg-[#0f131c] p-2.5 rounded-lg border border-[#262a33] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.25rem]">thermostat</span>
            <div className="flex flex-col">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">실내 현재 온도</span>
              <span className="font-mono text-sm font-bold text-[#dfe2ee]">
                {currentRecord.vehicleContext?.indoorTempC ?? 26.5}℃
              </span>
            </div>
          </div>

          <div className="bg-[#0f131c] p-2.5 rounded-lg border border-[#262a33] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[1.25rem]">airline_seat_recline_extra</span>
            <div className="flex flex-col">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">탑승객 존</span>
              <span className="font-mono text-xs font-semibold text-[#dfe2ee]">
                {currentRecord.vehicleContext?.passengerZones.join(', ') || '운전석+동승석'}
              </span>
            </div>
          </div>

          <div className="bg-[#0f131c] p-2.5 rounded-lg border border-[#262a33] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[1.25rem]">navigation</span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">현재 위치/내비</span>
              <span className="font-mono text-xs font-semibold text-[#dfe2ee] truncate">
                {currentRecord.vehicleContext?.navCurrentDestination || '경부고속도로 판교 부근'}
              </span>
            </div>
          </div>

          <div className="bg-[#0f131c] p-2.5 rounded-lg border border-[#262a33] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ffddb8] text-[1.25rem]">radio</span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">미디어/오디오</span>
              <span className="font-mono text-xs font-semibold text-[#dfe2ee] truncate">
                {currentRecord.vehicleContext?.mediaStatus || 'BGM 재생 중'}
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Ground-Truth Guidelines Checklist */}
        {isCriteriaOpen && (
          <div className="bg-[#0f131c] p-3 rounded-xl border border-[#4edea3]/30 flex flex-col gap-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#4edea3] font-bold uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem]">check_circle</span>
                작업자 검수 기준 (Ground-Truth Criteria & Expectations)
              </span>
              <span className="text-[0.6875rem] text-[#908fa0]">
                *여러 모델의 출력을 비교할 때 아래 조건을 충족하는지 확인하세요.
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(currentRecord.groundTruthExpectation || [
                '복합 인텐트 감지 (공조 + 내비게이션 동시 분리)',
                '온도 22.0℃ 및 승객 구역(target_zone) 지정 준수',
                '목적지 POI 식별 및 카테고리 태깅',
                '자연스럽고 간결한 한국어 음성(TTS) 안내 생성',
              ]).map((crit, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#181c24] px-3 py-1.5 rounded-lg border border-[#262a33]">
                  <span className="w-4 h-4 rounded-full bg-[#4edea3]/20 text-[#4edea3] font-mono text-[0.625rem] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-[#c7c4d7]">{crit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible System Prompt & Multi-turn Dialogue */}
        <div className="flex items-center justify-between pt-1 border-t border-[#262a33] text-xs">
          <button
            onClick={() => setIsSysPromptOpen(!isSysPromptOpen)}
            className="flex items-center gap-1 text-[#908fa0] hover:text-[#c0c1ff] transition-colors font-mono"
          >
            <span className="material-symbols-outlined text-[1rem]">
              {isSysPromptOpen ? 'expand_less' : 'expand_more'}
            </span>
            <span>시스템 프롬프트 & 이전 대화 턴 ({currentRecord.priorTurns.length}개)</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-[0.6875rem] text-[#908fa0]">
            <span>Agreement Rate: {currentRecord.agreementRate}</span>
            <span>• Intent Density: {currentRecord.intentDensity}</span>
          </div>
        </div>

        {isSysPromptOpen && (
          <div className="bg-[#0a0e16] p-3 rounded-lg border border-[#262a33] flex flex-col gap-2 font-mono text-xs">
            <div className="text-[#908fa0]">
              <span className="text-[#c0c1ff] font-bold">[System Rules]:</span> {currentRecord.systemPrompt}
            </div>
            {currentRecord.priorTurns.map((turn, i) => (
              <div key={i} className="flex items-start gap-2 pt-1 border-t border-[#262a33]/60">
                <span className={`px-1.5 py-0.5 rounded text-[0.625rem] uppercase font-bold ${
                  turn.role === 'user' ? 'bg-[#31353e] text-[#dfe2ee]' : 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                }`}>
                  {turn.role}
                </span>
                <span className="text-[#c7c4d7]">{turn.text}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Multi-Model Side-by-Side Comparison & Voting Array */}
      <section className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c0c1ff]/10 border border-[#c0c1ff]/30 flex items-center justify-center text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[1.25rem]">compare</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-[#dfe2ee] tracking-tight">
                  모델별 추론 결과 병렬 비교 & 투표 (Model Inference Array)
                </h2>
                <span className="bg-[#1c2028] px-2 py-0.5 rounded font-mono text-xs text-[#c0c1ff] border border-[#262a33]">
                  4개 모델 동시 평가
                </span>
              </div>
              <p className="text-xs text-[#908fa0]">
                상단의 <strong>[🏆 Vote as Best]</strong> 버튼 또는 숫자 단축키 [1~4]로 가장 정답에 가까운 모델을 선정하세요.
              </p>
            </div>
          </div>

          {/* View Mode Switcher & Diff Launcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 bg-[#181c24] rounded-lg border border-[#262a33]">
              <button
                onClick={() => setCandidateViewTab('overview')}
                className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  candidateViewTab === 'overview'
                    ? 'bg-[#8083ff] text-[#0d0096] shadow'
                    : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
                }`}
              >
                통합 카드 뷰
              </button>
              <button
                onClick={() => setCandidateViewTab('speech_tts')}
                className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  candidateViewTab === 'speech_tts'
                    ? 'bg-[#8083ff] text-[#0d0096] shadow'
                    : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
                }`}
              >
                음성 발화(TTS) 비교
              </button>
              <button
                onClick={() => setCandidateViewTab('tool_json')}
                className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  candidateViewTab === 'tool_json'
                    ? 'bg-[#8083ff] text-[#0d0096] shadow'
                    : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
                }`}
              >
                도구 JSON 전문
              </button>
            </div>

            <button
              onClick={() => setIsDiffModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1c2028] hover:bg-[#262a33] text-[#4cd7f6] rounded-lg font-mono text-xs border border-[#4cd7f6]/30 transition-colors shadow-sm"
              title="두 모델 간의 차이점을 색상 Diff로 비교"
            >
              <span className="material-symbols-outlined text-[0.875rem]">difference</span>
              <span>Semantic Diff 뷰어</span>
            </button>
          </div>
        </div>

        {/* 4 Multi-Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {currentRecord.candidates.map((cand, idx) => {
            const isSelected = selectedCandidateId === cand.id;
            const isRecommended = cand.isRecommended;
            const scores = rubricScoresState[cand.id] || {
              intentAccuracy: 3,
              toolPrecision: 3,
              parameterCompleteness: 3,
              naturalness: 3,
              overall: 3.0,
            };

            return (
              <div
                key={cand.id}
                className={`rounded-2xl flex flex-col justify-between shadow-xl relative transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#181d27] ring-2 ring-[#4cd7f6] border-[#4cd7f6] shadow-[0_0_25px_rgba(76,215,246,0.15)]'
                    : 'bg-[#141820] hover:bg-[#181c24] border-[#262a33]'
                }`}
              >
                {/* Benchmark Recommendation Banner */}
                {isRecommended && (
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-[#4cd7f6] to-[#00b4d8] text-[#001f26] px-2.5 py-0.5 rounded-full font-mono text-[0.625rem] font-bold uppercase shadow-lg flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[0.75rem]">auto_awesome</span>
                    <span>Benchmark Reference (추천)</span>
                  </div>
                )}

                {/* Card Top Header with Large Vote Button */}
                <div className="p-4 pb-3 border-b border-[#262a33] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-[#4cd7f6] text-[#001f26]'
                            : 'bg-[#262a33] text-[#dfe2ee]'
                        }`}
                      >
                        {cand.id}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#dfe2ee] leading-tight">
                          {cand.modelName}
                        </span>
                        <span className="font-mono text-[0.6875rem] text-[#908fa0]">
                          {cand.modelRole === 'production' && '실운영 프로덕션 모델'}
                          {cand.modelRole === 'student' && '온디바이스 증류 경량 모델'}
                          {cand.modelRole === 'teacher1' && '대형 교사 모델 1'}
                          {cand.modelRole === 'teacher2' && '대형 교사 모델 2'}
                          {cand.modelRole === 'challenger' && '신규 챌린저 모델'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[0.6875rem] font-bold uppercase ${
                          cand.schemaStatus === 'invalid'
                            ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30'
                            : cand.schemaStatus === 'warning'
                            ? 'bg-[#ffddb8]/20 text-[#ffddb8]'
                            : 'bg-[#4edea3]/20 text-[#4edea3]'
                        }`}
                      >
                        {cand.schemaStatus === 'invalid' ? '스키마 에러' : '스키마 통과'}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-[#908fa0] mt-0.5">
                        Judge: <strong className="text-[#dfe2ee]">{cand.judgeScore}</strong>/100
                      </span>
                    </div>
                  </div>

                  {/* Big Primary Vote Button */}
                  <button
                    onClick={() => handleVoteCandidate(cand.id)}
                    className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#4cd7f6] text-[#001f26] shadow-md ring-2 ring-[#4cd7f6]/40'
                        : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border border-[#262a33]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[1rem]">
                      {isSelected ? 'check_circle' : 'how_to_vote'}
                    </span>
                    <span>{isSelected ? '★ 최고 정답으로 투표됨 (Selected Best)' : '이 모델에 투표 (Vote Best)'}</span>
                    <span className="font-mono text-[0.625rem] bg-black/25 px-1.5 py-0.5 rounded ml-1">
                      [{idx + 1}]
                    </span>
                  </button>

                  {/* Telemetry Chips (Latency, Tokens, Community Votes) */}
                  <div className="grid grid-cols-3 gap-1 bg-[#0a0e16] p-1.5 rounded-lg border border-[#262a33] font-mono text-[0.6875rem] text-center">
                    <div>
                      <span className="text-[#908fa0]">응답속도: </span>
                      <span className="font-semibold text-[#dfe2ee]">{cand.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-[#908fa0]">토큰: </span>
                      <span className="font-semibold text-[#dfe2ee]">{cand.tokens}t</span>
                    </div>
                    <div>
                      <span className="text-[#908fa0]">누적 득표: </span>
                      <span className="font-semibold text-[#4cd7f6]">{cand.votesCount || 0}표</span>
                    </div>
                  </div>
                </div>

                {/* Card Body - Content Sections */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  {/* 1. Parsed Intents Breakdown */}
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase font-semibold">
                      추출된 의도 (Parsed Intents)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.extractedIntents && cand.extractedIntents.length > 0 ? (
                        cand.extractedIntents.map((intent, i) => (
                          <span
                            key={i}
                            className="bg-[#1c2028] text-[#4edea3] border border-[#4edea3]/30 px-2 py-0.5 rounded-md font-mono text-xs flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                            {intent}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#ffb4ab] font-mono flex items-center gap-1">
                          <span className="material-symbols-outlined text-[0.875rem]">warning</span>
                          의도 추출 실패 / 미정의
                        </span>
                      )}
                      {cand.id === 'B' && (
                        <span className="bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30 px-2 py-0.5 rounded-md font-mono text-[0.6875rem] flex items-center gap-1">
                          ❌ navigation 누락
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. TTS Voice Guidance (Natural Response) */}
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[0.875rem] text-[#4cd7f6]">volume_up</span>
                      승객 음성 안내 (TTS Natural Response)
                    </span>
                    <div className="bg-[#0a0e16] p-2.5 rounded-xl border border-[#262a33] text-xs text-[#dfe2ee] leading-relaxed relative">
                      <span className="text-[#4cd7f6] font-bold mr-1">“</span>
                      {cand.naturalLanguageResponse || cand.explanation}
                      <span className="text-[#4cd7f6] font-bold ml-1">”</span>
                    </div>
                  </div>

                  {/* 3. Tool Call JSON View */}
                  {(candidateViewTab === 'overview' || candidateViewTab === 'tool_json') && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-mono text-[0.6875rem] text-[#908fa0]">
                        <span className="uppercase font-semibold">도구 호출 (Tool Calling JSON)</span>
                        {cand.schemaStatus === 'invalid' && (
                          <span className="text-[#ffb4ab] font-bold">⚠️ 파싱 오류</span>
                        )}
                      </div>
                      <div className="bg-[#0a0e16] p-2.5 rounded-xl font-mono text-xs overflow-x-auto max-h-[220px] border border-[#262a33]">
                        <pre className="text-[#c7c4d7] leading-relaxed whitespace-pre-wrap">
                          <code>{cand.outputJson}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* 4. Pros & Cons (Key Distinctions) */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-[#262a33]/60 text-xs">
                    {cand.pros && cand.pros.length > 0 && (
                      <div className="flex items-start gap-1.5 text-[#4edea3]">
                        <span className="material-symbols-outlined text-[1rem] shrink-0">check_circle</span>
                        <span className="text-[#c7c4d7] leading-tight">{cand.pros.join(' • ')}</span>
                      </div>
                    )}
                    {cand.cons && cand.cons.length > 0 && (
                      <div className="flex items-start gap-1.5 text-[#ffb4ab]">
                        <span className="material-symbols-outlined text-[1rem] shrink-0">cancel</span>
                        <span className="text-[#ffb4ab] leading-tight">{cand.cons.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Rubric Scoring Bar (1~5 Stars) */}
                <div className="p-3.5 bg-[#0e121a] rounded-b-2xl border-t border-[#262a33] flex flex-col gap-2">
                  <div className="flex items-center justify-between font-mono text-[0.6875rem]">
                    <span className="text-[#908fa0] uppercase font-semibold">작업자 평가 스코어</span>
                    <span className="text-[#4cd7f6] font-bold">
                      평균: {scores.overall || 4.0} / 5.0
                    </span>
                  </div>

                  {/* Metric Stars Quick Adjuster */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                    <div className="flex items-center justify-between bg-[#181c24] px-2 py-1 rounded border border-[#262a33]">
                      <span className="text-[#908fa0] text-[0.6875rem]">의도 파악</span>
                      <div className="flex items-center gap-0.5 text-[#ffddb8]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleScoreChange(cand.id, 'intentAccuracy', star)}
                            className={`hover:scale-125 transition-transform ${
                              star <= scores.intentAccuracy ? 'text-[#ffddb8]' : 'text-[#31353e]'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#181c24] px-2 py-1 rounded border border-[#262a33]">
                      <span className="text-[#908fa0] text-[0.6875rem]">도구 스키마</span>
                      <div className="flex items-center gap-0.5 text-[#ffddb8]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleScoreChange(cand.id, 'toolPrecision', star)}
                            className={`hover:scale-125 transition-transform ${
                              star <= scores.toolPrecision ? 'text-[#ffddb8]' : 'text-[#31353e]'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#181c24] px-2 py-1 rounded border border-[#262a33]">
                      <span className="text-[#908fa0] text-[0.6875rem]">파라미터/안전</span>
                      <div className="flex items-center gap-0.5 text-[#ffddb8]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleScoreChange(cand.id, 'parameterCompleteness', star)}
                            className={`hover:scale-125 transition-transform ${
                              star <= scores.parameterCompleteness ? 'text-[#ffddb8]' : 'text-[#31353e]'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#181c24] px-2 py-1 rounded border border-[#262a33]">
                      <span className="text-[#908fa0] text-[0.6875rem]">발화 자연성</span>
                      <div className="flex items-center gap-0.5 text-[#ffddb8]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleScoreChange(cand.id, 'naturalness', star)}
                            className={`hover:scale-125 transition-transform ${
                              star <= scores.naturalness ? 'text-[#ffddb8]' : 'text-[#31353e]'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Aspect-Level Granular Voting & Synthesis Matrix */}
      {/* 사용자의 요청: "어떤 부분이 더 정답에 가까운지를 투표하거나 스코어를 매기는 형태의 툴" */}
      <section className="bg-gradient-to-br from-[#181c24] to-[#141822] rounded-2xl p-4 shadow-xl border border-[#4cd7f6]/40 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#262a33] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[1.25rem]">ballot</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#dfe2ee] tracking-tight">
                  부문별 정답 판정 & 투표 (Aspect-Level Granular Attribution)
                </h3>
                <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] px-2 py-0.5 rounded font-mono text-xs font-bold">
                  핵심 검수 패널
                </span>
              </div>
              <p className="text-xs text-[#908fa0]">
                각 영역(의도 파악, 도구 호출, 파라미터, 음성 발화)에서 <strong>어떤 모델이 가장 정답에 가까운지</strong> 개별 투표하세요.
              </p>
            </div>
          </div>

          <button
            onClick={handleSynthesizeFromVotes}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#4cd7f6] to-[#00b4d8] hover:brightness-110 text-[#001f26] rounded-xl font-mono text-xs font-bold shadow-md transition-all"
            title="선택한 각 부문의 최고 출력을 합성하여 Ground-Truth 생성"
          >
            <span className="material-symbols-outlined text-[1rem]">auto_fix_high</span>
            <span>부문별 투표 결과로 정답 합성 (Synthesize Best)</span>
          </button>
        </div>

        {/* 4 Aspect Voting Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Aspect 1: Intent Recognition */}
          <div className="bg-[#0f131c] p-3.5 rounded-xl border border-[#262a33] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#dfe2ee] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem] text-[#4cd7f6]">psychology</span>
                1. 의도 분리 및 라우팅 정확도 (Intent Understanding)
              </span>
              <span className="font-mono text-xs text-[#4cd7f6] font-bold">
                선택: 후보 [{aspectVotes.intent}]
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#908fa0]">
              사용자의 복합 명령(공조 + 내비게이션)을 누락 없이 정확한 카테고리로 분리했는가?
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {currentRecord.candidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleAspectVote('intent', cand.id)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                    aspectVotes.intent === cand.id
                      ? 'bg-[#4cd7f6] text-[#001f26] border-[#4cd7f6] shadow'
                      : 'bg-[#181c24] hover:bg-[#262a33] text-[#c7c4d7] border-[#262a33]'
                  }`}
                >
                  [{cand.id}] {cand.modelName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect 2: Tool Call & Schema */}
          <div className="bg-[#0f131c] p-3.5 rounded-xl border border-[#262a33] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#dfe2ee] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem] text-[#4edea3]">code</span>
                2. 도구 함수명 및 스키마 정밀도 (Tool Schema Precision)
              </span>
              <span className="font-mono text-xs text-[#4edea3] font-bold">
                선택: 후보 [{aspectVotes.toolCalls}]
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#908fa0]">
              차량 공식 표준 네임스페이스(climate, navigation)를 엄격히 준수하고 구문 에러가 없는가?
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {currentRecord.candidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleAspectVote('toolCalls', cand.id)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                    aspectVotes.toolCalls === cand.id
                      ? 'bg-[#4edea3] text-[#001f26] border-[#4edea3] shadow'
                      : 'bg-[#181c24] hover:bg-[#262a33] text-[#c7c4d7] border-[#262a33]'
                  }`}
                >
                  [{cand.id}] {cand.modelName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect 3: Parameters & Cabin Safety */}
          <div className="bg-[#0f131c] p-3.5 rounded-xl border border-[#262a33] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#dfe2ee] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem] text-[#c0c1ff]">tune</span>
                3. 파라미터 완성도 및 안전 제어 (Arguments & Safety)
              </span>
              <span className="font-mono text-xs text-[#c0c1ff] font-bold">
                선택: 후보 [{aspectVotes.parameters}]
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#908fa0]">
              온도 수치(22.0), 좌석 구역(target_zone), POI 카테고리 등 필수 하위 인자를 완벽히 전달했는가?
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {currentRecord.candidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleAspectVote('parameters', cand.id)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                    aspectVotes.parameters === cand.id
                      ? 'bg-[#c0c1ff] text-[#0d0096] border-[#c0c1ff] shadow'
                      : 'bg-[#181c24] hover:bg-[#262a33] text-[#c7c4d7] border-[#262a33]'
                  }`}
                >
                  [{cand.id}] {cand.modelName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect 4: Voice Guidance Fluency */}
          <div className="bg-[#0f131c] p-3.5 rounded-xl border border-[#262a33] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#dfe2ee] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[1rem] text-[#ffddb8]">record_voice_over</span>
                4. 음성 안내 자연스러움 (Response Fluency & Tone)
              </span>
              <span className="font-mono text-xs text-[#ffddb8] font-bold">
                선택: 후보 [{aspectVotes.responseText}]
              </span>
            </div>
            <p className="text-[0.6875rem] text-[#908fa0]">
              차량 탑승자에게 군더더기 없이 친절하고 명확한 한국어 TTS 음성 안내를 전달하는가?
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {currentRecord.candidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleAspectVote('responseText', cand.id)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                    aspectVotes.responseText === cand.id
                      ? 'bg-[#ffddb8] text-[#3e2e04] border-[#ffddb8] shadow'
                      : 'bg-[#181c24] hover:bg-[#262a33] text-[#c7c4d7] border-[#262a33]'
                  }`}
                >
                  [{cand.id}] {cand.modelName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Alignment Decision & Ground-Truth Verdict Pad */}
      <section className="bg-[#181c24] rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5 border border-[#262a33]">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#262a33] gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">gavel</span>
            <h3 className="font-bold text-base text-[#dfe2ee]">최종 정답 채택 및 판정 (Reviewer Verdict)</h3>
            <span className="bg-[#1c2028] text-[#908fa0] px-2 py-0.5 rounded font-mono text-xs">
              검수자: {currentUser.name}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#908fa0]">
            <span className="material-symbols-outlined text-[0.875rem]">keyboard</span>
            <span>단축키: [A] 채택 • [F] 수정 • [D] 격리 • [U] 에스컬레이션 • [⌘+Enter] 확정</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          {/* Action Verdict Matrix (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
            <span className="font-mono text-[0.6875rem] uppercase text-[#908fa0] font-semibold">
              처리 방식 선택 (Select Action Mode)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* A: Adopt Best */}
              <button
                onClick={() => setActionVerdict('adopt')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  actionVerdict === 'adopt'
                    ? 'bg-[#00885d] text-[#ffffff] border-[#4edea3] shadow-lg ring-2 ring-[#4edea3]/40'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">check_circle</span>
                  <span>정답 채택</span>
                </div>
                <span className="font-mono text-[0.625rem] bg-black/25 px-1.5 py-0.5 rounded">[A]</span>
              </button>

              {/* F: FIX Edit */}
              <button
                onClick={() => {
                  setActionVerdict('fix');
                  setIsPayloadEditorOpen(true);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  actionVerdict === 'fix'
                    ? 'bg-[#03b5d3] text-[#001f26] border-[#4cd7f6] shadow-lg ring-2 ring-[#4cd7f6]/40'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">build_circle</span>
                  <span>직접 교정</span>
                </div>
                <span className="font-mono text-[0.625rem] bg-black/25 px-1.5 py-0.5 rounded">[F]</span>
              </button>

              {/* D: DROP Quarantine */}
              <button
                onClick={() => setActionVerdict('drop')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  actionVerdict === 'drop'
                    ? 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab] shadow-lg ring-2 ring-[#ffb4ab]/40'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">block</span>
                  <span>불량 격리</span>
                </div>
                <span className="font-mono text-[0.625rem] bg-black/25 px-1.5 py-0.5 rounded">[D]</span>
              </button>

              {/* U: Escalate */}
              <button
                onClick={() => setActionVerdict('escalate')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  actionVerdict === 'escalate'
                    ? 'bg-[#31353e] text-[#c0c1ff] border-[#8083ff] shadow-lg ring-2 ring-[#8083ff]/40'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">help</span>
                  <span>모호성 전달</span>
                </div>
                <span className="font-mono text-[0.625rem] bg-black/25 px-1.5 py-0.5 rounded">[U]</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#0a0e16] px-3 py-2 rounded-xl border border-[#262a33] font-mono text-xs">
              <span className="text-[#908fa0]">선택된 정답 타깃:</span>
              <span className="text-[#4cd7f6] font-bold">
                후보 [{selectedCandidateId}] - {selectedCandidate?.modelName}
              </span>
            </div>
          </div>

          {/* Reviewer Rationale Field (6 Cols) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[0.6875rem] uppercase text-[#908fa0]">
              <span className="font-semibold">검수자 판정 근거 & 정답 사유 (Reviewer Rationale)</span>
              <span className="text-[#c0c1ff]">자동 초안 생성됨</span>
            </div>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="이 모델을 정답으로 선정한 이유나 학생 모델의 오류 지점을 작성하세요..."
              className="w-full bg-[#0a0e16] border border-[#262a33] rounded-xl p-3 text-xs text-[#dfe2ee] focus:outline-none focus:border-[#4cd7f6] transition-colors leading-relaxed resize-none font-sans"
            />
          </div>

          {/* Commit & Next Button (2 Cols) */}
          <div className="col-span-12 lg:col-span-2 flex flex-col gap-2 h-full justify-between">
            <span className="font-mono text-[0.6875rem] uppercase text-[#908fa0] font-semibold">
              제출 및 승인
            </span>
            <button
              onClick={handleCommitNext}
              className="w-full h-[88px] bg-gradient-to-br from-[#4cd7f6] to-[#00a6c8] hover:brightness-110 active:scale-95 text-[#001f26] rounded-xl font-mono text-sm font-bold flex flex-col items-center justify-center gap-1 shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-[1.5rem]">task_alt</span>
              <span>판정 저장 & 다음</span>
              <span className="text-[0.625rem] opacity-75 font-normal">[⌘+Enter]</span>
            </button>
          </div>
        </div>
      </section>

      {/* Semantic Diff Modal (Pairwise Comparison) */}
      {isDiffModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#181c24] border-t sm:border border-[#262a33] rounded-t-2xl sm:rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#262a33] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6]">difference</span>
                <h3 className="font-bold text-base text-[#dfe2ee]">
                  두 모델 간 Semantic Diff 나란히 비교
                </h3>
              </div>
              <button
                onClick={() => setIsDiffModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#262a33] text-[#908fa0] hover:text-[#dfe2ee]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Model Selectors */}
            <div className="px-4 py-3 bg-[#10141c] border-b border-[#262a33] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#ffb4ab]">기준 모델 (Base):</span>
                <select
                  value={diffBaseCandidate}
                  onChange={(e) => setDiffBaseCandidate(e.target.value as any)}
                  className="bg-[#1c2028] text-xs font-mono text-[#dfe2ee] px-2 py-1 rounded border border-[#262a33]"
                >
                  {currentRecord.candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      후보 {c.id} ({c.modelName})
                    </option>
                  ))}
                </select>
              </div>

              <span className="material-symbols-outlined text-[#908fa0]">arrow_forward</span>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#4edea3]">비교 대상 (Target):</span>
                <select
                  value={diffTargetCandidate}
                  onChange={(e) => setDiffTargetCandidate(e.target.value as any)}
                  className="bg-[#1c2028] text-xs font-mono text-[#dfe2ee] px-2 py-1 rounded border border-[#262a33]"
                >
                  {currentRecord.candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      후보 {c.id} ({c.modelName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Diff Panels */}
            <div className="grid grid-cols-2 gap-4 p-4 overflow-y-auto flex-1 font-mono text-xs">
              <div className="flex flex-col gap-2">
                <span className="text-[#ffb4ab] font-bold">
                  [{diffBaseCandidate}] {baseCandForDiff?.modelName}
                </span>
                <div className="bg-[#0a0e16] p-3 rounded-xl border border-[#ffb4ab]/30 overflow-x-auto min-h-[300px]">
                  <pre className="text-[#ffdad6] whitespace-pre-wrap leading-relaxed">
                    <code>{baseCandForDiff?.outputJson}</code>
                  </pre>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[#4edea3] font-bold">
                  [{diffTargetCandidate}] {targetCandForDiff?.modelName}
                </span>
                <div className="bg-[#0a0e16] p-3 rounded-xl border border-[#4edea3]/30 overflow-x-auto min-h-[300px]">
                  <pre className="text-[#d0fbe4] whitespace-pre-wrap leading-relaxed">
                    <code>{targetCandForDiff?.outputJson}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payload Editor Modal */}
      {isPayloadEditorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#181c24] border-t sm:border border-[#262a33] rounded-t-2xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#262a33] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6]">edit_note</span>
                <h3 className="font-bold text-base text-[#dfe2ee]">
                  Ground-Truth 정답 페이로드 직접 교정 (Edit Payload)
                </h3>
              </div>
              <button
                onClick={() => setIsPayloadEditorOpen(false)}
                className="p-1 rounded-lg hover:bg-[#262a33] text-[#908fa0] hover:text-[#dfe2ee]"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
              <p className="text-xs text-[#908fa0]">
                기존 모델의 출력에 누락된 파라미터를 추가하거나 올바른 함수명을 직접 수정하세요. 저장 시 SFT/DPO 정답으로 등록됩니다.
              </p>
              <textarea
                rows={12}
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="w-full bg-[#0a0e16] border border-[#262a33] rounded-xl p-3 font-mono text-xs text-[#dfe2ee] focus:outline-none focus:border-[#4cd7f6] transition-colors leading-relaxed resize-none"
              />
            </div>
            <div className="p-4 border-t border-[#262a33] flex items-center justify-end gap-2 bg-[#141820]">
              <button
                onClick={() => setIsPayloadEditorOpen(false)}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-mono text-[#dfe2ee] hover:bg-[#262a33]"
                type="button"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setActionVerdict('fix');
                  setIsPayloadEditorOpen(false);
                  showToast('교정된 정답 페이로드가 저장되었습니다.');
                }}
                className="min-h-[40px] px-5 py-2 bg-[#4cd7f6] hover:bg-[#38c9ea] text-[#001f26] rounded-xl font-mono text-xs font-bold shadow active:scale-95 transition-transform"
                type="button"
              >
                교정 완료 및 적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Quick Action Bar */}
      <div className="fixed lg:hidden bottom-14 left-0 right-0 p-3 bg-[#10141d]/95 backdrop-blur border-t border-[#262a33] z-40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono text-xs text-[#4cd7f6] font-bold truncate">후보 [{selectedCandidateId}]</span>
          <span className="text-[0.6875rem] text-[#908fa0] uppercase truncate">({actionVerdict})</span>
        </div>
        <button
          onClick={handleCommitNext}
          className="min-h-[44px] px-5 rounded-xl bg-[#4cd7f6] hover:bg-[#38c9ea] text-[#001f26] font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">task_alt</span>
          <span>판정 저장 & 다음</span>
        </button>
      </div>
    </div>
  );
};
