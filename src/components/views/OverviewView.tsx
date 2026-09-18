import React from 'react';
import { BatchManifest, AttentionItem } from '../../types/flywheel';
import { ATTENTION_ITEMS } from '../../data/mockFlywheelData';

interface OverviewViewProps {
  batches: BatchManifest[];
  onNavigateTab: (tab: string) => void;
  onOpenLabelingRecord?: (recordId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  batches,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      {/* Upper Live Telemetry Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#181c24] p-3 rounded-xl border border-[#262a33] shadow-md">
        <div className="flex items-center gap-3 px-3 py-1">
          <span className="material-symbols-outlined text-[#4edea3] text-[1.625rem]">speed</span>
          <div className="flex flex-col font-mono">
            <span className="text-[0.6875rem] text-[#908fa0] uppercase">Ingest Throughput</span>
            <span className="text-base font-bold text-[#dfe2ee]">
              142.8k <span className="text-xs text-[#4edea3] font-normal">rec/hr</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 border-l border-[#262a33]">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[1.625rem]">fact_check</span>
          <div className="flex flex-col font-mono">
            <span className="text-[0.6875rem] text-[#908fa0] uppercase">Validation Pass</span>
            <span className="text-base font-bold text-[#dfe2ee]">
              94.2% <span className="text-xs text-[#4cd7f6] font-normal">+0.4%</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 border-l border-[#262a33]">
          <span className="material-symbols-outlined text-[#ffb4ab] text-[1.625rem]">report_problem</span>
          <div className="flex flex-col font-mono">
            <span className="text-[0.6875rem] text-[#908fa0] uppercase">Discrepancy Vol</span>
            <span className="text-base font-bold text-[#ffb4ab]">
              886 <span className="text-xs text-[#c7c4d7] font-normal">(5.98%)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 border-l border-[#262a33]">
          <span className="material-symbols-outlined text-[#c0c1ff] text-[1.625rem]">verified</span>
          <div className="flex flex-col font-mono">
            <span className="text-[0.6875rem] text-[#908fa0] uppercase">Teacher Agreement</span>
            <span className="text-base font-bold text-[#c0c1ff]">
              94.02% <span className="text-xs text-[#4edea3] font-normal">Optimal</span>
            </span>
          </div>
        </div>
      </section>

      {/* Attention Queue (긴급 조치 큐 - 5 Bento Cards) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[1.25rem]">priority_high</span>
            <h2 className="font-semibold text-base text-[#dfe2ee] tracking-tight">긴급 조치 큐 (Attention Queue)</h2>
          </div>
          <span className="font-mono text-xs text-[#908fa0]">5 Actionable Incidents Required</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ATTENTION_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.targetView)}
              className="bg-[#181c24] hover:bg-[#1c2028] p-3 rounded-xl border border-[#262a33] shadow-md flex flex-col justify-between cursor-pointer transition-all duration-150 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[0.625rem] font-bold uppercase ${item.badgeColor}`}
                  >
                    {item.type} ({item.count})
                  </span>
                  <span className="font-mono text-[0.625rem] text-[#908fa0]">{item.age}</span>
                </div>
                <div className="font-bold text-sm text-[#dfe2ee] group-hover:text-[#4cd7f6] transition-colors">
                  {item.title}
                </div>
                <div className="font-mono text-[0.6875rem] text-[#c0c1ff] truncate">{item.subtitle}</div>
                <p className="text-xs text-[#c7c4d7] mt-1.5 leading-snug line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#262a33] flex items-center justify-between text-xs font-mono text-[#4cd7f6]">
                <span>{item.actionText}</span>
                <span className="material-symbols-outlined text-[1rem] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid: Active Pipeline & Verification Funnel */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left Column (8 Cols): Active Pipeline Run & Quality Health */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          {/* Active Pipeline Run Bento */}
          <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="font-mono text-sm font-bold text-[#dfe2ee]">
                  Active Run: <span className="text-[#4cd7f6]">r-202503-492</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c2028] text-xs font-mono text-[#908fa0]">
                  Batch: bch-202503a
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#908fa0]">
                  Throughput: <strong className="text-white">1,420 rec/s</strong>
                </span>
                <span className="text-[#4edea3]">ETA: 4m 12s</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#908fa0]">Evaluation Progress (28.4k / 40.0k records)</span>
                <span className="font-bold text-[#4cd7f6]">71.0%</span>
              </div>
              <div className="w-full bg-[#0a0e16] h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-[#4cd7f6] h-full transition-all duration-300" style={{ width: '71%' }}></div>
              </div>
            </div>

            {/* Pipeline Stage Steps Flow */}
            <div className="grid grid-cols-5 gap-2 pt-1 font-mono text-xs">
              <div className="bg-[#1c2028] p-2 rounded border border-[#262a33] text-center">
                <span className="text-[#4edea3] block font-bold text-[0.6875rem]">STAGE 1</span>
                <span className="text-[#dfe2ee]">Ingest</span>
                <span className="text-[0.625rem] text-[#4edea3] block">100% OK</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded border border-[#262a33] text-center">
                <span className="text-[#4edea3] block font-bold text-[0.6875rem]">STAGE 2</span>
                <span className="text-[#dfe2ee]">Normalize</span>
                <span className="text-[0.625rem] text-[#4edea3] block">100% OK</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded border border-[#4cd7f6]/40 text-center ring-1 ring-[#4cd7f6]/50">
                <span className="text-[#4cd7f6] block font-bold text-[0.6875rem]">STAGE 3</span>
                <span className="text-[#dfe2ee]">Teacher Replay</span>
                <span className="text-[0.625rem] text-[#4cd7f6] block">71% In Progress</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded border border-[#262a33] text-center opacity-60">
                <span className="text-[#908fa0] block font-bold text-[0.6875rem]">STAGE 4</span>
                <span className="text-[#dfe2ee]">Rules & Judge</span>
                <span className="text-[0.625rem] text-[#908fa0] block">Queued</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded border border-[#262a33] text-center opacity-60">
                <span className="text-[#908fa0] block font-bold text-[0.6875rem]">STAGE 5</span>
                <span className="text-[#dfe2ee]">Review Queue</span>
                <span className="text-[0.625rem] text-[#908fa0] block">Awaiting</span>
              </div>
            </div>

            {/* Run Node Telemetry Info */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#262a33] font-mono text-xs text-[#908fa0]">
              <div>
                Workers: <strong className="text-white">48 Pods</strong>
              </div>
              <div>
                Avg Latency: <strong className="text-white">142ms</strong>
              </div>
              <div>
                Payload Size: <strong className="text-white">41.8 MB</strong>
              </div>
              <div>
                Driver Pod: <strong className="text-[#4edea3]">Healthy</strong>
              </div>
            </div>
          </div>

          {/* Verification Funnel & Quality Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Funnel Card */}
            <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#c0c1ff] font-bold uppercase">Verification Funnel</span>
                  <span className="material-symbols-outlined text-[#c0c1ff] text-[1.125rem]">filter_alt</span>
                </div>
                <p className="text-xs text-[#908fa0] mb-3">수집 로그부터 최종 학습 데이터셋 승인까지의 전환 퍼널</p>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center p-1.5 bg-[#1c2028] rounded border border-[#262a33]">
                    <span className="text-[#dfe2ee]">1. Ingested Logs</span>
                    <span className="font-bold text-white">14,820 (100%)</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-[#1c2028] rounded border border-[#262a33]">
                    <span className="text-[#4edea3]">2. Automated Pass</span>
                    <span className="font-bold text-[#4edea3]">13,934 (94.0%)</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-[#1c2028] rounded border border-[#4cd7f6]/30">
                    <span className="text-[#4cd7f6]">3. 1st Review (Labeling)</span>
                    <span className="font-bold text-[#4cd7f6]">886 (6.0%)</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-[#1c2028] rounded border border-[#8083ff]/30">
                    <span className="text-[#c0c1ff]">4. 2nd Review (Approval)</span>
                    <span className="font-bold text-[#c0c1ff]">142 (1.0%)</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-[#00885d]/20 rounded border border-[#4edea3]/40">
                    <span className="text-[#4edea3] font-bold">5. SFT Distill Ready</span>
                    <span className="font-bold text-[#4edea3]">744 (5.0%)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#262a33]">
                <button
                  onClick={() => onNavigateTab('reviews-labeling')}
                  className="w-full py-1.5 bg-[#262a33] hover:bg-[#31353e] text-[#c0c1ff] rounded font-mono text-xs uppercase font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>1차 라벨링 워크벤치 바로가기</span>
                  <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Data Quality Health Card */}
            <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#4edea3] font-bold uppercase">Data Quality Health</span>
                  <span className="material-symbols-outlined text-[#4edea3] text-[1.125rem]">health_and_safety</span>
                </div>
                <p className="text-xs text-[#908fa0] mb-3">수집 및 마스킹 무결성 모니터링</p>

                <div className="space-y-2.5 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#dfe2ee]">PII 마스킹 정합성</span>
                      <span className="text-[#4edea3] font-bold">98.5% Safe</span>
                    </div>
                    <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#4edea3] h-full" style={{ width: '98.5%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#dfe2ee]">JSON Schema Parseability</span>
                      <span className="text-[#4cd7f6] font-bold">99.2% Valid</span>
                    </div>
                    <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#4cd7f6] h-full" style={{ width: '99.2%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#dfe2ee]">과잉 마스킹 (Over-redaction)</span>
                      <span className="text-[#ffb4ab] font-bold">1.5% Defect</span>
                    </div>
                    <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ffb4ab] h-full" style={{ width: '1.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#262a33]">
                <button
                  onClick={() => onNavigateTab('insights')}
                  className="w-full py-1.5 bg-[#262a33] hover:bg-[#31353e] text-[#4edea3] rounded font-mono text-xs uppercase font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>인사이트 & 갭 분석 바로가기</span>
                  <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Model Alignment Radar & Batches */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Model Alignment Signals */}
          <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
              <span className="font-mono text-xs font-bold text-[#dfe2ee] uppercase">Model Alignment Signals</span>
              <span className="font-mono text-[0.6875rem] text-[#4cd7f6]">Eval Score</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 bg-[#1c2028] rounded-lg border border-[#262a33] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#dfe2ee]">Claude 3.5 Sonnet</div>
                  <div className="text-[0.625rem] text-[#c0c1ff]">Teacher 1 (Ground-Truth Base)</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-[#4edea3]">98.9</div>
                  <div className="text-[0.625rem] text-[#908fa0]">p95: 780ms</div>
                </div>
              </div>

              <div className="p-2.5 bg-[#1c2028] rounded-lg border border-[#262a33] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#dfe2ee]">GPT-4o (2024-11-20)</div>
                  <div className="text-[0.625rem] text-[#c0c1ff]">Teacher 2 (Cross-Validator)</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-[#4edea3]">98.2</div>
                  <div className="text-[0.625rem] text-[#908fa0]">p95: 620ms</div>
                </div>
              </div>

              <div className="p-2.5 bg-[#1c2028] rounded-lg border border-[#262a33] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#dfe2ee]">gleo-student-v1.2</div>
                  <div className="text-[0.625rem] text-[#4cd7f6]">Distilled In-Cabin Edge</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-[#ffb4ab]">91.3</div>
                  <div className="text-[0.625rem] text-[#4edea3]">p95: 142ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Ingest Batches Table */}
          <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
              <span className="font-mono text-xs font-bold text-[#dfe2ee] uppercase">Recent Batches</span>
              <button
                onClick={() => onNavigateTab('batches')}
                className="text-xs text-[#c0c1ff] hover:underline font-mono"
              >
                전체 보기 &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {batches.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 bg-[#0a0e16] rounded-lg border border-[#262a33] flex flex-col gap-1 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#4cd7f6]">{b.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[0.625rem] font-bold ${
                        b.ingestState === 'Ready'
                          ? 'bg-[#00885d]/30 text-[#4edea3]'
                          : b.ingestState === 'Completed'
                          ? 'bg-[#1c2028] text-[#908fa0]'
                          : 'bg-[#93000a]/40 text-[#ffb4ab]'
                      }`}
                    >
                      {b.ingestState}
                    </span>
                  </div>
                  <div className="text-[#908fa0] text-[0.6875rem] truncate">{b.manifestUri}</div>
                  <div className="flex items-center justify-between text-[0.625rem] text-[#908fa0] pt-1">
                    <span>{b.recordVolume.toLocaleString()} recs</span>
                    <span>{b.lastPolled}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
