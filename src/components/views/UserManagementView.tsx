import React, { useState, useMemo } from 'react';
import { ManagedUser, GovernanceAuditLog } from '../../types/flywheel';

interface UserManagementViewProps {
  managedUsers: ManagedUser[];
  onUpdateUserRole: (userId: string, newRole: ManagedUser['role'], ticketNumber: string, reason: string) => void;
  onApprovePendingUser: (userId: string) => void;
  onReactivateUser: (userId: string) => void;
  onInviteUser: (newUser: Omit<ManagedUser, 'id'>) => void;
  onNavigateAuditLogs: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  managedUsers,
  onUpdateUserRole,
  onApprovePendingUser,
  onReactivateUser,
  onInviteUser,
  onNavigateAuditLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Modals state
  const [selectedUserForRoleModal, setSelectedUserForRoleModal] = useState<ManagedUser | null>(null);
  const [targetRole, setTargetRole] = useState<ManagedUser['role']>('DEVELOPER');
  const [ticketNumber, setTicketNumber] = useState('');
  const [roleChangeFeedback, setRoleChangeFeedback] = useState<string | null>(null);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ManagedUser['role']>('DEVELOPER');
  const [inviteTeam, setInviteTeam] = useState('Foundation Alignment');

  // KPI Calculations
  const totalCount = managedUsers.length;
  const activeCount = managedUsers.filter((u) => u.status === 'ACTIVE').length;
  const pendingCount = managedUsers.filter((u) => u.status === 'PENDING').length;

  const adminCount = managedUsers.filter((u) => u.role === 'ADMIN').length;
  const devCount = managedUsers.filter((u) => u.role === 'DEVELOPER').length;
  const approverCount = managedUsers.filter((u) => u.role === 'APPROVER').length;
  const labelerCount = managedUsers.filter((u) => u.role === 'LABELER').length;

  const adminPct = ((adminCount / totalCount) * 100).toFixed(1);
  const devPct = ((devCount / totalCount) * 100).toFixed(1);
  const approverPct = ((approverCount / totalCount) * 100).toFixed(1);
  const labelerPct = ((labelerCount / totalCount) * 100).toFixed(1);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return managedUsers.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.team.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchesTeam =
        teamFilter === 'ALL' ||
        u.team.toLowerCase().includes(teamFilter.toLowerCase());

      return matchesQuery && matchesRole && matchesStatus && matchesTeam;
    });
  }, [managedUsers, searchQuery, roleFilter, statusFilter, teamFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setTeamFilter('ALL');
    setCurrentPage(1);
  };

  const handleOpenRoleModal = (user: ManagedUser) => {
    setSelectedUserForRoleModal(user);
    setTargetRole(user.role);
    setTicketNumber(`SEC-2025-${Math.floor(1000 + Math.random() * 9000)} 권한 갱신`);
  };

  const handleCloseRoleModal = () => {
    setSelectedUserForRoleModal(null);
  };

  const handleConfirmRoleChange = () => {
    if (!selectedUserForRoleModal) return;
    onUpdateUserRole(
      selectedUserForRoleModal.id,
      targetRole,
      ticketNumber || 'SEC-AUTO-GEN',
      `관리자 수동 권한 갱신: ${selectedUserForRoleModal.role} -> ${targetRole}`
    );
    setRoleChangeFeedback(`${selectedUserForRoleModal.name} 님의 역할이 [${targetRole}]로 갱신되었습니다.`);
    setTimeout(() => setRoleChangeFeedback(null), 4000);
    handleCloseRoleModal();
  };

  const handleConfirmInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const initials = inviteName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: Omit<ManagedUser, 'id'> = {
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      initials: initials || 'GM',
      avatarBg: inviteRole === 'ADMIN' ? 'bg-primary/20' : inviteRole === 'APPROVER' ? 'bg-secondary/20' : inviteRole === 'LABELER' ? 'bg-tertiary/20' : 'bg-primary-container/20',
      avatarTextColor: inviteRole === 'ADMIN' ? 'text-primary' : inviteRole === 'APPROVER' ? 'text-secondary' : inviteRole === 'LABELER' ? 'text-tertiary' : 'text-on-primary-container',
      role: inviteRole,
      team: inviteTeam,
      weeklyPerformance: '신규 초대 등록 (온보딩 진행 중)',
      mfaType: 'TOTP',
      mfaLabel: '초대장 발송됨',
      lastActive: '방금 등록',
      ipAddress: '인증 대기',
      status: 'ACTIVE',
      statusLabel: '정상 활성',
    };

    onInviteUser(newUser);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setRoleChangeFeedback(`새 팀원 ${newUser.name} 님에게 초대장이 발송되었습니다.`);
    setTimeout(() => setRoleChangeFeedback(null), 4000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Team', 'MFA Status', 'Last Active', 'IP Address', 'Account Status'];
    const rows = managedUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      `"${u.team}"`,
      u.mfaLabel,
      `"${u.lastActive}"`,
      `"${u.ipAddress}"`,
      u.statusLabel,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gleo_IAM_Governance_Audit_Snapshot_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-6 text-[#dfe2ee]">
      {/* Toast Feedback Notification */}
      {roleChangeFeedback && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1c2028] border border-[#4edea3] text-[#dfe2ee] shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="material-symbols-outlined text-[#4edea3] text-xl">verified</span>
          <span className="text-sm font-medium">{roleChangeFeedback}</span>
        </div>
      )}

      {/* Header Context & Governance Level Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#908fa0] uppercase tracking-wider">
            <span>관리 (Administration)</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#4cd7f6]">사용자 및 권한 관리 (Users & Access)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#dfe2ee]">
              사용자 및 역할 거버넌스
            </h1>
            <div className="px-3 py-1 rounded-full bg-[#262a33] text-[#c7c4d7] font-mono text-xs flex items-center gap-2 border border-[#31353e]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span>총 {totalCount}명 등록 (활성 {activeCount}명, 검수 대기 {pendingCount}명)</span>
            </div>
          </div>
          <p className="text-sm text-[#908fa0] max-w-4xl leading-relaxed">
            Gleo Data Flywheel v2.4 기반의 엔터프라이즈 IAM 정책 통제, 세분화된 접근 권한(RBAC), MFA 보안 보증 및 불변 감사 추적 체계
          </p>
        </div>

        {/* Primary Action Cluster */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportCsv}
            id="btn-export-csv"
            className="px-3.5 py-2 rounded-lg bg-[#262a33] text-[#dfe2ee] hover:bg-[#31353e] hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold shadow-sm border border-[#31353e]"
            title="CSV 형식으로 사용자 목록 및 권한 감사 데이터 다운로드"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>CSV 내보내기</span>
          </button>
          <button
            onClick={onNavigateAuditLogs}
            id="btn-open-audit"
            className="px-3.5 py-2 rounded-lg bg-[#262a33] text-[#4cd7f6] hover:bg-[#31353e] transition-colors flex items-center gap-2 text-xs font-semibold shadow-sm border border-[#31353e]"
            title="역할 정책 감사 내역 (/admin/audit)"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>역할 정책 감사 내역</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            id="btn-invite-modal"
            className="px-3.5 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#e1e0ff] transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>새 팀원 초대 (+ Invite)</span>
          </button>
        </div>
      </div>

      {/* Top Bento Summary KPIs (Dense 5-Unit Modular Strip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Admin */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c24] p-4 flex flex-col justify-between border border-[#262a33] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">Admin (관리자)</span>
            <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">admin_panel_settings</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#c0c1ff]">{adminCount}</span>
            <span className="text-xs text-[#c7c4d7]">명</span>
          </div>
          <div className="flex items-center justify-between text-[#c7c4d7] text-xs">
            <span className="truncate">인프라/K8s/IAM 전권</span>
            <span className="font-mono text-xs text-[#c0c1ff] font-semibold">{adminPct}%</span>
          </div>
          <div className="w-full bg-[#31353e] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#c0c1ff] h-full transition-all duration-500" style={{ width: `${adminPct}%` }}></div>
          </div>
        </div>

        {/* 2. Developer */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c24] p-4 flex flex-col justify-between border border-[#262a33] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">Developer (ML 엔지니어)</span>
            <span className="material-symbols-outlined text-[#8083ff] text-[20px]">terminal</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#dfe2ee]">{devCount}</span>
            <span className="text-xs text-[#c7c4d7]">명</span>
          </div>
          <div className="flex items-center justify-between text-[#c7c4d7] text-xs">
            <span className="truncate">파이프라인 실행/빌드</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-semibold">{devPct}%</span>
          </div>
          <div className="w-full bg-[#31353e] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#8083ff] h-full transition-all duration-500" style={{ width: `${devPct}%` }}></div>
          </div>
        </div>

        {/* 3. Approver */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c24] p-4 flex flex-col justify-between border border-[#262a33] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">Approver (최종 승인)</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">verified</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#4cd7f6]">{approverCount}</span>
            <span className="text-xs text-[#c7c4d7]">명</span>
          </div>
          <div className="flex items-center justify-between text-[#c7c4d7] text-xs">
            <span className="truncate">GOI/GSI 가중치 인수</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-semibold">{approverPct}%</span>
          </div>
          <div className="w-full bg-[#31353e] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#4cd7f6] h-full transition-all duration-500" style={{ width: `${approverPct}%` }}></div>
          </div>
        </div>

        {/* 4. Labeler */}
        <div className="relative overflow-hidden rounded-xl bg-[#181c24] p-4 flex flex-col justify-between border border-[#262a33] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">Labeler (1차 검수)</span>
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">rate_review</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#4edea3]">{labelerCount}</span>
            <span className="text-xs text-[#c7c4d7]">명</span>
          </div>
          <div className="flex items-center justify-between text-[#c7c4d7] text-xs">
            <span className="truncate">품질 리뷰 큐 작업</span>
            <span className="font-mono text-xs text-[#4edea3] font-semibold">{labelerPct}%</span>
          </div>
          <div className="w-full bg-[#31353e] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#4edea3] h-full transition-all duration-500" style={{ width: `${labelerPct}%` }}></div>
          </div>
        </div>

        {/* 5. Weekly Productivity Throughput */}
        <div className="relative overflow-hidden rounded-xl bg-[#262a33] p-4 flex flex-col justify-between border border-[#31353e] shadow-sm">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.6875rem] text-[#4cd7f6] uppercase tracking-wider font-semibold">최근 7일 리뷰/승인</span>
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">trending_up</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#dfe2ee]">15,480</span>
            <span className="text-xs text-[#908fa0]">건</span>
          </div>
          <div className="flex items-center justify-between text-[#c7c4d7] text-xs">
            <span className="text-[#4edea3] font-mono text-[0.6875rem] font-bold">▲ 18.4% 전주 대비</span>
            <svg className="w-16 h-4 text-[#4edea3]" fill="none" viewBox="0 0 64 16">
              <path d="M1 13L12 11L24 14L36 7L48 9L63 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="w-full bg-[#0a0e16] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#4edea3] h-full w-[82%]"></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Split Grid (8 Columns Table + 4 Columns Policy Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left (8 Cols): Filter Toolbar + Governance Table */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Filter Bar */}
          <div className="rounded-xl bg-[#181c24] p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#262a33] shadow-sm">
            <div className="relative w-full md:w-72 flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#908fa0] text-[18px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder-[#908fa0] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#262a33] focus:outline-none focus:border-[#8083ff]/60 transition-colors font-mono"
                id="user-search-input"
                placeholder="이름, 이메일, 직원 ID 검색..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {/* Role Filter Dropdown */}
              <div className="relative inline-block shrink-0">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0a0e16] text-[#dfe2ee] font-mono text-xs px-3 py-2 rounded-lg border border-[#262a33] appearance-none pr-8 focus:outline-none focus:border-[#8083ff]/60 cursor-pointer"
                  id="filter-role"
                >
                  <option value="ALL">모든 역할 (All Roles)</option>
                  <option value="ADMIN">Admin (관리자)</option>
                  <option value="DEVELOPER">Developer (엔지니어)</option>
                  <option value="APPROVER">Approver (2차 승인자)</option>
                  <option value="LABELER">Labeler (1차 검수자)</option>
                  <option value="GUEST">Guest (읽기 전용)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#908fa0] pointer-events-none text-[16px]">expand_more</span>
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative inline-block shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0a0e16] text-[#dfe2ee] font-mono text-xs px-3 py-2 rounded-lg border border-[#262a33] appearance-none pr-8 focus:outline-none focus:border-[#8083ff]/60 cursor-pointer"
                  id="filter-status"
                >
                  <option value="ALL">상태: 전체</option>
                  <option value="ACTIVE">정상 활성 (Active)</option>
                  <option value="PENDING">승인 대기 (Pending)</option>
                  <option value="SUSPENDED">일시 정지 (Suspended)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#908fa0] pointer-events-none text-[16px]">expand_more</span>
              </div>

              {/* Team Filter Dropdown */}
              <div className="relative inline-block shrink-0">
                <select
                  value={teamFilter}
                  onChange={(e) => {
                    setTeamFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[#0a0e16] text-[#dfe2ee] font-mono text-xs px-3 py-2 rounded-lg border border-[#262a33] appearance-none pr-8 focus:outline-none focus:border-[#8083ff]/60 cursor-pointer"
                  id="filter-team"
                >
                  <option value="ALL">조직: 전체</option>
                  <option value="Foundation Alignment">Foundation Alignment</option>
                  <option value="Speech Copilot">Speech Copilot</option>
                  <option value="Eval Ops & Data">Eval Ops & Data</option>
                  <option value="외부 보안감사단">외부 보안감사단</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#908fa0] pointer-events-none text-[16px]">expand_more</span>
              </div>

              <button
                onClick={handleResetFilters}
                className="p-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#908fa0] hover:text-[#dfe2ee] transition-colors shrink-0"
                id="btn-reset-filters"
                title="필터 초기화"
              >
                <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
              </button>
            </div>
          </div>

          {/* User Data Table & Mobile Cards */}
          <div className="rounded-xl bg-[#181c24] overflow-hidden border border-[#262a33] shadow-sm flex flex-col">
            {/* Mobile Cards (< sm) */}
            <div className="flex sm:hidden flex-col gap-3 p-3 bg-[#181c24]">
              {paginatedUsers.length === 0 ? (
                <div className="text-center py-8 text-[#908fa0] text-xs font-mono">
                  검색 조건에 일치하는 사용자가 없습니다.
                </div>
              ) : (
                paginatedUsers.map((user) => {
                  const isPending = user.status === 'PENDING';
                  const isSuspended = user.status === 'SUSPENDED';

                  return (
                    <div
                      key={user.id}
                      className={`p-3.5 rounded-xl border border-[#262a33] bg-[#1c2028] flex flex-col gap-3 ${
                        isSuspended ? 'opacity-70' : ''
                      }`}
                    >
                      {/* Header row: Avatar + Name + Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full ${
                              user.avatarBg || 'bg-[#8083ff]/20'
                            } ${user.avatarTextColor || 'text-[#c0c1ff]'} font-bold flex items-center justify-center shrink-0 font-mono text-xs`}
                          >
                            {user.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm text-[#dfe2ee] flex items-center gap-1 truncate">
                              {user.name}
                              {user.isKeyMaster && (
                                <span className="material-symbols-outlined text-[#c0c1ff] text-[14px]">shield</span>
                              )}
                            </span>
                            <span className="font-mono text-[0.6875rem] text-[#908fa0] truncate">{user.email}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {user.status === 'ACTIVE' && (
                          <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-mono text-[0.625rem] border border-[#4edea3]/20 shrink-0">
                            정상 활성
                          </span>
                        )}
                        {user.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] font-mono text-[0.625rem] border border-[#ffb4ab]/30 animate-pulse shrink-0">
                            승인 대기
                          </span>
                        )}
                        {user.status === 'SUSPENDED' && (
                          <span className="px-2 py-0.5 rounded bg-[#31353e] text-[#908fa0] font-mono text-[0.625rem] shrink-0">
                            비활성화
                          </span>
                        )}
                      </div>

                      {/* Detail attributes grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0a0e16] p-2.5 rounded-lg border border-[#262a33]">
                        <div>
                          <span className="text-[0.625rem] text-[#908fa0] block">역할 (Role)</span>
                          <span className="font-bold text-[#c0c1ff]">{user.role}</span>
                        </div>
                        <div>
                          <span className="text-[0.625rem] text-[#908fa0] block">소속 팀</span>
                          <span className="text-[#c7c4d7] truncate block">{user.team}</span>
                        </div>
                        <div>
                          <span className="text-[0.625rem] text-[#908fa0] block">보안 인증</span>
                          <span className={user.mfaType === 'NONE' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}>
                            {user.mfaLabel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[0.625rem] text-[#908fa0] block">접속 정보</span>
                          <span className="text-[#dfe2ee] truncate block">{user.lastActive}</span>
                        </div>
                      </div>

                      {/* Mobile Actions Button Row */}
                      <div className="flex items-center gap-2 pt-1 border-t border-[#262a33]/60">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => onApprovePendingUser(user.id)}
                              type="button"
                              className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg bg-[#00885d] text-[#ffffff] font-mono text-xs font-bold hover:bg-[#4edea3] hover:text-[#003824] transition-colors flex items-center justify-center gap-1 active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              <span>승인 확정</span>
                            </button>
                            <button
                              onClick={() => onReactivateUser(user.id)}
                              type="button"
                              className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#262a33] text-[#ffb4ab] text-xs font-mono flex items-center justify-center active:scale-95"
                            >
                              초대 철회
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenRoleModal(user)}
                              type="button"
                              className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#4cd7f6] text-xs font-mono font-medium flex items-center justify-center gap-1 active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                              <span>역할 변경</span>
                            </button>
                            {isSuspended ? (
                              <button
                                onClick={() => onReactivateUser(user.id)}
                                type="button"
                                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#262a33] text-[#4edea3] text-xs font-mono flex items-center justify-center active:scale-95"
                              >
                                활성화
                              </button>
                            ) : (
                              <button
                                onClick={() => onReactivateUser(user.id)}
                                type="button"
                                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#262a33] text-[#908fa0] hover:text-[#ffb4ab] text-xs font-mono flex items-center justify-center active:scale-95"
                              >
                                비활성
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table (>= sm) */}
            <div className="hidden sm:block overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#262a33] font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider border-b border-[#31353e]">
                    <th className="p-3.5 font-semibold">사용자 식별</th>
                    <th className="p-3.5 font-semibold">부여 역할</th>
                    <th className="p-3.5 font-semibold">조직 / 팀</th>
                    <th className="p-3.5 font-semibold">최근 실적 (7일)</th>
                    <th className="p-3.5 font-semibold">MFA 보안</th>
                    <th className="p-3.5 font-semibold">접속 정보</th>
                    <th className="p-3.5 font-semibold">계정 상태</th>
                    <th className="p-3.5 font-semibold text-right">거버넌스 제어</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-[#262a33]" id="user-table-body">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-[#908fa0]">
                        검색 조건에 일치하는 사용자가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => {
                      const isPending = user.status === 'PENDING';
                      const isSuspended = user.status === 'SUSPENDED';

                      return (
                        <tr
                          key={user.id}
                          className={`hover:bg-[#1c2028]/80 transition-colors group ${
                            isSuspended ? 'opacity-70' : ''
                          }`}
                        >
                          {/* 사용자 식별 */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full ${
                                  user.avatarBg || 'bg-[#8083ff]/20'
                                } ${user.avatarTextColor || 'text-[#c0c1ff]'} font-bold flex items-center justify-center shrink-0 font-mono text-xs`}
                              >
                                {user.initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#dfe2ee] flex items-center gap-1">
                                  {user.name}
                                  {user.isKeyMaster && (
                                    <span
                                      className="material-symbols-outlined text-[#c0c1ff] text-[14px]"
                                      title="Secured Key Master"
                                    >
                                      shield
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono text-[0.6875rem] text-[#908fa0]">{user.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* 부여 역할 */}
                          <td className="p-3.5 whitespace-nowrap">
                            {user.role === 'ADMIN' && (
                              <span className="px-2 py-0.5 rounded bg-[#c0c1ff]/20 text-[#c0c1ff] font-mono text-[0.6875rem] font-bold tracking-wider border border-[#c0c1ff]/30">
                                ADMIN
                              </span>
                            )}
                            {user.role === 'APPROVER' && (
                              <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-[0.6875rem] font-bold tracking-wider border border-[#4cd7f6]/30">
                                APPROVER
                              </span>
                            )}
                            {user.role === 'DEVELOPER' && (
                              <span className="px-2 py-0.5 rounded bg-[#8083ff]/20 text-[#c0c1ff] font-mono text-[0.6875rem] font-bold tracking-wider border border-[#8083ff]/30">
                                DEVELOPER
                              </span>
                            )}
                            {user.role === 'LABELER' && (
                              <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[0.6875rem] font-bold tracking-wider border border-[#4edea3]/30">
                                LABELER
                              </span>
                            )}
                            {user.role === 'GUEST' && (
                              <span className="px-2 py-0.5 rounded bg-[#31353e] text-[#908fa0] font-mono text-[0.6875rem] font-semibold tracking-wider border border-[#464554]">
                                GUEST
                              </span>
                            )}
                          </td>

                          {/* 조직 / 팀 */}
                          <td className="p-3.5 whitespace-nowrap text-[#c7c4d7]">
                            {user.team}
                          </td>

                          {/* 최근 실적 (7일) */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className={`font-medium ${user.role === 'APPROVER' ? 'text-[#4cd7f6]' : 'text-[#dfe2ee]'}`}>
                                {user.weeklyPerformance}
                              </span>
                              {user.weeklyPerformanceSub && (
                                <span className="font-mono text-[0.6875rem] text-[#4edea3]">
                                  {user.weeklyPerformanceSub}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* MFA 보안 */}
                          <td className="p-3.5 whitespace-nowrap">
                            {user.mfaType === 'FIDO2' && (
                              <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-[#4edea3]">
                                <span className="material-symbols-outlined text-[14px]">key</span> FIDO2 활성
                              </span>
                            )}
                            {user.mfaType === 'TOTP' && (
                              <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-[#4edea3]">
                                <span className="material-symbols-outlined text-[14px]">phonelink_lock</span> TOTP 활성
                              </span>
                            )}
                            {user.mfaType === 'NONE' && (
                              <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-[#ffb4ab]">
                                <span className="material-symbols-outlined text-[14px]">warning</span> 미등록 경고
                              </span>
                            )}
                          </td>

                          {/* 접속 정보 */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-[#dfe2ee] font-mono text-xs">{user.lastActive}</span>
                              <span className="font-mono text-[0.6875rem] text-[#908fa0]">{user.ipAddress}</span>
                            </div>
                          </td>

                          {/* 계정 상태 */}
                          <td className="p-3.5 whitespace-nowrap">
                            {user.status === 'ACTIVE' && (
                              <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-mono text-[0.6875rem] border border-[#4edea3]/20">
                                정상 활성
                              </span>
                            )}
                            {user.status === 'PENDING' && (
                              <span className="px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] font-mono text-[0.6875rem] border border-[#ffb4ab]/30 animate-pulse">
                                2차 승인 대기
                              </span>
                            )}
                            {user.status === 'SUSPENDED' && (
                              <span className="px-2 py-0.5 rounded bg-[#31353e] text-[#908fa0] font-mono text-[0.6875rem]">
                                비활성화됨
                              </span>
                            )}
                          </td>

                          {/* 거버넌스 제어 버튼 */}
                          <td className="p-3.5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => onApprovePendingUser(user.id)}
                                    className="px-2.5 py-1 rounded bg-[#00885d] text-[#ffffff] font-mono text-[0.6875rem] font-bold hover:bg-[#4edea3] hover:text-[#003824] transition-colors shadow"
                                    title="계정 승인 확정"
                                  >
                                    승인 확정
                                  </button>
                                  <button
                                    onClick={() => onReactivateUser(user.id)}
                                    className="p-1.5 rounded hover:bg-[#262a33] text-[#ffb4ab] hover:text-[#ffdad6]"
                                    title="초대 철회"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                  </button>
                                </>
                              ) : isSuspended ? (
                                <>
                                  <button
                                    onClick={() => onReactivateUser(user.id)}
                                    className="p-1.5 rounded hover:bg-[#262a33] text-[#4cd7f6] hover:text-white"
                                    title="재활성화"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                                  </button>
                                  <button
                                    onClick={onNavigateAuditLogs}
                                    className="p-1.5 rounded hover:bg-[#262a33] text-[#908fa0] hover:text-[#4cd7f6]"
                                    title="감사 로그"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleOpenRoleModal(user)}
                                    className="p-1.5 rounded hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#c0c1ff]"
                                    title="역할 및 권한 변경"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                                  </button>
                                  <button
                                    onClick={onNavigateAuditLogs}
                                    className="p-1.5 rounded hover:bg-[#262a33] text-[#908fa0] hover:text-[#4cd7f6]"
                                    title="감사 로그"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Pagination & Metrics */}
            <div className="p-3 bg-[#262a33] border-t border-[#31353e] flex flex-col sm:flex-row items-center justify-between gap-2 text-[#c7c4d7] font-mono text-xs">
              <span className="text-[#908fa0]">
                전체 {filteredUsers.length}명 중 {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, filteredUsers.length)} 항목 표시 (페이지당 {pageSize}개)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded bg-[#181c24] text-[#908fa0] hover:text-[#dfe2ee] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      currentPage === num
                        ? 'bg-[#8083ff] text-[#0d0096]'
                        : 'bg-[#181c24] hover:bg-[#31353e] text-[#dfe2ee]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded bg-[#181c24] hover:bg-[#31353e] text-[#dfe2ee] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Integrated Role Definition & Security Guard Matrix */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Role Definition & Permission Matrix Card */}
          <div className="rounded-xl bg-[#181c24] p-4 flex flex-col gap-3.5 border border-[#262a33] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">security</span>
                <h3 className="text-sm font-semibold text-[#dfe2ee]">역할별 권한 매트릭스</h3>
              </div>
              <span className="font-mono text-[0.6875rem] text-[#908fa0] px-2 py-0.5 rounded bg-[#262a33]">RBAC v3</span>
            </div>

            {/* Matrix Comparison Micro Table */}
            <div className="overflow-x-auto rounded-lg bg-[#0a0e16] p-2.5 border border-[#262a33]">
              <table className="w-full text-left text-[#dfe2ee] text-xs">
                <thead>
                  <tr className="font-mono text-[0.6875rem] text-[#908fa0] uppercase border-b border-[#262a33]">
                    <th className="py-1.5 px-2">권한 기능군</th>
                    <th className="py-1.5 px-1 text-center text-[#c0c1ff]" title="Admin">ADM</th>
                    <th className="py-1.5 px-1 text-center text-[#4cd7f6]" title="Approver">APP</th>
                    <th className="py-1.5 px-1 text-center text-[#8083ff]" title="Developer">DEV</th>
                    <th className="py-1.5 px-1 text-center text-[#4edea3]" title="Labeler">LBL</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs divide-y divide-[#262a33]/60">
                  <tr>
                    <td className="py-1.5 px-2 text-[#c7c4d7]">인프라/키 발급 관리</td>
                    <td className="py-1.5 px-1 text-center text-[#c0c1ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#c7c4d7]">GOI/GSI 최종 인수 (2차)</td>
                    <td className="py-1.5 px-1 text-center text-[#c0c1ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#4cd7f6] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#c7c4d7]">파이프라인 Replay/실행</td>
                    <td className="py-1.5 px-1 text-center text-[#c0c1ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#4cd7f6] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#8083ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#c7c4d7]">1차 라벨링 검수 제출</td>
                    <td className="py-1.5 px-1 text-center text-[#c0c1ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#4cd7f6] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#8083ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#4edea3] font-bold">●</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-[#c7c4d7]">원시 오디오 다운로드(PII)</td>
                    <td className="py-1.5 px-1 text-center text-[#c0c1ff] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#4cd7f6] font-bold">●</td>
                    <td className="py-1.5 px-1 text-center text-[#8083ff]">△</td>
                    <td className="py-1.5 px-1 text-center text-[#908fa0]">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legend / Description */}
            <div className="flex flex-col gap-2 text-xs text-[#c7c4d7]">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c0c1ff] shrink-0 mt-1"></span>
                <span>
                  <strong className="text-[#dfe2ee]">Admin:</strong> 시스템, 보안 정책, RBAC 및 Provider 연결 전권 통제
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shrink-0 mt-1"></span>
                <span>
                  <strong className="text-[#dfe2ee]">Approver:</strong> 고위험 데이터셋 인수 및 가중치 전이(Flywheel Lock) 승인 권한
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8083ff] shrink-0 mt-1"></span>
                <span>
                  <strong className="text-[#dfe2ee]">Developer:</strong> 파이프라인 트리거, 모델 간 Diff 분석, 테스트 하네스 구축
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] shrink-0 mt-1"></span>
                <span>
                  <strong className="text-[#dfe2ee]">Labeler:</strong> 지정된 품질 검수 큐 전담 및 1차 마킹 산출물 작성
                </span>
              </div>
            </div>
          </div>

          {/* Strict Governance Compliance Warning Box */}
          <div className="rounded-xl bg-[#262a33] p-4 flex flex-col gap-2.5 border border-[#31353e] shadow-sm">
            <div className="flex items-center gap-2 text-[#4cd7f6] font-mono text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">policy</span>
              <span>불변 감사 및 토큰 만료 가이드</span>
            </div>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              역할(Role) 및 인가 스코프가 변경되면 <span className="text-[#4cd7f6] font-semibold">다음 JWT 토큰 갱신 시점(최대 15분)</span>부터 자동 강제 적용됩니다.
              모든 변경 이벤트는 분산 장부형 감사 로그(
              <code className="text-[#c0c1ff] font-mono text-[0.6875rem] bg-[#0a0e16] px-1.5 py-0.5 rounded">
                /admin/audit
              </code>
              )에 관리자 전자서명과 함께 영구히 보관됩니다.
            </p>
            <div className="mt-1 p-2 rounded bg-[#0a0e16] flex items-center justify-between border border-[#31353e]">
              <span className="font-mono text-[0.6875rem] text-[#908fa0]">최근 정책 해시:</span>
              <span className="font-mono text-[0.6875rem] text-[#4edea3]">0x8f2d..a94b (검증됨)</span>
            </div>
          </div>

          {/* System Security Health Meter */}
          <div className="rounded-xl bg-[#181c24] p-4 flex flex-col gap-2.5 border border-[#262a33] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider font-semibold">
                전체 MFA 적용 준수율
              </span>
              <span className="font-mono text-xs text-[#4edea3] font-bold">97.3%</span>
            </div>
            <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#4edea3] h-full w-[97.3%]"></div>
              <div className="bg-[#ffb4ab] h-full w-[2.7%]"></div>
            </div>
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">
              미등록 사용자 1명에게 자동 설정 독촉 메일이 4시간 전 발송되었습니다.
            </span>
          </div>
        </div>
      </div>

      {/* Role Modification Dialog Modal */}
      {selectedUserForRoleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0a0e16]/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-xl bg-[#1c2028] p-5 sm:p-6 flex flex-col gap-4 shadow-2xl border border-[#31353e] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.6875rem] text-[#4cd7f6] uppercase tracking-wider font-semibold">
                  권한 거버넌스 재할당
                </span>
                <h3 className="text-lg font-bold text-[#dfe2ee]">
                  {selectedUserForRoleModal.name} 역할 변경
                </h3>
                <span className="font-mono text-xs text-[#908fa0]">{selectedUserForRoleModal.email}</span>
              </div>
              <button
                onClick={handleCloseRoleModal}
                className="p-1.5 text-[#908fa0] hover:text-[#dfe2ee] rounded hover:bg-[#262a33]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-[#dfe2ee] font-semibold">
                새로운 할당 역할 선택
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-colors ${
                  targetRole === 'ADMIN' ? 'bg-[#c0c1ff]/15 border-[#c0c1ff]' : 'bg-[#181c24] border-[#262a33] hover:bg-[#262a33]'
                }`}>
                  <input
                    type="radio"
                    name="target-role"
                    value="ADMIN"
                    checked={targetRole === 'ADMIN'}
                    onChange={() => setTargetRole('ADMIN')}
                    className="accent-[#c0c1ff]"
                  />
                  <span className="font-mono text-xs text-[#c0c1ff] font-bold">ADMIN (관리자)</span>
                </label>

                <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-colors ${
                  targetRole === 'APPROVER' ? 'bg-[#4cd7f6]/15 border-[#4cd7f6]' : 'bg-[#181c24] border-[#262a33] hover:bg-[#262a33]'
                }`}>
                  <input
                    type="radio"
                    name="target-role"
                    value="APPROVER"
                    checked={targetRole === 'APPROVER'}
                    onChange={() => setTargetRole('APPROVER')}
                    className="accent-[#4cd7f6]"
                  />
                  <span className="font-mono text-xs text-[#4cd7f6] font-bold">APPROVER (승인자)</span>
                </label>

                <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-colors ${
                  targetRole === 'DEVELOPER' ? 'bg-[#8083ff]/15 border-[#8083ff]' : 'bg-[#181c24] border-[#262a33] hover:bg-[#262a33]'
                }`}>
                  <input
                    type="radio"
                    name="target-role"
                    value="DEVELOPER"
                    checked={targetRole === 'DEVELOPER'}
                    onChange={() => setTargetRole('DEVELOPER')}
                    className="accent-[#8083ff]"
                  />
                  <span className="font-mono text-xs text-[#8083ff] font-bold">DEVELOPER (엔지니어)</span>
                </label>

                <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-colors ${
                  targetRole === 'LABELER' ? 'bg-[#4edea3]/15 border-[#4edea3]' : 'bg-[#181c24] border-[#262a33] hover:bg-[#262a33]'
                }`}>
                  <input
                    type="radio"
                    name="target-role"
                    value="LABELER"
                    checked={targetRole === 'LABELER'}
                    onChange={() => setTargetRole('LABELER')}
                    className="accent-[#4edea3]"
                  />
                  <span className="font-mono text-xs text-[#4edea3] font-bold">LABELER (검수자)</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-[#dfe2ee] font-semibold">
                변경 사유 및 감사 티켓 번호 (필수)
              </label>
              <input
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full bg-[#0a0e16] text-[#dfe2ee] text-xs p-2.5 rounded-lg border border-[#31353e] focus:outline-none focus:border-[#8083ff] font-mono"
                placeholder="예: SEC-2025-0812 승인 권한자 증원"
                type="text"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#262a33]/60 border border-[#31353e] flex items-start gap-2.5 text-[#908fa0] text-xs leading-relaxed">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] shrink-0 mt-0.5">info</span>
              <span>
                확인 즉시 이전 활성 세션에 무효화 브로드캐스트가 전송되며 다음 요청부터 신규 토큰 검증이 수행됩니다.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={handleCloseRoleModal}
                className="px-4 py-2 rounded-lg bg-[#262a33] text-[#c7c4d7] text-xs font-semibold hover:text-[#dfe2ee] hover:bg-[#31353e] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRoleChange}
                className="px-4 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] text-xs font-bold hover:bg-[#e1e0ff] transition-colors shadow-md"
              >
                역할 갱신 및 서명
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite New Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0a0e16]/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-xl bg-[#1c2028] p-5 sm:p-6 flex flex-col gap-4 shadow-2xl border border-[#31353e] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.6875rem] text-[#4edea3] uppercase tracking-wider font-semibold">
                  신규 팀원 온보딩
                </span>
                <h3 className="text-lg font-bold text-[#dfe2ee]">
                  새 팀원 초대 (+ Invite Member)
                </h3>
                <span className="font-mono text-xs text-[#908fa0]">
                  초대 수락 시 하드웨어 FIDO2/TOTP 2차 인증 설정 링크가 전송됩니다.
                </span>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1.5 text-[#908fa0] hover:text-[#dfe2ee] rounded hover:bg-[#262a33]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmInvite} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-[#dfe2ee]">이름 (성함 및 영문 표기)</label>
                <input
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="예: 정우성 (Woosung Jung)"
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] text-xs p-2.5 rounded-lg border border-[#31353e] focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-[#dfe2ee]">업무용 이메일 주소</label>
                <input
                  required
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@gleo.internal 또는 @42dot.ai"
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] text-xs p-2.5 rounded-lg border border-[#31353e] focus:outline-none focus:border-[#8083ff] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-[#dfe2ee]">조직 / 팀 배정</label>
                  <select
                    value={inviteTeam}
                    onChange={(e) => setInviteTeam(e.target.value)}
                    className="w-full bg-[#0a0e16] text-[#dfe2ee] text-xs p-2.5 rounded-lg border border-[#31353e] focus:outline-none"
                  >
                    <option value="Foundation Alignment">Foundation Alignment</option>
                    <option value="Speech Copilot">Speech Copilot</option>
                    <option value="Eval Ops & Data">Eval Ops & Data</option>
                    <option value="외부 보안감사단">외부 보안감사단</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-[#dfe2ee]">초기 권한 (Role)</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as ManagedUser['role'])}
                    className="w-full bg-[#0a0e16] text-[#dfe2ee] text-xs p-2.5 rounded-lg border border-[#31353e] focus:outline-none"
                  >
                    <option value="DEVELOPER">Developer (ML 엔지니어)</option>
                    <option value="APPROVER">Approver (2차 승인자)</option>
                    <option value="LABELER">Labeler (1차 검수자)</option>
                    <option value="ADMIN">Admin (관리자)</option>
                    <option value="GUEST">Guest (읽기 전용)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#262a33]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#262a33] text-[#c7c4d7] text-xs font-semibold hover:bg-[#31353e]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#4edea3] text-[#003824] text-xs font-bold hover:bg-[#6ffbbe] shadow"
                >
                  초대장 발송 및 계정 생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
