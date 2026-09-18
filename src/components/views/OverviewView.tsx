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
    <div className="flex flex-col w-full text-[#dfe2ee]">
      {/* ========================================================
          MOBILE VIEW (< lg) - Stitch Mobile Prototype
         ======================================================== */}
      <div className="flex lg:hidden flex-col w-full space-y-4 pb-6">
        {/* Top Node Context & Quick Actions */}
        <section className="bg-[#181c24] rounded-xl p-3.5 border border-[#262a33] shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="font-mono text-[0.6875rem] text-[#4edea3] tracking-wider uppercase font-semibold">
                  NODE ACTIVE
                </span>
                <span className="font-mono text-xs text-[#908fa0]">·</span>
                <span className="font-mono text-xs text-[#c7c4d7] truncate">rn-9402_prod</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">layers</span>
                <span className="font-mono text-xs text-[#dfe2ee] font-semibold truncate">bch-202503a</span>
                <span className="font-mono text-xs text-[#908fa0]">/</span>
                <span className="font-mono text-xs text-[#4edea3] truncate">r-eval-k8</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('batches')}
              className="min-h-[38px] px-3 rounded-lg bg-[#8083ff] text-[#0d0096] font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-transform shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>새 배치</span>
            </button>
          </div>
        </section>

        {/* Attention Triage Queue (Horizontal Snap Scroll) */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">notification_important</span>
              <h2 className="text-sm font-bold text-[#dfe2ee]">주의 필요 큐 (Triage)</h2>
              <span className="px-1.5 py-0.2 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-mono text-[0.625rem] font-bold">
                4건
              </span>
            </div>
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">좌우 스크롤 ↔</span>
          </div>

          {/* Snap Scroll Track */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1">
            {/* Card 1: Critical Red */}
            <div className="min-w-[270px] max-w-[280px] snap-center rounded-xl bg-[#181c24] p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden shrink-0 border border-[#262a33]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ffb4ab]"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.625rem] text-[#ffb4ab] bg-[#ffb4ab]/15 px-1.5 py-0.5 rounded font-semibold uppercase">
                    CRITICAL RUN
                  </span>
                  <span className="font-mono text-[0.625rem] text-[#908fa0]">2m 전</span>
                </div>
                <h3 className="text-sm font-bold text-[#dfe2ee] mb-0.5">2 Failed Runs</h3>
                <p className="font-mono text-xs text-[#c7c4d7] truncate">r-202503-491 · OOM 0xDEAD</p>
                <div className="mt-2 text-[#ffb4ab] text-xs flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">memory</span>
                  <span>VRAM Spike (23.8GB/24GB)</span>
                </div>
              </div>
              <div className="mt-3 pl-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateTab('pipeline-runs')}
                  className="min-h-[36px] flex-1 px-3 py-1.5 rounded-lg bg-[#ffb4ab] text-[#690005] font-mono text-xs font-bold flex items-center justify-center gap-1 active:opacity-90"
                >
                  <span className="material-symbols-outlined text-[15px]">replay</span>
                  <span>즉시 재시도</span>
                </button>
                <button
                  onClick={() => onNavigateTab('pipeline-runs')}
                  aria-label="로그 보기"
                  className="min-w-[36px] min-h-[36px] rounded-lg bg-[#262a33] text-[#dfe2ee] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                </button>
              </div>
            </div>

            {/* Card 2: Amber Stalled */}
            <div className="min-w-[270px] max-w-[280px] snap-center rounded-xl bg-[#181c24] p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden shrink-0 border border-[#262a33]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4cd7f6]"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.625rem] text-[#4cd7f6] bg-[#4cd7f6]/15 px-1.5 py-0.5 rounded font-semibold uppercase">
                    HEARTBEAT DROP
                  </span>
                  <span className="font-mono text-[0.625rem] text-[#908fa0]">45m silent</span>
                </div>
                <h3 className="text-sm font-bold text-[#dfe2ee] mb-0.5">1 Stalled Run</h3>
                <p className="font-mono text-xs text-[#c7c4d7] truncate">r-run-s3-ingest-b4</p>
                <div className="mt-2 text-[#4cd7f6] text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer_off</span>
                  <span>파이프라인 I/O 블록 발생</span>
                </div>
              </div>
              <div className="mt-3 pl-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateTab('infrastructure')}
                  className="min-h-[36px] flex-1 px-3 py-1.5 rounded-lg bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold flex items-center justify-center gap-1 active:opacity-90"
                >
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  <span>강제 재가동</span>
                </button>
                <button
                  onClick={() => onNavigateTab('infrastructure')}
                  aria-label="상세 정보"
                  className="min-w-[36px] min-h-[36px] rounded-lg bg-[#262a33] text-[#dfe2ee] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                </button>
              </div>
            </div>

            {/* Card 3: Quarantine Yellow */}
            <div className="min-w-[270px] max-w-[280px] snap-center rounded-xl bg-[#181c24] p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden shrink-0 border border-[#262a33]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4edea3]"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.625rem] text-[#4edea3] bg-[#4edea3]/15 px-1.5 py-0.5 rounded font-semibold uppercase">
                    QUARANTINE
                  </span>
                  <span className="font-mono text-[0.625rem] text-[#908fa0]">v2 검증</span>
                </div>
                <h3 className="text-sm font-bold text-[#dfe2ee] mb-0.5">48건 과잉 마스킹</h3>
                <p className="font-mono text-xs text-[#c7c4d7] truncate">Student PII 감지 민감도 이상</p>
                <div className="mt-2 text-[#4edea3] text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>격리 보관함 대기 중</span>
                </div>
              </div>
              <div className="mt-3 pl-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateTab('records')}
                  className="min-h-[36px] flex-1 px-3 py-1.5 rounded-lg bg-[#262a33] text-[#4edea3] font-mono text-xs font-bold flex items-center justify-center gap-1 active:opacity-90"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  <span>격리 샘플 검수</span>
                </button>
              </div>
            </div>

            {/* Card 4: Purple Indigo Approval */}
            <div className="min-w-[270px] max-w-[280px] snap-center rounded-xl bg-[#181c24] p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden shrink-0 border border-[#262a33]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8083ff]"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.625rem] text-[#c0c1ff] bg-[#8083ff]/15 px-1.5 py-0.5 rounded font-semibold uppercase">
                    APPROVAL QUEUE
                  </span>
                  <span className="font-mono text-[0.625rem] text-[#908fa0]">오늘 마감</span>
                </div>
                <h3 className="text-sm font-bold text-[#dfe2ee] mb-0.5">142건 2차 승인</h3>
                <p className="font-mono text-xs text-[#c7c4d7] truncate">High Confidence 배치 모음</p>
                <div className="mt-2 text-[#c0c1ff] text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>합의도 99.1% 충족 24건</span>
                </div>
              </div>
              <div className="mt-3 pl-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateTab('reviews-approval')}
                  className="min-h-[36px] flex-1 px-3 py-1.5 rounded-lg bg-[#8083ff] text-[#0d0096] font-mono text-xs font-bold flex items-center justify-center gap-1 active:opacity-90"
                >
                  <span className="material-symbols-outlined text-[15px]">done_all</span>
                  <span>일괄 승인 (24건)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Pipeline Run Monitor Card */}
        <section className="rounded-xl bg-[#181c24] p-3.5 shadow-md border border-[#262a33] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8083ff]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
                <span className="font-mono text-[0.6875rem] text-[#4cd7f6] uppercase font-semibold">
                  LIVE PIPELINE RUN
                </span>
              </div>
              <div className="text-base font-bold text-[#dfe2ee] truncate mt-0.5">#run-2025-03-w1</div>
              <p className="text-xs text-[#908fa0] mt-0.5">Teacher-v3 Validation & Synthetic Alignment</p>
            </div>
            <span className="font-mono text-sm text-[#8083ff] font-bold px-2 py-1 rounded bg-[#8083ff]/10 shrink-0">
              88.75%
            </span>
          </div>

          {/* Segmented Micro Progress Bar */}
          <div className="w-full bg-[#0a0e16] h-2.5 rounded-full overflow-hidden p-0.5 mb-2.5 flex gap-0.5">
            <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '30%' }}></div>
            <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '30%' }}></div>
            <div className="h-full bg-[#8083ff] rounded-full animate-pulse" style={{ width: '28.75%' }}></div>
            <div className="h-full bg-[#31353e] rounded-full" style={{ width: '11.25%' }}></div>
          </div>

          {/* Stage & ETA Meta Row */}
          <div className="flex items-center justify-between text-xs mb-3 pt-0.5">
            <div className="flex items-center gap-1 text-[#dfe2ee]">
              <span className="material-symbols-outlined text-[16px] text-[#8083ff]">sync</span>
              <span className="font-medium text-xs">Stage 03: Teacher Replay</span>
              <span className="px-1.5 py-0.2 rounded bg-[#8083ff]/20 text-[#c0c1ff] font-mono text-[0.625rem]">
                RUNNING
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#908fa0] font-mono text-xs">
              <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
              <span>ETA 14m 20s</span>
            </div>
          </div>

          {/* Real-time Spark Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 bg-[#1c2028] rounded-lg p-2.5 border border-[#262a33]">
            <div className="flex flex-col">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">THROUGHPUT</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-sm font-bold text-[#dfe2ee]">3,840</span>
                <span className="font-mono text-[0.625rem] text-[#4edea3]">rec/min</span>
              </div>
              <span className="font-mono text-[0.625rem] text-[#4edea3] flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +14.2% spike
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">INFERENCE LATENCY</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-sm font-bold text-[#dfe2ee]">418</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">ms/req</span>
              </div>
              <span className="font-mono text-[0.625rem] text-[#4cd7f6] flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">check_circle</span> p95 안정권
              </span>
            </div>
          </div>
        </section>

        {/* Review Funnel Progress (Multi-step Funnel) */}
        <section className="rounded-xl bg-[#181c24] p-3.5 shadow-md border border-[#262a33]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">filter_alt</span>
              <h2 className="text-sm font-bold text-[#dfe2ee]">검수 퍼널 현황 (24.1k)</h2>
            </div>
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">전체 진척 63.2%</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#908fa0]">1. 미착수 대기</span>
                <span className="font-mono text-xs font-semibold text-[#dfe2ee]">
                  8,200건 <span className="text-[#908fa0] font-normal">(33.4%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#464554] rounded-full" style={{ width: '33.4%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#4cd7f6] font-medium">2. 1차 라벨러 완료</span>
                <span className="font-mono text-xs font-semibold text-[#4cd7f6]">
                  12,400건 <span className="text-[#908fa0] font-normal">(50.6%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#4cd7f6] rounded-full" style={{ width: '50.6%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#4edea3] font-medium">3. 2차 최종 승인</span>
                <span className="font-mono text-xs font-semibold text-[#4edea3]">
                  3,100건 <span className="text-[#908fa0] font-normal">(12.6%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '12.6%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#ffb4ab] font-medium">4. 반려 및 재작업</span>
                <span className="font-mono text-xs font-semibold text-[#ffb4ab]">
                  450건 <span className="text-[#908fa0] font-normal">(1.8%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e16] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb4ab] rounded-full" style={{ width: '1.8%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-[#262a33] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-[#4cd7f6] shrink-0">warning</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dfe2ee] truncate">승인 무효화 경고 (24건)</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0] truncate">스펙 개정 v1.4 반영 필요</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('reviews-approval')}
              className="px-2.5 py-1 rounded bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-xs font-semibold shrink-0"
              type="button"
            >
              재검증
            </button>
          </div>
        </section>

        {/* Model & Data Health Bento Grid (2x2) */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#4edea3]">monitor_heart</span>
              <h2 className="text-sm font-bold text-[#dfe2ee]">모델 & 데이터 건전도</h2>
            </div>
            <span className="font-mono text-[0.6875rem] text-[#4edea3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> 정상 가동
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#181c24] p-3 flex flex-col justify-between border border-[#262a33]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">정합률 (Align)</span>
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">check_circle</span>
              </div>
              <div className="mt-2">
                <div className="font-mono text-base font-bold text-[#dfe2ee]">97.4%</div>
                <span className="font-mono text-[0.625rem] text-[#4edea3] mt-0.5 block">+0.8%p vs 기준치</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#181c24] p-3 flex flex-col justify-between border border-[#262a33]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">과잉마스킹</span>
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">privacy_tip</span>
              </div>
              <div className="mt-2">
                <div className="font-mono text-base font-bold text-[#dfe2ee]">3.1%</div>
                <span className="font-mono text-[0.625rem] text-[#4cd7f6] mt-0.5 block">임계치 (5.0%) 미만</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#181c24] p-3 flex flex-col justify-between border border-[#262a33]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">Student Gap</span>
                <span className="material-symbols-outlined text-[16px] text-[#8083ff]">difference</span>
              </div>
              <div className="mt-2">
                <div className="font-mono text-base font-bold text-[#dfe2ee]">412건</div>
                <span className="font-mono text-[0.625rem] text-[#908fa0] mt-0.5 block">전일 대비 -38건</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#181c24] p-3 flex flex-col justify-between border border-[#262a33]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.625rem] text-[#908fa0] uppercase">Label 의심</span>
                <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">flag</span>
              </div>
              <div className="mt-2">
                <div className="font-mono text-base font-bold text-[#ffb4ab]">89건</div>
                <span className="font-mono text-[0.625rem] text-[#ffb4ab] mt-0.5 block">Cross-check 요망</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Auto-Triage Footer Strip */}
        <section className="p-3 rounded-xl bg-[#181c24] border border-[#262a33] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0a0e16] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#8083ff] text-[18px]">tune</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#dfe2ee] truncate">Flywheel Auto-Triage</span>
              <span className="font-mono text-[0.625rem] text-[#908fa0] truncate">
                규칙 기반 자동 승인 룰 8개 동작 중
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-2.5 py-1 rounded-lg bg-[#262a33] text-[#dfe2ee] font-mono text-xs hover:text-[#8083ff] transition-colors shrink-0"
            type="button"
          >
            룰 설정
          </button>
        </section>
      </div>

      {/* ========================================================
          DESKTOP VIEW (lg:flex) - Comprehensive 12-col Dashboard
         ======================================================== */}
      <div className="hidden lg:flex flex-col gap-5 pb-12">
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
  </div>
);
};
