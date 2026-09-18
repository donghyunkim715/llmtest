import React, { useState, useEffect } from 'react';
import { StageRecord, InferenceCandidate, UserProfile } from '../../types/flywheel';

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
    editedPayload?: string
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

  const [selectedCandidateId, setSelectedCandidateId] = useState<'A' | 'B' | 'C' | 'D'>('C');
  const [actionVerdict, setActionVerdict] = useState<'adopt' | 'fix' | 'drop' | 'escalate'>('adopt');
  const [rationale, setRationale] = useState<string>('');
  const [viewMode, setViewMode] = useState<'json' | 'diff' | 'raw'>('json');
  const [isSysPromptOpen, setIsSysPromptOpen] = useState(false);
  const [isPayloadEditorOpen, setIsPayloadEditorOpen] = useState(false);
  const [customPayload, setCustomPayload] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state when current record changes
  useEffect(() => {
    if (currentRecord) {
      const defaultCandidate =
        currentRecord.reviewDecision?.selectedCandidateId ||
        currentRecord.candidates.find((c) => c.isRecommended)?.id ||
        'C';
      setSelectedCandidateId(defaultCandidate);
      setActionVerdict(currentRecord.reviewDecision?.action || 'adopt');
      setRationale(
        currentRecord.reviewDecision?.rationale ||
          '학생 모델(Distill v1.2)은 멀티인텐트(공조+내비) 결합 시 네비게이션 Tool Call을 아예 누락함. 좌석 파라미터 및 POI 명확화를 위해 Claude 3.5 Sonnet(후보 C)의 Tool Call 구조를 Ground-Truth 정답으로 승인함.'
      );
      const chosenCand = currentRecord.candidates.find((c) => c.id === defaultCandidate);
      setCustomPayload(chosenCand?.outputJson || '');
    }
  }, [currentRecordIndex, currentRecord]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCommitNext = () => {
    if (!currentRecord) return;
    onSaveVerdict(
      currentRecord.id,
      selectedCandidateId,
      actionVerdict,
      rationale,
      actionVerdict === 'fix' ? customPayload : undefined
    );
    showToast(`레코드 #${currentRecord.id} 판정 완료 (${currentUser.name}) - 다음 항목 로드`);

    if (currentRecordIndex < records.length - 1) {
      onSelectRecordIndex(currentRecordIndex + 1);
    }
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea or input
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'TEXTAREA' || targetTag === 'INPUT') {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          handleCommitNext();
        }
        return;
      }

      if (e.key === '1') setSelectedCandidateId('A');
      if (e.key === '2') setSelectedCandidateId('B');
      if (e.key === '3') setSelectedCandidateId('C');
      if (e.key === '4') setSelectedCandidateId('D');

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
  }, [currentRecordIndex, selectedCandidateId, actionVerdict, rationale, customPayload, records.length]);

  if (!currentRecord) {
    return <div className="p-8 text-center text-[#908fa0]">검수할 레코드가 없습니다.</div>;
  }

  const selectedCandidate = currentRecord.candidates.find((c) => c.id === selectedCandidateId);

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#31353e] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">task_alt</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">판정 기록 완료</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Command & Queue Navigator Bar */}
      <section className="bg-[#181c24] p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-[#262a33]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded border border-[#262a33]">
            <span className="font-mono text-xs uppercase text-[#908fa0]">Active Queue</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-semibold">#{currentRecord.runId}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded border border-[#262a33]">
            <span className="font-mono text-xs uppercase text-[#908fa0]">Stage</span>
            <span className="font-mono text-xs text-[#4edea3] font-medium">{currentRecord.stage} (Tool Call)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded border border-[#262a33]">
            <span className="font-mono text-xs uppercase text-[#908fa0]">Category</span>
            <span className="font-mono text-xs text-[#dfe2ee]">{currentRecord.category}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#93000a]/30 border border-[#ffb4ab]/30 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
            <span className="font-mono text-xs uppercase text-[#ffb4ab] font-semibold">
              {currentRecord.insightLabel}
            </span>
          </div>
        </div>

        {/* Queue Micro Navigator */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[#908fa0]">ITEM</span>
            <span className="font-semibold text-[#c0c1ff]">#{currentRecord.id}</span>
            <span className="text-[#464554]">/ {records.length} records</span>
          </div>

          <div className="w-32 bg-[#31353e] h-2 rounded-full overflow-hidden flex">
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

      {/* Bento Upper Row: Context / Prompt Inspector & Metadata Telemetry */}
      <div className="grid grid-cols-12 gap-4">
        {/* Input & Context Bento (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 bg-[#181c24] rounded-xl p-4 flex flex-col gap-3 shadow-md border border-[#262a33]">
          <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">quick_reference_all</span>
              <span className="font-semibold text-base text-[#dfe2ee] tracking-tight">Prompt & Multiturn Context</span>
              <span className="bg-[#31353e] px-1.5 py-0.5 rounded font-mono text-xs text-[#c7c4d7]">
                Hash: {currentRecord.hash}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1c2028] px-2.5 py-0.5 rounded font-mono text-xs text-[#4cd7f6] border border-[#262a33]">
                {currentRecord.carModel}
              </span>
              <span className="bg-[#1c2028] px-2.5 py-0.5 rounded font-mono text-xs text-[#908fa0] border border-[#262a33]">
                {currentRecord.clientVersion}
              </span>
              <button
                onClick={() => onOpenInPlayground(currentRecord)}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] rounded font-mono text-xs border border-[#8083ff]/40 transition-colors"
                title="이 레코드를 Eval Playground에서 열어 프롬프트 수정 및 추가 모델 테스트"
              >
                <span className="material-symbols-outlined text-[0.875rem]">terminal</span>
                <span>Playground Replay</span>
              </button>
            </div>
          </div>

          {/* Dialogue Stack */}
          <div className="flex flex-col gap-2 bg-[#0a0e16] p-3.5 rounded-lg border border-[#262a33]">
            {/* System Role Prompt (Collapsible) */}
            <div className="flex flex-col gap-1 text-[#c7c4d7]">
              <div
                className="flex items-center justify-between cursor-pointer select-none py-0.5"
                onClick={() => setIsSysPromptOpen(!isSysPromptOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-[#262a33] text-[#c0c1ff] px-1.5 py-0.5 rounded font-mono text-[0.6875rem] uppercase font-bold">
                    System
                  </span>
                  <span className="font-mono text-xs text-[#908fa0] truncate max-w-xl">
                    {currentRecord.systemPrompt.split('\n')[0]}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#908fa0] text-[1.125rem]">
                  {isSysPromptOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              {isSysPromptOpen && (
                <div className="font-mono text-xs text-[#c7c4d7] bg-[#181c24] p-2.5 rounded mt-1 border border-[#262a33] whitespace-pre-wrap leading-relaxed">
                  {currentRecord.systemPrompt}
                </div>
              )}
            </div>

            {currentRecord.priorTurns.length > 0 && <div className="h-[1px] bg-[#1c2028] my-1"></div>}

            {/* Previous Turns */}
            {currentRecord.priorTurns.map((turn, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                <span className="bg-[#1c2028] text-[#908fa0] px-1.5 py-0.5 rounded font-mono text-[0.6875rem] uppercase shrink-0 border border-[#262a33]">
                  Turn -1 ({turn.role === 'user' ? 'U' : 'A'})
                </span>
                <p className={turn.role === 'user' ? 'text-[#c7c4d7]' : 'text-[#908fa0]'}>{turn.text}</p>
              </div>
            ))}

            <div className="h-[1px] bg-[#1c2028] my-1"></div>

            {/* Current Target Query */}
            <div className="flex flex-col gap-1 bg-[#1c2028] p-3 rounded border border-[#262a33]">
              <div className="flex items-center justify-between">
                <span className="bg-[#8083ff] text-[#0d0096] px-2 py-0.5 rounded font-mono text-[0.6875rem] uppercase font-bold tracking-wider">
                  Current Target Query (User Voice)
                </span>
                <span className="font-mono text-[0.6875rem] text-[#4edea3]">Verified Audio Transcribe (WER 0.0%)</span>
              </div>
              <div className="text-sm md:text-base text-[#dfe2ee] font-semibold pt-1 flex flex-wrap items-center gap-1.5 leading-relaxed">
                {currentRecord.currentTargetQuery}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata & Quality Pulse Telemetry (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-[#181c24] rounded-xl p-4 flex flex-col justify-between shadow-md border border-[#262a33]">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-[#908fa0] font-semibold">Record Verification Status</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-[#4cd7f6] bg-[#1c2028] px-2.5 py-0.5 rounded border border-[#262a33]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                {currentRecord.reviewDecision ? 'Labeled (1차 완료)' : 'In Progress'}
              </span>
            </div>

            {/* Agreement Chart Inline SVG */}
            <div className="flex items-center gap-3 bg-[#0a0e16] p-3 rounded-lg my-2.5 border border-[#262a33]">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#31353e]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-[#4cd7f6]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="50, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-sm font-bold text-[#dfe2ee]">2/4</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#dfe2ee]">50% Agreement</span>
                <span className="text-xs text-[#908fa0] leading-tight">
                  Production & Distilled Student diverged. Teacher consensus ready.
                </span>
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1c2028] p-2.5 rounded border border-[#262a33] flex flex-col">
                <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase">Blocking Flags</span>
                <span className="font-mono text-base font-semibold text-[#4edea3]">
                  {currentRecord.blockingFlags} Issues
                </span>
              </div>
              <div className="bg-[#1c2028] p-2.5 rounded border border-[#262a33] flex flex-col">
                <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase">Intent Density</span>
                <span className="font-mono text-base font-semibold text-[#c0c1ff]">{currentRecord.intentDensity}</span>
              </div>
            </div>
          </div>

          {/* Global Diff/View Modes Switcher */}
          <div className="flex items-center justify-between pt-3 border-t border-[#262a33] mt-2">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase font-semibold">View Mode</span>
            <div className="inline-flex p-0.5 bg-[#31353e] rounded-lg border border-[#262a33]">
              <button
                onClick={() => setViewMode('json')}
                className={`px-2.5 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  viewMode === 'json' ? 'bg-[#8083ff] text-[#0d0096] shadow' : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
                }`}
              >
                JSON Tool View
              </button>
              <button
                onClick={() => setViewMode('diff')}
                className={`px-2.5 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  viewMode === 'diff' ? 'bg-[#8083ff] text-[#0d0096] shadow' : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
                }`}
              >
                Semantic Diff
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-2.5 py-1 rounded font-mono text-xs font-semibold transition-all ${
                  viewMode === 'raw' ? 'bg-[#8083ff] text-[#0d0096] shadow' : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
                }`}
              >
                Raw Payload
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Candidate Side-by-Side Comparator Bento (4 Columns Desktop) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[1.25rem]">compare_arrows</span>
            <h2 className="font-semibold text-base text-[#dfe2ee] tracking-tight">Candidate Inference Array</h2>
            <span className="font-mono text-xs text-[#908fa0]">4 Multi-Model Outputs</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-[#4edea3]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span> Valid Schema
            </span>
            <span className="flex items-center gap-1.5 text-[#ffb4ab]">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> Validation Failure
            </span>
            <span className="flex items-center gap-1.5 text-[#4cd7f6]">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span> Optimal Benchmark
            </span>
          </div>
        </div>

        {/* 4 Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {currentRecord.candidates.map((cand, idx) => {
            const isSelected = selectedCandidateId === cand.id;
            const isRecommended = cand.isRecommended;

            return (
              <div
                key={cand.id}
                onClick={() => setSelectedCandidateId(cand.id)}
                className={`rounded-xl p-3.5 flex flex-col justify-between shadow-md relative cursor-pointer transition-all duration-150 border ${
                  isSelected
                    ? 'bg-[#1c2028] ring-2 ring-[#4cd7f6] border-transparent shadow-[0_0_15px_rgba(76,215,246,0.2)]'
                    : 'bg-[#181c24] hover:bg-[#1c2028] border-[#262a33]'
                }`}
              >
                {/* Recommended Tag */}
                {isRecommended && (
                  <div className="absolute -top-3 left-4 bg-[#4cd7f6] text-[#003640] px-2 py-0.5 rounded-full font-mono text-[0.625rem] font-bold uppercase shadow flex items-center gap-1">
                    <span className="material-symbols-outlined text-[0.75rem]">auto_awesome</span>
                    <span>Benchmark Choice (Recommended)</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cand.schemaStatus === 'invalid'
                            ? 'bg-[#ffb4ab]'
                            : isRecommended
                            ? 'bg-[#4cd7f6]'
                            : 'bg-[#4edea3]'
                        }`}
                      ></span>
                      <span
                        className={`font-mono text-xs font-bold uppercase ${
                          cand.schemaStatus === 'invalid'
                            ? 'text-[#ffb4ab]'
                            : isSelected
                            ? 'text-[#4cd7f6]'
                            : 'text-[#dfe2ee]'
                        }`}
                      >
                        {cand.label}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[0.6875rem] uppercase font-semibold ${
                        cand.schemaStatus === 'invalid'
                          ? 'bg-[#93000a]/40 text-[#ffb4ab]'
                          : isRecommended
                          ? 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                          : 'bg-[#1c2028] text-[#908fa0]'
                      }`}
                    >
                      {cand.modelName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#908fa0] font-mono text-xs bg-[#0a0e16] px-2 py-1 rounded border border-[#262a33]">
                    <span>Latency: {cand.latencyMs}ms</span>
                    <span
                      className={`font-semibold ${
                        cand.judgeScore >= 90
                          ? 'text-[#4edea3]'
                          : cand.judgeScore >= 70
                          ? 'text-[#4cd7f6]'
                          : 'text-[#ffb4ab]'
                      }`}
                    >
                      Judge: {cand.judgeScore}/100
                    </span>
                  </div>

                  {/* Failure Tag if invalid */}
                  {cand.schemaStatus === 'invalid' && (
                    <div className="bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffb4ab] p-1.5 rounded flex items-center gap-1 font-mono text-[0.6875rem] font-bold">
                      <span className="material-symbols-outlined text-[0.875rem]">error</span>
                      <span className="truncate">{cand.validationErrorNote || 'SCHEMA_VALIDATION_ERROR'}</span>
                    </div>
                  )}

                  {/* Code Viewport */}
                  <div className="bg-[#0a0e16] p-2.5 rounded-lg font-mono text-xs overflow-x-auto min-h-[220px] max-h-[260px] border border-[#262a33]">
                    <pre className="text-[#c7c4d7] leading-relaxed whitespace-pre-wrap">
                      <code>{cand.outputJson}</code>
                    </pre>
                  </div>

                  <p className="text-xs text-[#c7c4d7] leading-tight min-h-[32px]">{cand.explanation}</p>
                </div>

                {/* Bottom Select Pill */}
                <div className="pt-3 border-t border-[#262a33] mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="selected_candidate"
                      value={cand.id}
                      checked={isSelected}
                      onChange={() => setSelectedCandidateId(cand.id)}
                      className="w-3.5 h-3.5 accent-[#4cd7f6] bg-[#0a0e16]"
                    />
                    <span
                      className={`font-mono text-xs uppercase font-bold ${
                        isSelected ? 'text-[#4cd7f6]' : 'text-[#908fa0]'
                      }`}
                    >
                      Select [{cand.id}] {isSelected && '(Target)'}
                    </span>
                  </label>
                  <span className="font-mono text-xs text-[#908fa0]">HotKey: {idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Decision & Verdict Action Bento (Bottom Control Pad) */}
      <section className="bg-[#181c24] rounded-xl p-4 shadow-xl flex flex-col gap-3 border border-[#262a33]">
        <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">gavel</span>
            <h3 className="font-semibold text-base text-[#dfe2ee]">Alignment Decision & Ground-Truth Verdict</h3>
          </div>
          <div className="flex items-center gap-1 font-mono text-[0.6875rem] text-[#908fa0]">
            <span className="material-symbols-outlined text-[0.875rem]">keyboard</span>
            <span>Shortcuts: [A] OK • [F] FIX • [D] DROP • [U] Escalate • [1-4] Choice • [⌘+Enter] Save</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          {/* Verdict Button Matrix (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-1.5">
            <span className="font-mono text-[0.6875rem] uppercase text-[#908fa0] font-semibold">Select Action Mode</span>
            <div className="grid grid-cols-2 gap-2">
              {/* A: OK Adopt Best */}
              <button
                onClick={() => setActionVerdict('adopt')}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-sm font-semibold transition-all border ${
                  actionVerdict === 'adopt'
                    ? 'bg-[#00885d] text-[#000703] border-[#4edea3] shadow'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">check_circle</span>
                  <span>Adopt Best</span>
                </div>
                <span className="font-mono text-xs bg-black/20 px-1 rounded text-white">[A] OK</span>
              </button>

              {/* F: FIX Edit Payload */}
              <button
                onClick={() => {
                  setActionVerdict('fix');
                  setIsPayloadEditorOpen(true);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-sm font-semibold transition-all border ${
                  actionVerdict === 'fix'
                    ? 'bg-[#03b5d3] text-[#001f26] border-[#4cd7f6] shadow'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">build_circle</span>
                  <span>Edit Payload</span>
                </div>
                <span className="font-mono text-xs bg-black/20 px-1 rounded text-white">[F] FIX</span>
              </button>

              {/* D: DROP Quarantine */}
              <button
                onClick={() => setActionVerdict('drop')}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-sm font-semibold transition-all border ${
                  actionVerdict === 'drop'
                    ? 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab] shadow'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">block</span>
                  <span>Quarantine</span>
                </div>
                <span className="font-mono text-xs bg-black/20 px-1 rounded text-white">[D] DROP</span>
              </button>

              {/* U: Escalate */}
              <button
                onClick={() => setActionVerdict('escalate')}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-sm font-semibold transition-all border ${
                  actionVerdict === 'escalate'
                    ? 'bg-[#31353e] text-[#c0c1ff] border-[#8083ff] shadow'
                    : 'bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border-[#262a33]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[1.125rem]">help</span>
                  <span>Escalate</span>
                </div>
                <span className="font-mono text-xs bg-black/20 px-1 rounded text-white">[U]</span>
              </button>
            </div>

            <div className="flex items-center justify-between mt-1 bg-[#0a0e16] px-2.5 py-1.5 rounded border border-[#262a33] font-mono text-xs">
              <span className="text-[#908fa0]">Assigned Target:</span>
              <span className="text-[#4cd7f6] font-semibold">
                Candidate {selectedCandidateId} ({selectedCandidate?.modelName})
              </span>
            </div>
          </div>

          {/* Reviewer Rationale Field (6 Cols) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[0.6875rem] uppercase text-[#908fa0]">
              <span>Reviewer Rationale & Alignment Notes</span>
              <span className="text-[#c0c1ff] font-mono">Auto-Drafted from Student Gap pattern</span>
            </div>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={3}
              placeholder="기록 이유 및 미세조정 데이터셋 편입 근거를 입력하세요..."
              className="w-full bg-[#0a0e16] text-[#dfe2ee] p-2.5 rounded font-mono text-xs placeholder-[#908fa0] focus:outline-none focus:ring-1 focus:ring-[#8083ff] border border-[#262a33] resize-none leading-relaxed"
            />
            {actionVerdict === 'fix' && (
              <div className="flex items-center justify-between bg-[#1c2028] px-2.5 py-1 rounded text-xs border border-[#4cd7f6]/40">
                <span className="text-[#4cd7f6] font-mono">💡 Payload가 수정 모드로 설정되었습니다.</span>
                <button
                  onClick={() => setIsPayloadEditorOpen(true)}
                  className="text-xs text-[#c0c1ff] underline hover:text-white"
                >
                  수정 에디터 열기
                </button>
              </div>
            )}
          </div>

          {/* Primary Action CTA (2 Cols) */}
          <div className="col-span-12 lg:col-span-2 flex flex-col justify-end gap-2 h-full">
            <button
              onClick={handleCommitNext}
              className="w-full h-14 bg-[#c0c1ff] text-[#1000a9] hover:bg-[#8083ff] hover:text-white rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[1.25rem]">send</span>
                <span className="text-base">Commit</span>
              </div>
              <span className="font-mono text-[0.6875rem] uppercase font-normal opacity-80">& Next Item (⌘+↵)</span>
            </button>

            <button
              onClick={() => {
                if (currentRecordIndex < records.length - 1) {
                  onSelectRecordIndex(currentRecordIndex + 1);
                }
              }}
              className="w-full py-1 text-center font-mono text-xs text-[#908fa0] hover:text-[#dfe2ee] transition-colors"
            >
              Skip for now (Esc)
            </button>
          </div>
        </div>
      </section>

      {/* Payload Editor Modal when [F] FIX is selected */}
      {isPayloadEditorOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181c24] border border-[#31353e] rounded-xl w-full max-w-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6]">build_circle</span>
                <span className="font-bold text-base text-[#dfe2ee]">Ground-Truth Payload 수동 교정 (Edit Payload)</span>
              </div>
              <button
                onClick={() => setIsPayloadEditorOpen(false)}
                className="text-[#908fa0] hover:text-white material-symbols-outlined"
              >
                close
              </button>
            </div>

            <p className="text-xs text-[#c7c4d7]">
              선택한 후보 [{selectedCandidateId}]의 JSON 도구 호출 구조를 미세조정 정답 형태로 직접 교정합니다.
            </p>

            <textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              rows={12}
              className="w-full bg-[#0a0e16] text-[#4edea3] p-3 rounded font-mono text-xs border border-[#262a33] focus:outline-none focus:ring-1 focus:ring-[#4cd7f6]"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsPayloadEditorOpen(false)}
                className="px-4 py-1.5 rounded bg-[#262a33] hover:bg-[#31353e] text-xs text-[#dfe2ee]"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setIsPayloadEditorOpen(false);
                  showToast('교정된 Payload가 임시 저장되었습니다.');
                }}
                className="px-4 py-1.5 rounded bg-[#4cd7f6] text-[#003640] font-bold text-xs hover:bg-[#03b5d3]"
              >
                교정본 적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
