import React, { useState } from 'react';

interface InsightsViewProps {
  onNavigateToLabelingWithFilter?: (stage: string, category: string) => void;
  onOpenPlaygroundWithPreset?: (category: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  onNavigateToLabelingWithFilter,
  onOpenPlaygroundWithPreset,
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    stage: string;
    category: string;
    count: number;
    percentage: string;
  } | null>({
    stage: 'Planner',
    category: 'Vehicle Control',
    count: 148,
    percentage: '35.9%',
  });

  const [isSynthesisModalOpen, setIsSynthesisModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleCellClick = (stage: string, category: string, count: number, percentage: string) => {
    setSelectedCell({ stage, category, count, percentage });
  };

  const handleDrilldownJump = () => {
    if (selectedCell && onNavigateToLabelingWithFilter) {
      onNavigateToLabelingWithFilter(selectedCell.stage, selectedCell.category);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      {toastMessage && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#31353e] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">task_alt</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">작업 완료</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Control Bar / Global Filter Panel */}
      <div className="bg-[#181c24] rounded-xl p-3.5 shadow-md border border-[#262a33] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Period Selector */}
          <div className="flex items-center gap-1.5 bg-[#262a33] px-2.5 py-1.5 rounded-lg border border-[#31353e]">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[1.125rem]">calendar_month</span>
            <span className="font-mono text-xs text-[#908fa0] uppercase">Period:</span>
            <span className="font-mono text-xs text-[#dfe2ee] font-semibold">최근 7일</span>
            <span className="material-symbols-outlined text-[#908fa0] text-[1rem]">arrow_drop_down</span>
          </div>

          {/* Run Selection */}
          <div className="flex items-center gap-1.5 bg-[#262a33] px-2.5 py-1.5 rounded-lg border border-[#31353e]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[1.125rem]">terminal</span>
            <span className="font-mono text-xs text-[#908fa0] uppercase">Run:</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-bold">run-2025-03-w1</span>
          </div>

          {/* Stage Selector */}
          <div className="flex items-center gap-1.5 bg-[#262a33] px-2.5 py-1.5 rounded-lg border border-[#31353e]">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.125rem]">account_tree</span>
            <span className="font-mono text-xs text-[#908fa0] uppercase">Stage:</span>
            <span className="font-mono text-xs text-[#dfe2ee]">전체 (3 Stages)</span>
          </div>

          <div className="hidden xl:block h-6 w-px bg-[#31353e]"></div>

          {/* Model Pair Configurations */}
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-2.5 py-1 rounded-lg border border-[#262a33]">
            <span className="font-mono text-[0.6875rem] text-[#4cd7f6] uppercase tracking-wider font-bold">Student</span>
            <span className="font-mono text-xs text-[#dfe2ee] bg-[#0a0e16] px-1.5 py-0.5 rounded">gleo-student-v1.2</span>
            <span className="material-symbols-outlined text-[#908fa0] text-[0.875rem]">compare_arrows</span>
            <span className="font-mono text-[0.6875rem] text-[#c0c1ff] uppercase tracking-wider font-bold">Teachers</span>
            <span className="font-mono text-xs text-[#dfe2ee] bg-[#0a0e16] px-1.5 py-0.5 rounded">claude-3-5 + gpt-4o</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-[#31353e] hover:bg-[#353942] text-[#dfe2ee] px-3 py-1.5 rounded-lg transition-colors font-mono text-xs font-semibold">
            <span className="material-symbols-outlined text-[1.125rem]">tune</span>
            <span>Filters</span>
          </button>
          <button
            onClick={() => showToast('선택된 불일치 슬라이스(886건) NDJSON이 다운로드 큐에 추가되었습니다.')}
            className="flex items-center gap-1.5 bg-[#c0c1ff] text-[#1000a9] font-bold px-3 py-1.5 rounded-lg shadow hover:bg-[#8083ff] hover:text-white transition-colors font-mono text-xs"
          >
            <span className="material-symbols-outlined text-[1.125rem]">download_for_offline</span>
            <span>Export Slice</span>
          </button>
        </div>
      </div>

      {/* Section 11 Header Banner with Live Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c0c1ff] font-bold">
              Diagnostics // Section 11
            </span>
            <span className="px-1.5 py-0.5 bg-[#8083ff]/20 text-[#c0c1ff] rounded font-mono text-[0.625rem] font-bold border border-[#8083ff]/30">
              EVAL v2.4.9
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#dfe2ee] tracking-tight flex items-center gap-2">
            인사이트 & 모델 갭 분석
            <span className="text-xs text-[#908fa0] font-normal mt-1 font-mono">(Model vs System Gap Matrix)</span>
          </h1>
        </div>

        <div className="flex items-center gap-5 bg-[#0a0e16] px-5 py-2.5 rounded-xl border border-[#262a33] shadow-inner">
          <div className="flex flex-col">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase">Total Inferences</span>
            <span className="font-mono text-base font-bold text-[#dfe2ee]">
              14,820 <span className="text-[#4edea3] text-xs font-normal">records</span>
            </span>
          </div>
          <div className="h-8 w-px bg-[#31353e]"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase">Discrepancy Volume</span>
            <span className="font-mono text-base font-bold text-[#ffb4ab]">
              886 <span className="text-[#c7c4d7] text-xs font-normal">(5.98%)</span>
            </span>
          </div>
          <div className="h-8 w-px bg-[#31353e]"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase">Target Agreement</span>
            <span className="font-mono text-base font-bold text-[#4cd7f6]">94.02%</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Level 1: Core Gap Bento Metrics (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Student Gap Card */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#262a33] group hover:bg-[#1c2028] transition-all">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#ffb4ab]/10 rounded-full blur-xl"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-[#93000a]/40 text-[#ffb4ab] px-2 py-0.5 rounded font-mono text-[0.6875rem] font-bold border border-[#ffb4ab]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                PRIMARY BOTTLENECK
              </div>
              <span className="material-symbols-outlined text-[#ffb4ab] text-[1.25rem]">trending_down</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold text-[#dfe2ee]">412</span>
              <span className="font-mono text-sm text-[#ffb4ab] font-bold">2.8%</span>
            </div>
            <p className="font-semibold text-base text-[#dfe2ee] mb-1">Student Gap</p>
            <p className="text-xs text-[#c7c4d7]">학생 모델 성능 미달 (양대 교사 모델 합의 통과, Student 추론 실패)</p>
          </div>
          <div className="mt-4 pt-2.5 flex items-center justify-between bg-[#0a0e16]/60 -mx-4 -mb-4 p-3 border-t border-[#262a33]">
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">Action: Fine-tuning Slice</span>
            <button
              onClick={() => handleCellClick('Planner', 'Vehicle Control', 148, '35.9%')}
              className="font-mono text-xs text-[#c0c1ff] hover:text-white font-bold flex items-center gap-1"
            >
              Queue 412 Records <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Label Suspect Card */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#262a33] group hover:bg-[#1c2028] transition-all">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#03b5d3]/15 rounded-full blur-xl"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-[#262a33] px-2 py-0.5 rounded font-mono text-[0.6875rem] text-[#4cd7f6] font-bold border border-[#4cd7f6]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                GROUND TRUTH DRIFT
              </div>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">flag_circle</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold text-[#dfe2ee]">89</span>
              <span className="font-mono text-sm text-[#4cd7f6] font-bold">0.6%</span>
            </div>
            <p className="font-semibold text-base text-[#dfe2ee] mb-1">Label Suspect</p>
            <p className="text-xs text-[#c7c4d7]">실운영 Production Label 오류 의심 (Student & Teachers 모두 기존 정답과 상충)</p>
          </div>
          <div className="mt-4 pt-2.5 flex items-center justify-between bg-[#0a0e16]/60 -mx-4 -mb-4 p-3 border-t border-[#262a33]">
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">Target: Human Relabeling</span>
            <button
              onClick={() => handleCellClick('Router', 'Navigation', 28, '6.8%')}
              className="font-mono text-xs text-[#4cd7f6] hover:text-white font-bold flex items-center gap-1"
            >
              2nd Review Queue <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Teacher Split Card */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#262a33] group hover:bg-[#1c2028] transition-all">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#8083ff]/15 rounded-full blur-xl"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-[#262a33] px-2 py-0.5 rounded font-mono text-[0.6875rem] text-[#c0c1ff] font-bold border border-[#8083ff]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                POLICY AMBIGUITY
              </div>
              <span className="material-symbols-outlined text-[#c0c1ff] text-[1.25rem]">balance</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold text-[#dfe2ee]">154</span>
              <span className="font-mono text-sm text-[#c0c1ff] font-bold">1.0%</span>
            </div>
            <p className="font-semibold text-base text-[#dfe2ee] mb-1">Teacher Split</p>
            <p className="text-xs text-[#c7c4d7]">프롬프트 정책 모호성 / 교사 불일치 (Claude vs GPT-4o 판정 불일치 발생)</p>
          </div>
          <div className="mt-4 pt-2.5 flex items-center justify-between bg-[#0a0e16]/60 -mx-4 -mb-4 p-3 border-t border-[#262a33]">
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">Action: Policy Arbitration</span>
            <button
              onClick={() => handleCellClick('Respgen', 'General Chat', 29, '7.0%')}
              className="font-mono text-xs text-[#c0c1ff] hover:text-white font-bold flex items-center gap-1"
            >
              Resolve Arbitrations <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Data Quality Issue Card */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#262a33] group hover:bg-[#1c2028] transition-all">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#4edea3]/10 rounded-full blur-xl"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-[#262a33] px-2 py-0.5 rounded font-mono text-[0.6875rem] text-[#4edea3] font-bold border border-[#4edea3]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                INGESTION FAULTS
              </div>
              <span className="material-symbols-outlined text-[#4edea3] text-[1.25rem]">security_update_warning</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold text-[#dfe2ee]">231</span>
              <span className="font-mono text-sm text-[#4edea3] font-bold">1.5%</span>
            </div>
            <p className="font-semibold text-base text-[#dfe2ee] mb-1">Data Quality Issue</p>
            <p className="text-xs text-[#c7c4d7]">스키마 필드 누락 및 PII 과잉 마스킹 (JSON unparseable, Context 손상)</p>
          </div>
          <div className="mt-4 pt-2.5 flex items-center justify-between bg-[#0a0e16]/60 -mx-4 -mb-4 p-3 border-t border-[#262a33]">
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">Target: Filter Reprocessing</span>
            <button
              onClick={() => showToast('Data Quality 파이프라인 익스포터 필터를 점검합니다.')}
              className="font-mono text-xs text-[#4edea3] hover:text-white font-bold flex items-center gap-1"
            >
              Inspect Pipeline <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Level 2: Matrix & Performance Bento Layout (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Matrix Bento: Stage x Category Problem Heatmap (8 Cols) */}
        <div className="lg:col-span-8 bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between border border-[#262a33]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#4cd7f6] font-bold">
                    Interactive Heatmap
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
                </div>
                <h2 className="font-semibold text-base text-[#dfe2ee]">Stage x Category Problem Heatmap</h2>
                <p className="text-xs text-[#908fa0]">각 세부 교차 셀을 클릭하여 해당 불일치 레코드로 즉각 Drill-down 탐색</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 bg-[#1c2028] px-3 py-1.5 rounded-lg border border-[#262a33]">
                <span className="font-mono text-[0.6875rem] text-[#908fa0]">Density:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#262a33]" title="Low Gap"></span>
                  <span className="w-3 h-3 rounded bg-[#03b5d3]/40" title="Moderate"></span>
                  <span className="w-3 h-3 rounded bg-[#8083ff]/40" title="Elevated"></span>
                  <span className="w-3 h-3 rounded bg-[#93000a]/80 animate-pulse" title="Bottleneck (>30%)"></span>
                </div>
                <span className="font-mono text-[0.6875rem] text-[#dfe2ee]">High Impact</span>
              </div>
            </div>

            {/* Matrix Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-[#0a0e16] text-[#908fa0] uppercase text-[0.6875rem]">
                    <th className="p-2.5 font-semibold">Pipeline Stage</th>
                    <th className="p-2.5 text-center">Navigation</th>
                    <th className="p-2.5 text-center">Media / Audio</th>
                    <th className="p-2.5 text-center">Vehicle Control</th>
                    <th className="p-2.5 text-center">Weather</th>
                    <th className="p-2.5 text-center">General Chat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a33]">
                  {/* Row 1: Router */}
                  <tr className="hover:bg-[#1c2028]/60 transition-colors">
                    <td className="p-2.5 bg-[#0a0e16]/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#c0c1ff] text-[1.125rem]">alt_route</span>
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-sm text-[#dfe2ee]">Router</span>
                          <span className="text-[0.625rem] text-[#908fa0]">Intent & Routing</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Router', 'Navigation', 28, '6.8%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#262a33] hover:bg-[#8083ff]/20 text-center transition-all"
                      >
                        <div className="font-bold text-[#dfe2ee]">28 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">6.8% gap</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Router', 'Media/Audio', 42, '10.2%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#262a33] hover:bg-[#8083ff]/20 text-center transition-all"
                      >
                        <div className="font-bold text-[#dfe2ee]">42 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">10.2% gap</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Router', 'Vehicle Control', 61, '14.8%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#03b5d3]/20 hover:bg-[#03b5d3]/30 text-center transition-all"
                      >
                        <div className="font-bold text-[#4cd7f6]">61 건</div>
                        <div className="text-[0.625rem] text-[#4cd7f6]">14.8% gap</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Router', 'Weather', 9, '2.1%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#908fa0]">9 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">2.1%</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Router', 'General Chat', 18, '4.3%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#908fa0]">18 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">4.3%</div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2: Planner (CRITICAL BOTTLENECK) */}
                  <tr className="hover:bg-[#1c2028]/60 transition-colors">
                    <td className="p-2.5 bg-[#0a0e16]/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4cd7f6] text-[1.125rem]">manufacturing</span>
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-sm text-[#dfe2ee]">Planner</span>
                          <span className="text-[0.625rem] text-[#4cd7f6] font-bold">Tool Execution</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Planner', 'Navigation', 36, '8.7%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#262a33] hover:bg-[#8083ff]/20 text-center transition-all"
                      >
                        <div className="font-bold text-[#dfe2ee]">36 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">8.7% gap</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Planner', 'Media/Audio', 21, '5.1%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#262a33] hover:bg-[#8083ff]/20 text-center transition-all"
                      >
                        <div className="font-bold text-[#dfe2ee]">21 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">5.1% gap</div>
                      </div>
                    </td>
                    {/* BOTTLENECK CELL */}
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Planner', 'Vehicle Control', 148, '35.9%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#93000a]/60 hover:bg-[#93000a] text-center shadow-md ring-2 ring-[#ffb4ab]/50 transition-all"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[#ffb4ab] text-[0.875rem] animate-bounce">
                            warning
                          </span>
                          <span className="font-bold text-[#ffdad6]">148 건</span>
                        </div>
                        <div className="text-[0.625rem] font-bold text-[#ffdad6]">35.9% Gap (주요개선 병목!)</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Planner', 'Weather', 12, '2.9%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#908fa0]">12 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">2.9%</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Planner', 'General Chat', 5, '1.2%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#908fa0]">5 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">1.2%</div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Respgen */}
                  <tr className="hover:bg-[#1c2028]/60 transition-colors">
                    <td className="p-2.5 bg-[#0a0e16]/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4edea3] text-[1.125rem]">chat</span>
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-sm text-[#dfe2ee]">Respgen</span>
                          <span className="text-[0.625rem] text-[#908fa0]">NLG Output</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Respgen', 'Navigation', 15, '3.6%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#dfe2ee]">15 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">3.6%</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Respgen', 'Media/Audio', 19, '4.6%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#dfe2ee]">19 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">4.6%</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Respgen', 'Vehicle Control', 11, '2.7%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#dfe2ee]">11 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">2.7%</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Respgen', 'Weather', 6, '1.5%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#1c2028] hover:bg-[#262a33] text-center transition-all"
                      >
                        <div className="text-[#908fa0]">6 건</div>
                        <div className="text-[0.625rem] text-[#908fa0]">1.5%</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => handleCellClick('Respgen', 'General Chat', 29, '7.0%')}
                        className="cursor-pointer p-2 rounded-lg bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-center transition-all"
                      >
                        <div className="font-bold text-[#c0c1ff]">29 건</div>
                        <div className="text-[0.625rem] text-[#c0c1ff]">7.0% gap</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Drill-down Guidance Dynamic Bar */}
          <div className="mt-4 p-3 bg-[#1c2028] rounded-lg border border-[#262a33] flex items-center justify-between transition-all">
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[1.25rem]">info</span>
              {selectedCell ? (
                <span>
                  <strong className="text-[#c0c1ff] font-mono">
                    [SELECTED] {selectedCell.stage} &times; {selectedCell.category}:
                  </strong>{' '}
                  <strong className="text-white font-mono">{selectedCell.count}건</strong> ({selectedCell.percentage}) 불일치
                  레코드 필터 활성화됨.
                </span>
              ) : (
                <span className="text-[#908fa0]">셀을 선택하면 관련 불일치 레코드 ID 및 어노테이션 큐로 직접 점프합니다.</span>
              )}
            </div>

            {selectedCell && (
              <button
                onClick={handleDrilldownJump}
                className="px-3 py-1.5 bg-[#c0c1ff] text-[#1000a9] rounded font-mono text-xs uppercase font-bold flex items-center gap-1 shadow hover:bg-[#8083ff] hover:text-white transition-all"
              >
                <span>Review Selected Queue</span>
                <span className="material-symbols-outlined text-[0.875rem]">open_in_new</span>
              </button>
            )}
          </div>
        </div>

        {/* Model Performance Benchmark Comparison Bento (4 Cols) */}
        <div className="lg:col-span-4 bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between border border-[#262a33]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-[#c0c1ff] font-bold">
                Execution Benchmark
              </span>
              <span className="font-mono text-xs text-[#908fa0]">N=14.8k</span>
            </div>
            <h2 className="font-semibold text-base text-[#dfe2ee] mb-0.5">Model Gap vs Efficiency</h2>
            <p className="text-xs text-[#908fa0] mb-3">Student vs Teacher 1 (Claude 3.5) vs Teacher 2 (GPT-4o)</p>

            {/* Comparison Metric Stack */}
            <div className="flex flex-col gap-3 font-mono">
              {/* Metric 1: Latency */}
              <div className="bg-[#1c2028] p-3 rounded-lg border border-[#262a33]">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-[0.6875rem] uppercase text-[#908fa0]">Inference Latency (p95)</span>
                  <span className="text-[#4edea3] font-bold">Student -82% faster</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4cd7f6] font-medium">gleo-student-v1.2</span>
                    <span className="text-[#dfe2ee] font-bold">142 ms</span>
                  </div>
                  <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '14.2%' }}></div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[#908fa0]">
                    <span>claude-3-5-sonnet</span>
                    <span className="text-[#dfe2ee]">780 ms</span>
                  </div>
                  <div className="w-full bg-[#0a0e16] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#8083ff] h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>

                  <div className="flex items-center justify-between text-[#908fa0]">
                    <span>gpt-4o</span>
                    <span className="text-[#dfe2ee]">620 ms</span>
                  </div>
                  <div className="w-full bg-[#0a0e16] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#908fa0] h-full rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>

              {/* Metric 2: Schema Pass Rate */}
              <div className="bg-[#1c2028] p-3 rounded-lg border border-[#262a33]">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-[0.6875rem] uppercase text-[#908fa0]">Schema Strict Pass Rate</span>
                  <span className="text-[#ffb4ab] font-bold">-4.7% Deficit</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-[#0a0e16] p-2 rounded border border-[#262a33]">
                    <span className="text-[0.625rem] text-[#4cd7f6] uppercase block font-bold">Student</span>
                    <span className="text-base font-bold text-[#dfe2ee]">94.8%</span>
                  </div>
                  <div className="bg-[#0a0e16] p-2 rounded border border-[#262a33]">
                    <span className="text-[0.625rem] text-[#908fa0] uppercase block">Claude 3.5</span>
                    <span className="text-base font-bold text-[#dfe2ee]">99.5%</span>
                  </div>
                  <div className="bg-[#0a0e16] p-2 rounded border border-[#262a33]">
                    <span className="text-[0.625rem] text-[#908fa0] uppercase block">GPT-4o</span>
                    <span className="text-base font-bold text-[#dfe2ee]">99.1%</span>
                  </div>
                </div>
              </div>

              {/* Metric 3: Rule Compliance */}
              <div className="bg-[#1c2028] p-3 rounded-lg border border-[#262a33]">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-[0.6875rem] uppercase text-[#908fa0]">Rule Compliance Rate</span>
                  <span className="text-[#4cd7f6] font-bold">Target 98.0%</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <div className="flex-1 bg-[#0a0e16] p-2 rounded border border-[#262a33] flex flex-col">
                    <span className="text-[0.625rem] text-[#908fa0] uppercase">Student Rule</span>
                    <span className="text-base font-bold text-[#ffb4ab]">91.3%</span>
                  </div>
                  <div className="flex-1 bg-[#0a0e16] p-2 rounded border border-[#262a33] flex flex-col">
                    <span className="text-[0.625rem] text-[#908fa0] uppercase">Teachers Consensus</span>
                    <span className="text-base font-bold text-[#4edea3]">98.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2">
            <button
              onClick={() => showToast('상세 벤치마크 매트릭스 팝업이 로드되었습니다.')}
              className="w-full bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] py-2 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#31353e]"
            >
              <span className="material-symbols-outlined text-[1.125rem]">assessment</span>
              <span>View Detailed Benchmark Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Level 3: Data Quality & Synthesis Recommendation (3 Columns Bento) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Over-redaction & Masking Bias */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between border border-[#262a33]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#4edea3] font-bold uppercase tracking-wider">PII Integrity</span>
              <span className="material-symbols-outlined text-[#4edea3] text-[1.25rem]">fingerprint</span>
            </div>
            <h3 className="font-semibold text-base text-[#dfe2ee] mb-1">Over-redaction Frequency</h3>
            <p className="text-xs text-[#908fa0] mb-3">일반 맥락 토큰이 PII로 오탐되어 마스킹됨으로써 모델 추론 실패 야기</p>

            <div className="space-y-2.5 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#dfe2ee]">&lt;LOCATION_COORD&gt; 과잉치환</span>
                  <span className="text-[#ffb4ab] font-bold">114 건 (49.3%)</span>
                </div>
                <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '49.3%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#dfe2ee]">&lt;VEHICLE_VIN&gt; 단순 시리얼 오탐</span>
                  <span className="text-[#4edea3] font-bold">73 건 (31.6%)</span>
                </div>
                <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '31.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#dfe2ee]">&lt;PERSON_NAME&gt; 고유명사/곡명 치환</span>
                  <span className="text-[#4cd7f6] font-bold">44 건 (19.1%)</span>
                </div>
                <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '19.1%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#262a33]">
            <button
              onClick={() => showToast('익명화 정규식 프로파일 튜닝 화면으로 이동합니다.')}
              className="font-mono text-xs text-[#4edea3] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Tune Anonymizer Regex Profile</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 2: Exporter Version Integrity */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between border border-[#262a33]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#4cd7f6] font-bold uppercase tracking-wider">
                Pipeline Versions
              </span>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">source_notes</span>
            </div>
            <h3 className="font-semibold text-base text-[#dfe2ee] mb-1">Exporter Version Integrity</h3>
            <p className="text-xs text-[#908fa0] mb-3">데이터 수집 파이프라인 익스포터 버전별 불완전 스키마 비율</p>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#1c2028] rounded-lg border border-[#262a33] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-[#dfe2ee]">v3.4.1 (Current Prod)</span>
                  <span className="text-[0.625rem] text-[#908fa0]">Active across 12 nodes</span>
                </div>
                <div className="text-right">
                  <span className="text-[#4edea3] font-bold">99.8% OK</span>
                  <span className="block text-[0.625rem] text-[#908fa0]">0.2% Fault</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#1c2028] rounded-lg border border-[#93000a]/40 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-[#dfe2ee]">v3.3.8 (Legacy Ingestion)</span>
                  <span className="text-[0.625rem] text-[#ffb4ab] font-bold">Schema Drop Detected</span>
                </div>
                <div className="text-right">
                  <span className="text-[#ffb4ab] font-bold">94.1% OK</span>
                  <span className="block text-[0.625rem] text-[#ffb4ab]">5.9% Missing</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#1c2028] rounded-lg border border-[#262a33] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-[#dfe2ee]">v3.5.0-rc2 (Canary)</span>
                  <span className="text-[0.625rem] text-[#4cd7f6]">Experimental parser</span>
                </div>
                <div className="text-right">
                  <span className="text-[#4cd7f6] font-bold">100% OK</span>
                  <span className="block text-[0.625rem] text-[#908fa0]">Zero Drops</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#262a33]">
            <button
              onClick={() => showToast('v3.3.8 불완전 슬라이스 54건이 격리 처리되었습니다.')}
              className="font-mono text-xs text-[#4cd7f6] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Deprecate v3.3.8 Slices (54 Records)</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 3: Synthesized Recommendation */}
        <div className="bg-[#181c24] rounded-xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#262a33]">
          <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-[#8083ff]/10 rounded-full blur-2xl"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#c0c1ff] font-bold uppercase tracking-wider">
                Synthesized Recommendation
              </span>
              <span className="material-symbols-outlined text-[#c0c1ff] text-[1.25rem]">psychology</span>
            </div>
            <h3 className="font-semibold text-base text-[#dfe2ee] mb-1">Flywheel Next Action</h3>
            <p className="text-xs text-[#908fa0] mb-3">모델 성능 격차 해소를 위한 즉각적 학습 데이터 합성 플랜</p>

            <div className="bg-[#1c2028] p-2.5 rounded-lg border border-[#262a33] mb-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                <span className="font-semibold text-xs text-[#dfe2ee]">Priority 1: Planner Vehicle Control</span>
              </div>
              <p className="text-xs text-[#c7c4d7] pl-3.5 leading-relaxed">
                차량 제어 파라미터(HVAC, 윈도우 조작 등) 도구 호출 시그니처 148건 합성 증강 권장
              </p>
            </div>

            <div className="bg-[#1c2028] p-2.5 rounded-lg border border-[#262a33] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                <span className="font-semibold text-xs text-[#dfe2ee]">Priority 2: Ground Truth Re-labeling</span>
              </div>
              <p className="text-xs text-[#c7c4d7] pl-3.5 leading-relaxed">
                89건의 Production Label 의심 레코드를 2차 검수(Approval) 큐로 일괄 전송 필요
              </p>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <button
              onClick={() => setIsSynthesisModalOpen(true)}
              className="w-full bg-[#c0c1ff] text-[#1000a9] py-2 rounded-lg font-mono text-xs uppercase font-bold hover:bg-[#8083ff] hover:text-white transition-all shadow"
            >
              Create Synthesis Job
            </button>
          </div>
        </div>
      </div>

      {/* Synthesis Job Creation Modal */}
      {isSynthesisModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181c24] border border-[#31353e] rounded-xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">psychology</span>
                <span className="font-bold text-base text-[#dfe2ee]">학습 데이터 합성 잡 생성 (Synthesis Job)</span>
              </div>
              <button
                onClick={() => setIsSynthesisModalOpen(false)}
                className="text-[#908fa0] hover:text-white material-symbols-outlined"
              >
                close
              </button>
            </div>

            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              병목으로 진단된 <strong>Planner &times; Vehicle Control (148건)</strong> 및 Ground Truth 의심 레코드를
              기반으로 Teacher 모델(Claude 3.5 Sonnet / GPT-4o)을 활용해 500건의 합성 증강 SFT 샘플을 생성합니다.
            </p>

            <div className="bg-[#0a0e16] p-3 rounded-lg border border-[#262a33] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Source Slice:</span>
                <span className="text-[#4cd7f6]">#run-2025-03-w1 / Planner Vehicle Control</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Target Augmentation:</span>
                <span className="text-[#4edea3]">500 Synthetic Pairs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Teacher Lineup:</span>
                <span className="text-[#c0c1ff]">claude-3-5-sonnet + gpt-4o</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSynthesisModalOpen(false)}
                className="px-3 py-1.5 bg-[#262a33] hover:bg-[#31353e] rounded text-xs text-[#dfe2ee]"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setIsSynthesisModalOpen(false);
                  showToast('Synthesis Job #syn-84920 이 백그라운드 파이프라인에 등록되었습니다.');
                }}
                className="px-4 py-1.5 bg-[#c0c1ff] hover:bg-[#8083ff] text-[#1000a9] hover:text-white font-bold rounded text-xs transition-colors"
              >
                합성 파이프라인 기동
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
