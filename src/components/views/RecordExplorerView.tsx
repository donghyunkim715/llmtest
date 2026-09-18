import React, { useState } from 'react';
import { StageRecord } from '../../types/flywheel';

interface RecordExplorerProps {
  records: StageRecord[];
  onSelectRecordForReview: (index: number) => void;
  onOpenInPlayground: (record: StageRecord) => void;
}

export const RecordExplorerView: React.FC<RecordExplorerProps> = ({
  records,
  onSelectRecordForReview,
  onOpenInPlayground,
}) => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<StageRecord | null>(null);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.currentTargetQuery.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.carModel.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || r.stage.toUpperCase() === stageFilter.toUpperCase();
    return matchesSearch && matchesStage;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
        <div>
          <h1 className="text-lg font-bold text-[#dfe2ee] flex flex-wrap items-center gap-2">
            <span>레코드 탐색기 (Record Explorer)</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#8083ff]/20 text-[#c0c1ff]">
              TELEMETRY ARCHIVE
            </span>
          </h1>
          <p className="text-xs text-[#c7c4d7] mt-1">
            수집된 모든 차량 음성 및 도구 호출 로그를 검색하고, 모델별 추론 결과와 1차/2차 판정 이력을 조회합니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Record ID, Query, Car Model..."
            className="bg-[#0a0e16] border border-[#262a33] rounded-lg px-3 py-2 text-xs font-mono w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-[#0a0e16] border border-[#262a33] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none"
          >
            <option value="ALL">전체 Stage</option>
            <option value="ROUTER">Router</option>
            <option value="PLANNER">Planner</option>
            <option value="RESPGEN">Respgen</option>
          </select>
        </div>
      </div>

      {/* Mobile Card List (< sm) */}
      <div className="flex sm:hidden flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#181c24] rounded-xl border border-[#262a33] text-[#908fa0] text-xs font-mono">
            검색 조건과 일치하는 레코드가 없습니다.
          </div>
        ) : (
          filtered.map((r, idx) => {
            const isApproved = r.approvalDecision?.status === 'approved';
            const isReviewed = Boolean(r.reviewDecision);

            return (
              <div key={r.id} className="bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold font-mono text-xs text-[#4cd7f6]">#{r.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.625rem] font-mono px-2 py-0.5 rounded bg-[#262a33] text-[#dfe2ee]">
                      {r.carModel}
                    </span>
                    {isApproved ? (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#00885d]/30 text-[#4edea3] font-bold">
                        최종 승인
                      </span>
                    ) : isReviewed ? (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#03b5d3]/20 text-[#4cd7f6] font-bold">
                        1차 완료
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#262a33] text-[#908fa0]">미검수</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#0a0e16] p-2.5 rounded-lg border border-[#262a33]">
                  <div className="flex items-center justify-between text-[0.6875rem] font-mono text-[#908fa0] mb-1">
                    <span className="text-[#4edea3] font-semibold">{r.stage} · {r.category}</span>
                    <span className="text-[#c0c1ff]">일치율: {r.agreementRate}</span>
                  </div>
                  <p className="text-xs text-[#dfe2ee] font-medium leading-snug line-clamp-2">
                    &ldquo;{r.currentTargetQuery}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onSelectRecordForReview(idx)}
                    type="button"
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#8083ff]/20 hover:bg-[#8083ff] text-[#c0c1ff] hover:text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">rate_review</span>
                    <span>판정하기</span>
                  </button>
                  <button
                    onClick={() => onOpenInPlayground(r)}
                    type="button"
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#4cd7f6] font-mono text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>Replay</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Table (>= sm) */}
      <div className="hidden sm:block bg-[#181c24] rounded-xl border border-[#262a33] overflow-x-auto no-scrollbar shadow-md">
        <table className="w-full text-left font-mono text-xs border-collapse min-w-[680px]">
          <thead>
            <tr className="bg-[#0a0e16] text-[#908fa0] uppercase text-[0.6875rem] border-b border-[#262a33]">
              <th className="p-3.5">Record ID</th>
              <th className="p-3.5">Car Model</th>
              <th className="p-3.5">Stage / Category</th>
              <th className="p-3.5">Target Query (Voice)</th>
              <th className="p-3.5 text-center">Agreement</th>
              <th className="p-3.5 text-center">Review Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262a33]">
            {filtered.map((r, idx) => {
              const isApproved = r.approvalDecision?.status === 'approved';
              const isReviewed = Boolean(r.reviewDecision);

              return (
                <tr key={r.id} className="hover:bg-[#1c2028] transition-colors">
                  <td className="p-3.5 font-bold text-[#4cd7f6]">#{r.id}</td>
                  <td className="p-3.5 text-[#dfe2ee]">{r.carModel}</td>
                  <td className="p-3.5">
                    <span className="text-[#4edea3] font-semibold">{r.stage}</span>
                    <span className="text-[#908fa0] block text-[0.6875rem]">{r.category}</span>
                  </td>
                  <td className="p-3.5 text-[#dfe2ee] max-w-xs truncate">{r.currentTargetQuery}</td>
                  <td className="p-3.5 text-center font-bold text-[#c0c1ff]">{r.agreementRate}</td>
                  <td className="p-3.5 text-center">
                    {isApproved ? (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#00885d]/30 text-[#4edea3] font-bold">
                        최종 승인완료
                      </span>
                    ) : isReviewed ? (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#03b5d3]/20 text-[#4cd7f6] font-bold">
                        1차 판정 완료
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#262a33] text-[#908fa0]">미검수</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => onSelectRecordForReview(idx)}
                      className="px-2 py-1 rounded bg-[#8083ff]/20 hover:bg-[#8083ff] text-[#c0c1ff] hover:text-white transition-colors text-[0.6875rem] font-bold"
                    >
                      판정하기
                    </button>
                    <button
                      onClick={() => onOpenInPlayground(r)}
                      className="px-2 py-1 rounded bg-[#262a33] hover:bg-[#31353e] text-[#4cd7f6] transition-colors text-[0.6875rem]"
                    >
                      Replay
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
