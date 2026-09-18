import React, { useState } from 'react';
import { UserProfile } from '../../types/flywheel';
import { INITIAL_USERS } from '../../data/mockFlywheelData';

interface HeaderProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  searchQuery,
  onSearchChange,
  onNavigateTab,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAttentionMenu, setShowAttentionMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#181c24]/95 backdrop-blur-md z-40 flex items-center justify-between px-3 sm:px-6 border-b border-[#262a33] shadow-[0_1px_8px_rgba(0,0,0,0.3)] pt-safe">
      {/* Mobile Branding (Visible on mobile only) */}
      <div className="flex lg:hidden items-center gap-2 min-w-0">
        <img
          alt="Gleo Flywheel Logo"
          className="h-7 w-7 object-contain rounded shrink-0"
          src="https://lh3.googleusercontent.com/aida/AEtjO1VnxqW1NgjjwsKU65QLFM1W3hynSbXpLg-0twBLM7Qtc2P-6HEeHGOd8ff8_SeZ3U1WZJYhZnmbgKZomzfi16t_INdXvYHlSg_YfugwU0eX0yYg7hHTZSyGyiK12SCtoSgxLEyc3kKt6l91S4QjDNIqzyqu6YP8nKmuNybvJnjAXd17GaC2ZEOCVLKIZjKabd_nLruDxZgbx_Xt8RwSYS-OCuNrzy6-M5d0UsdC3IrHlADufuyKh_TlGoc"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[0.625rem] text-[#c0c1ff] uppercase tracking-wider truncate">
            Gleo Flywheel
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-mono text-[0.6875rem] text-[#4edea3] font-semibold">REAL (운영)</span>
          </div>
        </div>
      </div>

      {/* Desktop Search & Active Context Bar */}
      <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl">
        <div className="flex items-center gap-1.5 bg-[#31353e] px-2.5 py-1 rounded-full shrink-0">
          <span className="font-mono text-xs uppercase text-[#4cd7f6] font-bold tracking-wider">REAL (운영)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c2028] font-mono text-xs text-[#c7c4d7] border border-[#262a33] shrink-0">
          <span className="text-[#908fa0]">Active:</span>
          <span className="text-[#c0c1ff] font-medium">bch-202503a</span>
          <span className="text-[#908fa0]">/</span>
          <span className="text-[#4edea3]">r-eval-k8</span>
        </div>

        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#908fa0] text-[1.125rem]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#1c2028] text-[#dfe2ee] placeholder-[#908fa0] font-mono text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:bg-[#262a33] focus:ring-1 focus:ring-[#8083ff]/50 border border-transparent focus:border-[#8083ff]/40 transition-all"
            placeholder="Search Batch ID, Run, Record Hash (#REC-), Prompt Diff..."
          />
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="lg:hidden absolute inset-x-0 top-0 h-16 bg-[#181c24] px-4 flex items-center gap-2 z-50 border-b border-[#262a33] animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-[#908fa0] text-[18px]">search</span>
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-[#0a0e16] text-[#dfe2ee] placeholder-[#908fa0] font-mono text-xs rounded-lg px-3 py-2 border border-[#262a33] focus:outline-none focus:border-[#8083ff]"
            placeholder="레코드(#REC-), 프롬프트 검색..."
          />
          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-1 text-[#908fa0] hover:text-[#dfe2ee]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* Right Controls: Attention Indicator & Multi-user Profile Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon Toggle */}
        <button
          onClick={() => setShowMobileSearch(true)}
          className="lg:hidden w-9 h-9 rounded-lg bg-[#1c2028] text-[#c7c4d7] flex items-center justify-center border border-[#262a33]"
          title="검색 열기"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
        </button>
        {/* Attention Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAttentionMenu(!showAttentionMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1c2028] hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] rounded-lg transition-colors border border-[#262a33]"
            title="긴급 조치 큐 (Attention Items)"
          >
            <span className="material-symbols-outlined text-[#4cd7f6] text-[1.125rem]">pending_actions</span>
            <span className="font-mono text-xs uppercase text-[#dfe2ee] font-semibold">Attention</span>
            <span className="bg-[#93000a] text-[#ffdad6] px-1.5 py-0.2 rounded font-mono text-[0.6875rem] font-bold">2</span>
            <span className="bg-[#31353e] text-[#c7c4d7] px-1.5 py-0.2 rounded font-mono text-[0.6875rem]">3 Run</span>
          </button>

          {showAttentionMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262a33]">
                <span className="font-mono text-xs font-bold text-[#dfe2ee] uppercase tracking-wider">Attention Queue (5건)</span>
                <span className="text-[0.6875rem] text-[#4cd7f6] font-mono">Real-time alerts</span>
              </div>
              <div className="space-y-2">
                <div
                  onClick={() => {
                    onNavigateTab('pipeline-runs');
                    setShowAttentionMenu(false);
                  }}
                  className="p-2 bg-[#262a33]/50 hover:bg-[#262a33] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#ffb4ab]">🔴 Critical: 2 Failed Runs</span>
                    <span className="text-[#908fa0] text-[0.6875rem]">3h age</span>
                  </div>
                  <p className="text-[0.75rem] text-[#c7c4d7] mt-0.5">OOM on node worker-k8-04 during Teacher-v2 eval batch.</p>
                </div>
                <div
                  onClick={() => {
                    onNavigateTab('reviews-approval');
                    setShowAttentionMenu(false);
                  }}
                  className="p-2 bg-[#262a33]/50 hover:bg-[#262a33] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#c0c1ff]">🟣 142건 2차 승인 대기</span>
                    <span className="text-[#4edea3] text-[0.6875rem]">92.4% QA</span>
                  </div>
                  <p className="text-[0.75rem] text-[#c7c4d7] mt-0.5">1st Pass Confirmed - Awaiting Lead sign-off.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-[#31353e]"></div>

        {/* User Identity & Switcher (여러 사람의 동시 판단/승인 지원) */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-[#1c2028] transition-all text-left"
            title="사용자 전환 (라벨러 / 승인자 / 엔지니어)"
          >
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-[#dfe2ee]">{currentUser.name}</span>
              <span className="font-mono text-[0.6875rem] uppercase text-[#4cd7f6]">{currentUser.title}</span>
            </div>
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8083ff]/40"
            />
            <span className="material-symbols-outlined text-[#908fa0] text-[1rem]">arrow_drop_down</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-[#262a33]">
                <div className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">현재 로그인 계정</div>
                <div className="text-xs font-bold text-[#dfe2ee] mt-0.5">{currentUser.name}</div>
                <div className="text-[0.6875rem] text-[#c7c4d7]">{currentUser.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-[#8083ff]/20 text-[#c0c1ff] rounded text-[0.625rem] font-mono font-semibold uppercase">
                  Role: {currentUser.role}
                </div>
              </div>

              <div className="py-2">
                <div className="px-3 pb-1 font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">
                  계정 전환 (Multi-user Simulation)
                </div>
                {INITIAL_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSwitchUser(user);
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      user.id === currentUser.id
                        ? 'bg-[#8083ff]/20 text-[#c0c1ff] font-semibold'
                        : 'text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="text-left">
                        <div className="font-medium text-xs">{user.name}</div>
                        <div className="text-[0.625rem] text-[#908fa0]">{user.title}</div>
                      </div>
                    </div>
                    {user.id === currentUser.id && (
                      <span className="material-symbols-outlined text-[#4edea3] text-[1.125rem]">check</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[#262a33] flex flex-col gap-1">
                <button
                  onClick={() => {
                    onNavigateTab('user-management');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-[#c7c4d7] hover:bg-[#262a33] hover:text-[#dfe2ee] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">group</span>
                  <span>사용자 및 권한 관리 (IAM)</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('login');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-[#ffb4ab] hover:bg-[#262a33] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>로그아웃 / SSO 로그인 화면</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
