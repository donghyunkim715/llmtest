import React, { useState } from 'react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unassignedReviewCount?: number;
  pendingApprovalCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  unassignedReviewCount = 0,
  pendingApprovalCount = 0,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isReviewsTab = activeTab === 'reviews-approval' || activeTab === 'reviews-labeling';

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on mobile/tablet < lg) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0a0e16]/95 backdrop-blur-xl border-t border-[#262a33] shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-16 px-1">
          {/* Overview */}
          <button
            onClick={() => {
              onSelectTab('overview');
              setShowMoreMenu(false);
            }}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 py-1 transition-colors ${
              activeTab === 'overview'
                ? 'text-[#8083ff] font-semibold'
                : 'text-[#908fa0] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="font-mono text-[0.6875rem] tracking-tight mt-0.5">대시보드</span>
          </button>

          {/* Reviews (Approval & Labeling) */}
          <button
            onClick={() => {
              onSelectTab(pendingApprovalCount > 0 ? 'reviews-approval' : 'reviews-labeling');
              setShowMoreMenu(false);
            }}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 py-1 transition-colors relative ${
              isReviewsTab
                ? 'text-[#8083ff] font-semibold'
                : 'text-[#908fa0] hover:text-[#dfe2ee]'
            }`}
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
              {(unassignedReviewCount > 0 || pendingApprovalCount > 0) && (
                <span className="absolute -top-1 -right-2 px-1 rounded-full bg-[#8083ff] text-[#0d0096] text-[0.625rem] font-bold">
                  {unassignedReviewCount + pendingApprovalCount}
                </span>
              )}
            </div>
            <span className="font-mono text-[0.6875rem] tracking-tight mt-0.5">검수·승인</span>
          </button>

          {/* Insights */}
          <button
            onClick={() => {
              onSelectTab('insights');
              setShowMoreMenu(false);
            }}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 py-1 transition-colors ${
              activeTab === 'insights'
                ? 'text-[#8083ff] font-semibold'
                : 'text-[#908fa0] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">insights</span>
            <span className="font-mono text-[0.6875rem] tracking-tight mt-0.5">인사이트</span>
          </button>

          {/* Datasets */}
          <button
            onClick={() => {
              onSelectTab('datasets');
              setShowMoreMenu(false);
            }}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 py-1 transition-colors ${
              activeTab === 'datasets'
                ? 'text-[#8083ff] font-semibold'
                : 'text-[#908fa0] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">dataset</span>
            <span className="font-mono text-[0.6875rem] tracking-tight mt-0.5">데이터셋</span>
          </button>

          {/* More Drawer Trigger */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 py-1 transition-colors ${
              showMoreMenu ||
              ['user-management', 'audit-logs', 'batches', 'records', 'playground', 'pipeline-runs', 'infrastructure', 'settings'].includes(
                activeTab
              )
                ? 'text-[#4cd7f6] font-semibold'
                : 'text-[#908fa0] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {showMoreMenu ? 'expand_more' : 'grid_view'}
            </span>
            <span className="font-mono text-[0.6875rem] tracking-tight mt-0.5">전체 메뉴</span>
          </button>
        </div>
      </nav>

      {/* Mobile More Actions Bottom Sheet */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <div
            className="w-full bg-[#181c24] border-t border-[#262a33] rounded-t-2xl p-4 pb-24 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 rounded-full bg-[#31353e] self-center mb-1"></div>

            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#908fa0] font-semibold">
                모바일 네비게이션 & 관리 메뉴
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-lg bg-[#262a33] text-[#c7c4d7] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Navigation Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Reviews 1차 라벨링 */}
              <button
                onClick={() => {
                  onSelectTab('reviews-labeling');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'reviews-labeling'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#8083ff]">rate_review</span>
                <span className="text-xs font-semibold">1차 라벨링</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">후보 모델 채택</span>
              </button>

              {/* Reviews 2차 승인 */}
              <button
                onClick={() => {
                  onSelectTab('reviews-approval');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'reviews-approval'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#4edea3]">verified_user</span>
                <span className="text-xs font-semibold">2차 승인 워크벤치</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">DPO/SFT Handoff</span>
              </button>

              {/* User Management */}
              <button
                onClick={() => {
                  onSelectTab('user-management');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'user-management'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#4cd7f6]">group</span>
                <span className="text-xs font-semibold">회원/권한 관리</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">IAM 거버넌스</span>
              </button>

              {/* Audit Logs */}
              <button
                onClick={() => {
                  onSelectTab('audit-logs');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'audit-logs'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#c0c1ff]">history</span>
                <span className="text-xs font-semibold">보안 감사 로그</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">불변 감사 레지스트리</span>
              </button>

              {/* Batches */}
              <button
                onClick={() => {
                  onSelectTab('batches');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'batches'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#4cd7f6]">inventory_2</span>
                <span className="text-xs font-semibold">배치 관리</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">수집 매니페스트</span>
              </button>

              {/* Records Explorer */}
              <button
                onClick={() => {
                  onSelectTab('records');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'records'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#4edea3]">manage_search</span>
                <span className="text-xs font-semibold">레코드 탐색기</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">전체 트레이스 검색</span>
              </button>

              {/* Eval Playground */}
              <button
                onClick={() => {
                  onSelectTab('playground');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'playground'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#ffb4ab]">play_circle</span>
                <span className="text-xs font-semibold">플레이그라운드</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">실시간 비교 검증</span>
              </button>

              {/* Pipeline Runs */}
              <button
                onClick={() => {
                  onSelectTab('pipeline-runs');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'pipeline-runs'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#c0c1ff]">account_tree</span>
                <span className="text-xs font-semibold">파이프라인 런</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">DAG 실행 모니터</span>
              </button>

              {/* Infrastructure */}
              <button
                onClick={() => {
                  onSelectTab('infrastructure');
                  setShowMoreMenu(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
                  activeTab === 'infrastructure'
                    ? 'bg-[#8083ff]/20 border-[#8083ff] text-[#dfe2ee]'
                    : 'bg-[#1c2028] border-[#262a33] text-[#c7c4d7]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#4cd7f6]">dns</span>
                <span className="text-xs font-semibold">인프라 모니터</span>
                <span className="font-mono text-[0.625rem] text-[#908fa0]">GPU/VRAM 클러스터</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-[#262a33] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onSelectTab('settings');
                  setShowMoreMenu(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#262a33] text-xs font-mono text-[#c7c4d7] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                <span>설정</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('login');
                  setShowMoreMenu(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#262a33] text-xs font-mono text-[#4cd7f6] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>SSO / 로그인 화면</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
