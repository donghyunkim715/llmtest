import React, { useState } from 'react';
import { UserProfile } from '../../types/flywheel';
import { INITIAL_USERS } from '../../data/mockFlywheelData';

interface LoginAuthViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  currentUser?: UserProfile | null;
  onBackToDashboard?: () => void;
}

export const LoginAuthView: React.FC<LoginAuthViewProps> = ({
  onLoginSuccess,
  currentUser,
  onBackToDashboard,
}) => {
  const [email, setEmail] = useState('lead.aligner@gleo.ai');
  const [password, setPassword] = useState('supersecureclusterpass2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'creds' | 'google' | 'okta' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMethod('creds');
    setTimeout(() => {
      // Find matching user or fallback to Dr. K. Vance / Dr. Elena Vance
      const matched = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_USERS[0];
      onLoginSuccess(matched);
      setIsLoading(false);
    }, 600);
  };

  const handleGoogleSso = () => {
    setIsLoading(true);
    setAuthMethod('google');
    setTimeout(() => {
      // Google Workspace SSO maps to lead aligner / Dr. Elena Vance
      const user = INITIAL_USERS.find((u) => u.email.includes('42dot.ai')) || INITIAL_USERS[1];
      onLoginSuccess(user);
      setIsLoading(false);
    }, 700);
  };

  const handleOktaSaml = () => {
    setIsLoading(true);
    setAuthMethod('okta');
    setTimeout(() => {
      // Okta SAML admin login maps to Dr. K. Vance
      const user = INITIAL_USERS.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      onLoginSuccess(user);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] flex items-center justify-center p-4 selection:bg-[#8083ff] selection:text-[#0d0096] relative overflow-hidden">
      {/* Back to workspace shortcut if already authenticated */}
      {currentUser && onBackToDashboard && (
        <button
          onClick={onBackToDashboard}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1c2028] border border-[#262a33] text-xs font-mono text-[#c7c4d7] hover:text-[#dfe2ee] hover:bg-[#262a33] transition-colors shadow"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>워크스페이스로 돌아가기 (현재: {currentUser.name})</span>
        </button>
      )}

      <main className="w-full max-w-lg relative z-10">
        <div className="relative w-full overflow-hidden bg-[#0a0e16] rounded-2xl border border-[#262a33] shadow-2xl p-6 sm:p-8 flex flex-col gap-4">
          {/* Ambient Energy Halo */}
          <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-[#8083ff] opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-[#4cd7f6] opacity-15 blur-3xl pointer-events-none"></div>

          {/* Header & Brand Identity */}
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <div className="relative p-2 rounded-xl bg-[#1c2028] border border-[#262a33] shadow-sm flex items-center justify-center">
              <img
                alt="Gleo Data Flywheel Logo"
                className="w-12 h-12 object-contain rounded"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VnxqW1NgjjwsKU65QLFM1W3hynSbXpLg-0twBLM7Qtc2P-6HEeHGOd8ff8_SeZ3U1WZJYhZnmbgKZomzfi16t_INdXvYHlSg_YfugwU0eX0yYg7hHTZSyGyiK12SCtoSgxLEyc3kKt6l91S4QjDNIqzyqu6YP8nKmuNybvJnjAXd17GaC2ZEOCVLKIZjKabd_nLruDxZgbx_Xt8RwSYS-OCuNrzy6-M5d0UsdC3IrHlADufuyKh_TlGoc"
              />
            </div>

            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#dfe2ee] tracking-tight">
                Gleo Data Flywheel
              </h1>
              <span className="font-mono text-[0.6875rem] text-[#4cd7f6] bg-[#1c2028] px-2 py-0.5 rounded border border-[#262a33] uppercase font-bold">
                PROD
              </span>
            </div>

            <p className="text-xs text-[#908fa0] max-w-sm">
              Automated Model Alignment & LLM Data Engineering Platform
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#262a33] text-[#dfe2ee] text-[0.6875rem] font-mono border border-[#31353e]">
                <span className="material-symbols-outlined text-[#4edea3] text-[14px]">verified_user</span>
                ISO 27001
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#262a33] text-[#dfe2ee] text-[0.6875rem] font-mono border border-[#31353e]">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">shield</span>
                SOC 2 Type II
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#262a33] text-[#dfe2ee] text-[0.6875rem] font-mono border border-[#31353e]">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[14px]">lock</span>
                SAML 2.0 Enforced
              </span>
            </div>
          </div>

          {/* Enterprise SSO Actions */}
          <div className="relative z-10 flex flex-col gap-2.5 mt-2">
            <button
              onClick={handleGoogleSso}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#262a33] hover:bg-[#353942] active:scale-[0.99] text-[#dfe2ee] rounded-xl font-medium text-xs sm:text-sm transition-all border border-[#31353e] shadow-sm disabled:opacity-50"
              type="button"
            >
              {isLoading && authMethod === 'google' ? (
                <span className="w-4 h-4 rounded-full border-2 border-[#4cd7f6] border-t-transparent animate-spin"></span>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Google Workspace 계정으로 로그인 (SSO)</span>
            </button>

            <button
              onClick={handleOktaSaml}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#262a33] hover:bg-[#353942] active:scale-[0.99] text-[#dfe2ee] rounded-xl font-medium text-xs sm:text-sm transition-all border border-[#31353e] shadow-sm disabled:opacity-50"
              type="button"
            >
              {isLoading && authMethod === 'okta' ? (
                <span className="w-4 h-4 rounded-full border-2 border-[#4cd7f6] border-t-transparent animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">vpn_key</span>
              )}
              <span>엔터프라이즈 Okta / SAML 로그인</span>
            </button>
          </div>

          {/* Section Divider */}
          <div className="relative z-10 flex items-center gap-3 my-1">
            <div className="h-px bg-[#262a33] flex-1"></div>
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">
              또는 사내 엔지니어링 ID 로그인
            </span>
            <div className="h-px bg-[#262a33] flex-1"></div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3.5">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[0.6875rem] text-[#c7c4d7] uppercase flex items-center justify-between">
                <span>업무용 이메일</span>
                <span className="text-[#4cd7f6] font-mono lowercase">@gleo.ai</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 material-symbols-outlined text-[#908fa0] text-base pointer-events-none">
                  alternate_email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#1c2028] border border-[#262a33] rounded-lg text-[#dfe2ee] font-mono text-xs focus:outline-none focus:border-[#8083ff] focus:bg-[#262a33] transition-colors placeholder:text-[#908fa0]"
                  placeholder="engineer@gleo.ai"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[0.6875rem] text-[#c7c4d7] uppercase">보안 비밀번호</label>
                <button
                  type="button"
                  onClick={() => alert('보안 엔지니어링 데스크(/support/reset)로 비밀번호 재설정 티켓이 접수되었습니다.')}
                  className="font-mono text-[0.6875rem] text-[#c0c1ff] hover:underline"
                >
                  비밀번호 재설정 요청
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 material-symbols-outlined text-[#908fa0] text-base pointer-events-none">
                  lock
                </span>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-[#1c2028] border border-[#262a33] rounded-lg text-[#dfe2ee] font-mono text-xs focus:outline-none focus:border-[#8083ff] focus:bg-[#262a33] transition-colors placeholder:text-[#908fa0]"
                  placeholder="••••••••••••••••"
                />
                <button
                  type="button"
                  aria-label="비밀번호 표시 전환"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center text-[#908fa0] hover:text-[#dfe2ee] focus:outline-none"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Cluster Status */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1c2028] border-[#31353e] text-[#8083ff] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-[#c7c4d7]">기기 보안 세션 기억하기 (30일)</span>
              </label>

              <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-[#4edea3]">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                Cluster Online
              </span>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#8083ff] hover:opacity-90 active:scale-[0.99] text-[#0d0096] rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg mt-1 disabled:opacity-50"
            >
              {isLoading && authMethod === 'creds' ? (
                <span className="w-5 h-5 rounded-full border-2 border-[#0d0096] border-t-transparent animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              )}
              <span>워크스페이스 로그인 (Sign In)</span>
            </button>
          </form>

          {/* Quick Simulation Profiles Selector */}
          <div className="relative z-10 pt-2 border-t border-[#262a33]/60 flex flex-col gap-1.5">
            <span className="font-mono text-[0.6875rem] text-[#908fa0] uppercase tracking-wider">
              빠른 역할 시뮬레이션 로그인:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {INITIAL_USERS.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onLoginSuccess(user)}
                  className="p-1.5 rounded-lg bg-[#181c24] hover:bg-[#262a33] text-left border border-[#262a33] transition-colors"
                >
                  <div className="text-[0.6875rem] font-bold text-[#dfe2ee] truncate">{user.name}</div>
                  <div className="font-mono text-[0.625rem] text-[#4cd7f6] uppercase">{user.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* MFA Compliance Advisory */}
          <div className="relative z-10 flex items-start gap-2.5 p-3 rounded-xl bg-[#181c24] border border-[#262a33] text-[#c7c4d7]">
            <span className="material-symbols-outlined text-[#4cd7f6] shrink-0 mt-0.5 text-base">
              fingerprint
            </span>
            <p className="text-xs leading-relaxed">
              운영 환경(REAL) 데이터셋 파이프라인 접근 시 하드웨어{' '}
              <span className="text-[#4cd7f6] font-mono font-semibold">FIDO2</span> 또는{' '}
              <span className="text-[#4cd7f6] font-mono font-semibold">TOTP</span> 2차 인증이 즉시 요구됩니다.
            </p>
          </div>

          {/* Security Audit Footer */}
          <div className="relative z-10 pt-2 border-t border-[#262a33] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-1 font-mono text-[0.6875rem] text-[#908fa0]">
              <span className="material-symbols-outlined text-sm text-[#4edea3]">policy</span>
              <span>내부 보안 감사 활성화됨 (Session ID & IP Audit Logged)</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[0.6875rem] text-[#908fa0]">
              <span className="text-[#c7c4d7]">v4.2.0-prod-core</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => alert('Gleo Enterprise IAM Help Desk 연결: security@gleo.internal')}
                className="hover:text-[#dfe2ee] hover:underline"
              >
                Help Desk
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
