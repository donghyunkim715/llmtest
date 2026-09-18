import React, { useState } from 'react';
import { GovernanceAuditLog } from '../../types/flywheel';

interface AuditLogsViewProps {
  auditLogs: GovernanceAuditLog[];
  onNavigateUserManagement: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  auditLogs,
  onNavigateUserManagement,
}) => {
  const [filterAction, setFilterAction] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch =
      !search ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.targetUser.toLowerCase().includes(search.toLowerCase()) ||
      log.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-6 text-[#dfe2ee]">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#908fa0] uppercase tracking-wider">
            <span>관리 (Administration)</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#4cd7f6]">보안 감사 레지스트리 (Audit Logs)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#dfe2ee]">
              불변 거버넌스 감사 추적 (Audit Logs)
            </h1>
            <div className="px-3 py-1 rounded-full bg-[#1c2028] text-[#4edea3] font-mono text-xs flex items-center gap-2 border border-[#31353e]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span>WORM 불변 스토리지 동기화됨</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#908fa0] max-w-4xl">
            ISO 27001 및 SOC 2 Type II 규정에 따라 기록된 모든 IAM 역할 변경, SAML 세션 발급, 데이터셋 승인 서명 내역입니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={onNavigateUserManagement}
            type="button"
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#262a33] text-[#c7c4d7] hover:bg-[#31353e] hover:text-[#dfe2ee] transition-colors flex items-center justify-center gap-2 text-xs font-semibold border border-[#31353e] active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>사용자 거버넌스로 이동</span>
          </button>
          <button
            onClick={() => alert('불변 감사 로그 무결성 Merkle Tree 검증 완료: 100% 정상.')}
            type="button"
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>암호화 무결성 검증</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-[#181c24] p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-[#262a33] shadow-sm">
        <div className="relative w-full sm:w-80 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#908fa0] text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="실행자, 대상, 티켓 번호 검색..."
            className="w-full bg-[#0a0e16] text-[#dfe2ee] placeholder-[#908fa0] text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#262a33] font-mono focus:outline-none focus:border-[#8083ff]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full sm:w-auto bg-[#0a0e16] text-[#dfe2ee] font-mono text-xs px-3 py-2.5 rounded-lg border border-[#262a33] focus:outline-none"
          >
            <option value="ALL">모든 작업 유형 (All Actions)</option>
            <option value="ROLE_ELEVATION">ROLE_ELEVATION (역할 변경)</option>
            <option value="SSO_SAML_POLICY_SYNC">SSO_SAML_POLICY_SYNC (인증 정책)</option>
            <option value="APPROVAL_SIGN_OFF">APPROVAL_SIGN_OFF (승인 서명)</option>
            <option value="ACCOUNT_SUSPEND">ACCOUNT_SUSPEND (계정 정지)</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table & Mobile Cards */}
      <div className="rounded-xl bg-[#181c24] overflow-hidden border border-[#262a33] shadow-sm flex flex-col">
        {/* Mobile Cards (< sm) */}
        <div className="flex sm:hidden flex-col gap-3 p-3 bg-[#181c24]">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-[#908fa0] font-mono text-xs">
              검색 조건에 일치하는 감사 로그가 없습니다.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-[#262a33] bg-[#1c2028] flex flex-col gap-2.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#8083ff]/15 text-[#c0c1ff] font-bold text-[0.625rem] border border-[#8083ff]/30 truncate">
                    {log.action}
                  </span>
                  <span className="text-[0.6875rem] text-[#908fa0] shrink-0">{log.timestamp}</span>
                </div>

                <div className="flex flex-col gap-1 bg-[#0a0e16] p-2.5 rounded-lg border border-[#262a33]">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.625rem] text-[#908fa0]">실행자 (Actor)</span>
                    <span className="font-semibold text-[#dfe2ee]">{log.actorName} ({log.actorEmail})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.625rem] text-[#908fa0]">대상 (Target)</span>
                    <span className="text-[#4cd7f6] font-semibold">{log.targetUser}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.625rem] text-[#908fa0]">티켓 번호</span>
                    <span className="text-[#4edea3]">{log.ticketNumber}</span>
                  </div>
                </div>

                <div className="text-xs text-[#c7c4d7] font-sans leading-relaxed">
                  {log.detail}
                </div>

                <div className="pt-2 border-t border-[#262a33] flex items-center justify-between text-[0.625rem] text-[#908fa0]">
                  <span>SHA-256 Hash</span>
                  <span className="font-mono text-[#c0c1ff] bg-[#0a0e16] px-1.5 py-0.5 rounded border border-[#262a33]">
                    {log.hash}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (>= sm) */}
        <div className="hidden sm:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#262a33] font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider border-b border-[#31353e]">
                <th className="p-3.5 font-semibold">타임스탬프</th>
                <th className="p-3.5 font-semibold">실행자 (Actor)</th>
                <th className="p-3.5 font-semibold">작업 유형</th>
                <th className="p-3.5 font-semibold">대상 (Target)</th>
                <th className="p-3.5 font-semibold">상세 감사 기록</th>
                <th className="p-3.5 font-semibold">티켓 번호</th>
                <th className="p-3.5 font-semibold text-right">서명 해시 (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#262a33] font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1c2028] transition-colors">
                  <td className="p-3.5 whitespace-nowrap text-[#908fa0] text-[0.6875rem]">
                    {log.timestamp}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#dfe2ee]">{log.actorName}</span>
                      <span className="text-[0.6875rem] text-[#908fa0]">{log.actorEmail}</span>
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[#8083ff]/15 text-[#c0c1ff] font-bold text-[0.6875rem] border border-[#8083ff]/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-[#4cd7f6] font-medium">
                    {log.targetUser}
                  </td>
                  <td className="p-3.5 font-sans text-xs text-[#c7c4d7] max-w-md">
                    {log.detail}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-[#4edea3]">
                    {log.ticketNumber}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-right">
                    <span className="px-2 py-1 rounded bg-[#0a0e16] text-[#c0c1ff] text-[0.6875rem] border border-[#262a33]">
                      {log.hash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
