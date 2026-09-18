import React from 'react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unassignedReviewCount: number;
  pendingApprovalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unassignedReviewCount,
  pendingApprovalCount,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#181c24] z-50 flex flex-col justify-between border-r border-[#262a33] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-2.5 px-5 bg-[#0a0e16] border-b border-[#262a33]">
          <span className="material-symbols-outlined text-[#c0c1ff] text-[1.625rem]">cyclone</span>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight text-[#dfe2ee] leading-tight">Gleo Data</span>
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[#c0c1ff] font-bold">
              Flywheel Engine
            </span>
          </div>
        </div>

        {/* Node Telemetry Pill */}
        <div className="px-3.5 py-2.5">
          <div className="bg-[#1c2028] p-2 rounded-lg flex items-center justify-between border border-[#262a33]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-mono text-[0.6875rem] text-[#c7c4d7] uppercase font-semibold">Run Node</span>
            </div>
            <span className="font-mono text-xs text-[#4cd7f6] font-medium">rn-9402_prod</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-1 flex flex-col gap-1 text-sm">
          {/* OPERATIONAL CORE */}
          <div className="px-3 pt-2 pb-1">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider font-semibold">
              Operational Core
            </span>
          </div>

          <button
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">monitoring</span>
            <span className="text-sm">Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('batches')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'batches'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">inventory_2</span>
            <span className="text-sm">Batches & Deploy</span>
          </button>

          <button
            onClick={() => onSelectTab('records')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'records'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">manage_search</span>
            <span className="text-sm">Record Explorer</span>
          </button>

          <button
            onClick={() => onSelectTab('pipeline-runs')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'pipeline-runs'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">schema</span>
            <span className="text-sm">Pipeline Runs</span>
          </button>

          {/* VERIFICATION & QUALITY */}
          <div className="px-3 pt-3 pb-1">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider font-semibold">
              Verification & Quality
            </span>
          </div>

          <button
            onClick={() => onSelectTab('reviews-labeling')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'reviews-labeling'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[1.25rem]">rate_review</span>
              <span className="text-sm">1st Review (Labeling)</span>
            </div>
            {unassignedReviewCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded font-mono text-[0.625rem] font-bold ${
                  activeTab === 'reviews-labeling'
                    ? 'bg-[#0d0096] text-[#c0c1ff]'
                    : 'bg-[#8083ff]/30 text-[#c0c1ff]'
                }`}
              >
                {unassignedReviewCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('reviews-approval')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'reviews-approval'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[1.25rem]">verified_user</span>
              <span className="text-sm">2nd Review (Approval)</span>
            </div>
            {pendingApprovalCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded font-mono text-[0.625rem] font-bold ${
                  activeTab === 'reviews-approval'
                    ? 'bg-[#0d0096] text-[#c0c1ff]'
                    : 'bg-[#4edea3]/30 text-[#4edea3]'
                }`}
              >
                {pendingApprovalCount}
              </span>
            )}
          </button>

          {/* INTELLIGENCE & ARTIFACTS */}
          <div className="px-3 pt-3 pb-1">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider font-semibold">
              Intelligence & Artifacts
            </span>
          </div>

          <button
            onClick={() => onSelectTab('insights')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'insights'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">insights</span>
            <span className="text-sm">Analytics & Insights</span>
          </button>

          <button
            onClick={() => onSelectTab('playground')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'playground'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">terminal</span>
            <span className="text-sm">Eval Playground</span>
          </button>

          <button
            onClick={() => onSelectTab('datasets')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'datasets'
                ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow'
                : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="material-symbols-outlined text-[1.25rem]">data_table</span>
            <span className="text-sm">Datasets & Handoff</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 bg-[#0a0e16] border-t border-[#262a33] flex flex-col gap-1">
        <button
          onClick={() => onSelectTab('infrastructure')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'infrastructure'
              ? 'bg-[#8083ff] text-[#0d0096] font-bold'
              : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
          }`}
        >
          <span className="material-symbols-outlined text-[1.25rem]">dns</span>
          <span className="text-sm">Infrastructure</span>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#8083ff] text-[#0d0096] font-bold'
              : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
          }`}
        >
          <span className="material-symbols-outlined text-[1.25rem]">tune</span>
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
};
