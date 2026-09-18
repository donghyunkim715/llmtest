import React, { useState } from 'react';
import { StageRecord } from '../../types/flywheel';

interface DatasetsHandoffProps {
  records: StageRecord[];
}

export const DatasetsHandoffView: React.FC<DatasetsHandoffProps> = ({ records }) => {
  const approvedRecords = records.filter((r) => r.approvalDecision?.status === 'approved');
  const [exportFormat, setExportFormat] = useState<'sft' | 'dpo' | 'rlvr'>('sft');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleExport = () => {
    showToast(`승인된 ${approvedRecords.length}건의 레코드가 ${exportFormat.toUpperCase()} 형식의 JSONL 파일로 다운로드되었습니다.`);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      {toastMsg && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#31353e] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">download_done</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">익스포트 완료</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMsg}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
        <div>
          <h1 className="text-lg font-bold text-[#dfe2ee] flex items-center gap-2">
            학습 데이터셋 핸드오프 (Datasets & Handoff)
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3]">
              DISTILLATION READY
            </span>
          </h1>
          <p className="text-xs text-[#c7c4d7]">
            1차 검수와 2차 승인이 완료된 최고 품질의 Ground-Truth 레코드를 컴파일하여 SFT/DPO 파운데이션 미세조정 데이터셋으로 배포합니다.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#4edea3] hover:bg-[#34c78a] text-[#002111] font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 shadow"
        >
          <span className="material-symbols-outlined text-[1.125rem]">download</span>
          <span>Approved Slice Export (JSONL)</span>
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
          <span className="font-mono text-xs text-[#908fa0] uppercase">Handoff Approved Pool</span>
          <div className="text-2xl font-bold text-[#4edea3] mt-1">{approvedRecords.length} Records</div>
          <p className="text-xs text-[#c7c4d7] mt-1">2차 승인관(Dr. Elena Vance)의 전자 서명이 완료된 확정 레코드</p>
        </div>

        <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
          <span className="font-mono text-xs text-[#908fa0] uppercase">Target Distillation Model</span>
          <div className="text-2xl font-bold text-[#4cd7f6] mt-1">gleo-student-v1.3</div>
          <p className="text-xs text-[#c7c4d7] mt-1">다음 학습 사이클: 2025-03-w12 예정</p>
        </div>

        <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
          <span className="font-mono text-xs text-[#908fa0] uppercase">Format Standard</span>
          <div className="text-2xl font-bold text-[#c0c1ff] mt-1">ChatML & ToolCalls</div>
          <p className="text-xs text-[#c7c4d7] mt-1">정규화된 다중 턴 JSON Schema 구조</p>
        </div>
      </div>

      {/* Export Format Selector & Sample Preview */}
      <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
          <span className="font-mono text-xs font-bold text-[#dfe2ee] uppercase">Export Format Configuration</span>
          <div className="inline-flex p-0.5 bg-[#0a0e16] rounded-lg border border-[#262a33] font-mono text-xs">
            <button
              onClick={() => setExportFormat('sft')}
              className={`px-3 py-1 rounded transition-colors ${
                exportFormat === 'sft' ? 'bg-[#8083ff] text-[#0d0096] font-bold' : 'text-[#908fa0]'
              }`}
            >
              Supervised Fine-Tuning (SFT)
            </button>
            <button
              onClick={() => setExportFormat('dpo')}
              className={`px-3 py-1 rounded transition-colors ${
                exportFormat === 'dpo' ? 'bg-[#8083ff] text-[#0d0096] font-bold' : 'text-[#908fa0]'
              }`}
            >
              Direct Preference (DPO Chosen vs Rejected)
            </button>
            <button
              onClick={() => setExportFormat('rlvr')}
              className={`px-3 py-1 rounded transition-colors ${
                exportFormat === 'rlvr' ? 'bg-[#8083ff] text-[#0d0096] font-bold' : 'text-[#908fa0]'
              }`}
            >
              RLVR Verifiable Reward
            </button>
          </div>
        </div>

        <div className="font-mono text-xs text-[#908fa0] flex justify-between">
          <span>Sample Export Payload Preview ({exportFormat.toUpperCase()} Format):</span>
          <span className="text-[#4edea3]">Schema Validation Pass 100%</span>
        </div>

        <div className="bg-[#0a0e16] p-3 rounded-lg font-mono text-xs max-h-72 overflow-y-auto border border-[#262a33]">
          <pre className="text-[#4edea3]">
            <code>
              {exportFormat === 'sft' &&
                JSON.stringify(
                  {
                    record_id: 'REC-89021',
                    system_prompt: 'Genesis In-Cabin Core Agent Rules v4.8...',
                    messages: [
                      { role: 'user', content: '에어컨 22도로 맞추고 판교 현대백화점 경로 안내해줘' },
                      {
                        role: 'assistant',
                        tool_calls: [
                          {
                            type: 'function',
                            function: {
                              name: 'climate.set_temperature',
                              arguments: '{"target_temp_celsius":22.0,"target_zone":"all"}',
                            },
                          },
                          {
                            type: 'function',
                            function: {
                              name: 'navigation.set_destination',
                              arguments: '{"query":"판교 현대백화점","search_category":"department_store"}',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  null,
                  2
                )}

              {exportFormat === 'dpo' &&
                JSON.stringify(
                  {
                    prompt: '에어컨 22도로 맞추고 판교 현대백화점 경로 안내해줘',
                    chosen: '[{"tool":"climate.set_temperature","args":{"target_temp_celsius":22.0}},{"tool":"navigation.set_destination","args":{"query":"판교 현대백화점"}}]',
                    rejected: '[{"tool":"set_air_conditioner","args":{"temperature":22}}]',
                    rationale: 'Student dropped navigation intent and ignored passenger zones.',
                  },
                  null,
                  2
                )}

              {exportFormat === 'rlvr' &&
                JSON.stringify(
                  {
                    task: 'vehicle_multiturn_tool_execution',
                    test_cases: ['test_hvac_temperature_range', 'test_navigation_poi_resolution'],
                    reward_rubric: {
                      schema_correctness: 1.0,
                      dual_intent_presence: 1.0,
                      safety_compliance: 1.0,
                    },
                  },
                  null,
                  2
                )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
