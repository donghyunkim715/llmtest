import React, { useState } from 'react';
import { StageRecord, UserProfile } from '../../types/flywheel';

interface ApprovalWorkbenchProps {
  records: StageRecord[];
  currentUser: UserProfile;
  onApproveRecord: (recordId: string, note?: string) => void;
  onReturnRecord: (recordId: string, note: string) => void;
  onSelectRecordForReview: (index: number) => void;
}

export const ApprovalWorkbenchView: React.FC<ApprovalWorkbenchProps> = ({
  records,
  currentUser,
  onApproveRecord,
  onReturnRecord,
  onSelectRecordForReview,
}) => {
  const [filterTab, setFilterTab] = useState<'pending' | 'approved' | 'returned' | 'all'>('pending');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || '');
  const [returnNote, setReturnNote] = useState<string>('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  const filteredRecords = records.filter((r) => {
    if (filterTab === 'pending') return r.reviewDecision && !r.approvalDecision;
    if (filterTab === 'approved') return r.approvalDecision?.status === 'approved';
    if (filterTab === 'returned') return r.approvalDecision?.status === 'returned';
    return true;
  });

  const handleApprove = (recordId: string) => {
    onApproveRecord(recordId, 'Approved for foundation model distillation & SFT handoff');
    showToast(`레코드 #${recordId} 2차 승인 완료!`);
  };

  const handleReturnConfirm = () => {
    if (!selectedRecord) return;
    onReturnRecord(selectedRecord.id, returnNote || 'Schema rubric mismatch - please re-evaluate');
    setIsReturnModalOpen(false);
    setReturnNote('');
    showToast(`레코드 #${selectedRecord.id} 1차 라벨러에게 반려되었습니다.`);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      {toastMsg && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#31353e] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">verified</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">승인 상태 업데이트</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMsg}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
            <span className="material-symbols-outlined text-[1.5rem]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-lg text-[#dfe2ee] tracking-tight flex items-center gap-2">
              2차 검수 및 최종 승인 워크벤치 (Approval Workbench)
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3]">
                TIER-2 SIGN-OFF
              </span>
            </h1>
            <p className="text-xs text-[#c7c4d7]">
              1차 검수자가 채택·교정한 Ground-Truth 정답을 승인하여 파운데이션 학습 데이터셋(SFT/DPO)에 편입합니다.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#1c2028] p-1 rounded-lg border border-[#262a33]">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-all ${
              filterTab === 'pending' ? 'bg-[#8083ff] text-[#0d0096]' : 'text-[#c7c4d7] hover:text-white'
            }`}
          >
            2차 대기 ({records.filter((r) => r.reviewDecision && !r.approvalDecision).length})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-all ${
              filterTab === 'approved' ? 'bg-[#8083ff] text-[#0d0096]' : 'text-[#c7c4d7] hover:text-white'
            }`}
          >
            승인 완료 ({records.filter((r) => r.approvalDecision?.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterTab('returned')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-all ${
              filterTab === 'returned' ? 'bg-[#8083ff] text-[#0d0096]' : 'text-[#c7c4d7] hover:text-white'
            }`}
          >
            반려 ({records.filter((r) => r.approvalDecision?.status === 'returned').length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-all ${
              filterTab === 'all' ? 'bg-[#8083ff] text-[#0d0096]' : 'text-[#c7c4d7] hover:text-white'
            }`}
          >
            전체 ({records.length})
          </button>
        </div>
      </div>

      {/* Split Workbench Layout */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left List Queue (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-[#181c24] rounded-xl p-3 border border-[#262a33] shadow-md flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a33] px-1">
            <span className="font-mono text-xs font-semibold text-[#908fa0] uppercase">
              Queue Records ({filteredRecords.length}건)
            </span>
            <span className="font-mono text-[0.6875rem] text-[#4cd7f6]">Run #run-w11</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#908fa0]">해당 필터에 속한 레코드가 없습니다.</div>
            ) : (
              filteredRecords.map((r) => {
                const isSelected = selectedRecord?.id === r.id;
                const isApproved = r.approvalDecision?.status === 'approved';
                const isReturned = r.approvalDecision?.status === 'returned';

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRecordId(r.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1c2028] border-[#4cd7f6] ring-1 ring-[#4cd7f6]'
                        : 'bg-[#0a0e16] hover:bg-[#1c2028] border-[#262a33]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-[#c0c1ff]">#{r.id}</span>
                      {isApproved ? (
                        <span className="px-1.5 py-0.2 rounded font-mono text-[0.625rem] bg-[#00885d]/30 text-[#4edea3] font-bold">
                          APPROVED
                        </span>
                      ) : isReturned ? (
                        <span className="px-1.5 py-0.2 rounded font-mono text-[0.625rem] bg-[#93000a]/40 text-[#ffb4ab] font-bold">
                          RETURNED
                        </span>
                      ) : r.reviewDecision ? (
                        <span className="px-1.5 py-0.2 rounded font-mono text-[0.625rem] bg-[#03b5d3]/20 text-[#4cd7f6] font-bold">
                          1차 완료 (대기)
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded font-mono text-[0.625rem] bg-[#31353e] text-[#908fa0]">
                          미착수
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-[#dfe2ee] truncate">{r.currentTargetQuery}</div>
                    <div className="flex items-center justify-between text-[0.6875rem] text-[#908fa0] mt-2 font-mono">
                      <span>{r.category}</span>
                      <span>Target: [{r.reviewDecision?.selectedCandidateId || 'C'}]</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail & Approval Action Pad (8 Cols) */}
        {selectedRecord && (
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            {/* Record Verification Card */}
            <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#4cd7f6] font-bold">#{selectedRecord.id}</span>
                  <span className="text-xs text-[#908fa0]">({selectedRecord.carModel})</span>
                  <span className="px-2 py-0.5 rounded bg-[#1c2028] text-xs font-mono text-[#c7c4d7]">
                    Stage: {selectedRecord.stage}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const idx = records.findIndex((r) => r.id === selectedRecord.id);
                    if (idx >= 0) onSelectRecordForReview(idx);
                  }}
                  className="text-xs text-[#c0c1ff] hover:underline font-mono flex items-center gap-1"
                >
                  <span>1차 라벨링 워크벤치에서 보기</span>
                  <span className="material-symbols-outlined text-[0.875rem]">open_in_new</span>
                </button>
              </div>

              {/* User Voice */}
              <div className="bg-[#0a0e16] p-3 rounded-lg border border-[#262a33]">
                <div className="font-mono text-[0.6875rem] text-[#908fa0] uppercase">사용자 발화 (Voice Query)</div>
                <div className="text-sm font-semibold text-[#dfe2ee] mt-1">{selectedRecord.currentTargetQuery}</div>
              </div>

              {/* 1st Reviewer Verdict Summary */}
              <div className="bg-[#1c2028] p-3.5 rounded-lg border border-[#31353e] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4edea3] text-[1.25rem]">assignment_turned_in</span>
                    <span className="font-bold text-xs text-[#dfe2ee]">1차 검수자 판정 결과 (Review Verdict)</span>
                  </div>
                  <div className="text-[0.6875rem] font-mono text-[#908fa0]">
                    Reviewer: <span className="text-[#c0c1ff] font-semibold">{selectedRecord.reviewDecision?.reviewerName || '김민수'}</span> (
                    {selectedRecord.reviewDecision?.reviewedAt || '2025-03-08'})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-1">
                  <div className="bg-[#0a0e16] p-2 rounded border border-[#262a33]">
                    <span className="text-[#908fa0] block text-[0.625rem]">채택된 최종 타겟:</span>
                    <span className="text-[#4cd7f6] font-bold text-sm">
                      Candidate [{selectedRecord.reviewDecision?.selectedCandidateId || 'C'}] -{' '}
                      {selectedRecord.candidates.find((c) => c.id === (selectedRecord.reviewDecision?.selectedCandidateId || 'C'))?.modelName}
                    </span>
                  </div>
                  <div className="bg-[#0a0e16] p-2 rounded border border-[#262a33]">
                    <span className="text-[#908fa0] block text-[0.625rem]">조치 모드 (Action):</span>
                    <span className="text-[#4edea3] font-bold text-sm uppercase">
                      [{selectedRecord.reviewDecision?.action || 'adopt'}] OK
                    </span>
                  </div>
                </div>

                <div className="bg-[#0a0e16] p-2.5 rounded border border-[#262a33] text-xs text-[#c7c4d7] leading-relaxed">
                  <span className="font-mono text-[0.625rem] text-[#908fa0] block mb-0.5">라벨러 검수 근거 (Rationale):</span>
                  {selectedRecord.reviewDecision?.rationale || '표준 스키마 완전 준수 및 멀티인텐트 복원 완료.'}
                </div>
              </div>

              {/* Adopted Payload Preview */}
              <div className="flex flex-col gap-1">
                <div className="font-mono text-xs text-[#908fa0] flex items-center justify-between">
                  <span>승인 대상 Ground-Truth Payload:</span>
                  <span className="text-[#4edea3] text-[0.6875rem]">Ready for JSON Schema Compilation</span>
                </div>
                <div className="bg-[#0a0e16] p-3 rounded-lg font-mono text-xs max-h-56 overflow-y-auto border border-[#262a33]">
                  <pre className="text-[#4edea3]">
                    <code>
                      {selectedRecord.reviewDecision?.editedPayload ||
                        selectedRecord.candidates.find((c) => c.id === (selectedRecord.reviewDecision?.selectedCandidateId || 'C'))
                          ?.outputJson}
                    </code>
                  </pre>
                </div>
              </div>

              {/* 2nd Sign-off Action Bar */}
              <div className="mt-2 pt-3 border-t border-[#262a33] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[1.125rem]">verified</span>
                  <span className="text-xs text-[#c7c4d7]">
                    현재 로그인: <strong className="text-white">{currentUser.name}</strong> ({currentUser.title})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsReturnModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#93000a]/40 hover:text-[#ffb4ab] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[1rem]">reply</span>
                    <span>1차로 반려 (Return)</span>
                  </button>

                  <button
                    onClick={() => handleApprove(selectedRecord.id)}
                    className="px-5 py-2 rounded-lg bg-[#00885d] hover:bg-[#4edea3] text-white hover:text-black text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[1.125rem]">task_alt</span>
                    <span>최종 학습 데이터셋 편입 승인 (Approve)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Return Note Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181c24] border border-[#31353e] rounded-xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center gap-2 text-[#ffb4ab]">
                <span className="material-symbols-outlined">reply</span>
                <span className="font-bold text-sm">1차 라벨러에게 재작업 반려 사유 작성</span>
              </div>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="text-[#908fa0] hover:text-white material-symbols-outlined"
              >
                close
              </button>
            </div>
            <p className="text-xs text-[#c7c4d7]">
              레코드 #{selectedRecord?.id}의 1차 판정 결과가 반려됩니다. 1차 검수자 큐에 반려 사유와 함께 복귀됩니다.
            </p>
            <textarea
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              placeholder="예: 윈도우 조작 시 안전 모터 펄스 파라미터가 누락되었으니 후보 D 또는 교정본을 반영해주세요."
              rows={4}
              className="w-full bg-[#0a0e16] text-[#dfe2ee] p-2.5 rounded text-xs border border-[#262a33] focus:outline-none focus:ring-1 focus:ring-[#ffb4ab]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="px-3 py-1.5 bg-[#262a33] hover:bg-[#31353e] rounded text-xs text-[#dfe2ee]"
              >
                취소
              </button>
              <button
                onClick={handleReturnConfirm}
                className="px-4 py-1.5 bg-[#93000a] hover:bg-[#ffb4ab] text-[#ffdad6] hover:text-[#690005] font-bold rounded text-xs transition-colors"
              >
                반려 전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
