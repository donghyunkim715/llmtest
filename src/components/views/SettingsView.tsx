import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [autoNext, setAutoNext] = useState(true);
  const [strictSchema, setStrictSchema] = useState(true);
  const [toast, setToast] = useState(false);

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#dfe2ee]">플랫폼 환경설정 (Platform Settings)</h1>
          <p className="text-xs text-[#c7c4d7]">
            단축키, 자동 다음 레코드 이동, 스키마 엄격 검증 모드 및 PII 마스킹 규칙을 설정합니다.
          </p>
        </div>
      </div>

      <div className="bg-[#181c24] rounded-xl p-5 border border-[#262a33] max-w-2xl space-y-4 font-mono text-xs">
        <label className="flex items-center justify-between pb-3 border-b border-[#262a33] cursor-pointer min-h-[44px]">
          <div className="pr-3">
            <span className="font-bold text-sm text-[#dfe2ee] block">자동 다음 항목 이동 (Auto-advance on commit)</span>
            <span className="text-[#908fa0] text-xs">Cmd+Enter로 판정 커밋 시 자동으로 다음 미검수 레코드로 이동합니다.</span>
          </div>
          <input
            type="checkbox"
            checked={autoNext}
            onChange={(e) => setAutoNext(e.target.checked)}
            className="w-5 h-5 accent-[#4cd7f6] shrink-0"
          />
        </label>

        <label className="flex items-center justify-between pb-3 border-b border-[#262a33] cursor-pointer min-h-[44px]">
          <div className="pr-3">
            <span className="font-bold text-sm text-[#dfe2ee] block">엄격 스키마 린트 (Strict JSON Schema Validation)</span>
            <span className="text-[#908fa0] text-xs">필수 파라미터가 누락된 모델 응답은 자동으로 invalid 플래그를 부착합니다.</span>
          </div>
          <input
            type="checkbox"
            checked={strictSchema}
            onChange={(e) => setStrictSchema(e.target.checked)}
            className="w-5 h-5 accent-[#4cd7f6] shrink-0"
          />
        </label>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setToast(true);
              setTimeout(() => setToast(false), 2000);
            }}
            className="min-h-[44px] px-5 py-2.5 bg-[#8083ff] text-[#0d0096] font-bold rounded-xl hover:bg-[#686bff] hover:text-white transition-colors active:scale-95 shadow"
          >
            설정 저장
          </button>
          {toast && <span className="text-[#4edea3] font-semibold">설정이 성공적으로 저장되었습니다.</span>}
        </div>
      </div>
    </div>
  );
};
