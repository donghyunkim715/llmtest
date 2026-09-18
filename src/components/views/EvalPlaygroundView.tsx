import React, { useState } from 'react';
import { StageRecord } from '../../types/flywheel';

interface EvalPlaygroundProps {
  initialRecord?: StageRecord;
  onSaveAsCandidate?: (recordId: string, candidatePayload: string, modelName: string) => void;
}

export const EvalPlaygroundView: React.FC<EvalPlaygroundProps> = ({
  initialRecord,
  onSaveAsCandidate,
}) => {
  const [systemPrompt, setSystemPrompt] = useState<string>(
    initialRecord?.systemPrompt ||
      'Genesis In-Cabin Core Agent Rules v4.8 (Tool Calling Enabled)\nYou are Genesis AI vehicle controller. Parse concurrent intents (HVAC + Navigation). Produce deterministic JSON tool calling array. Never omit sub-parameters.'
  );

  const [priorContext, setPriorContext] = useState<string>(
    initialRecord?.priorTurns.map((t) => `${t.role === 'user' ? 'User' : 'Assistant'}: ${t.text}`).join('\n') ||
      'User: 오늘 고속도로 통행료 얼마 나왔어?\nAssistant: 오늘 누적 하이패스 통행료는 4,800원입니다.'
  );

  const [userQuery, setUserQuery] = useState<string>(
    initialRecord?.currentTargetQuery || '“에어컨 22도로 맞추고 <POI_NAME>판교 현대백화점</POI_NAME> 경로 안내해줘”'
  );

  const [temperature, setTemperature] = useState<number>(0.2);
  const [maxTokens, setMaxTokens] = useState<number>(512);

  // Model selections
  const [selectedModels, setSelectedModels] = useState<{ [key: string]: boolean }>({
    production: true,
    student: true,
    claude: true,
    gpt4o: true,
    deepseek: false,
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Model Results state
  const [modelOutputs, setModelOutputs] = useState<
    Array<{
      id: string;
      modelName: string;
      role: string;
      latencyMs: number;
      tokens: number;
      schemaValid: boolean;
      output: string;
      error?: string;
    }>
  >([
    {
      id: 'prod',
      modelName: 'Production (Real)',
      role: '실운영 로그',
      latencyMs: 410,
      tokens: 312,
      schemaValid: true,
      output: JSON.stringify(
        [
          { tool: 'set_air_conditioner', args: { temperature: 22, mode: 'auto' } },
          { tool: 'navigate_to', args: { poi_name: '판교 현대백화점', route_preference: 'fastest' } },
        ],
        null,
        2
      ),
    },
    {
      id: 'student',
      modelName: 'gleo-student-v1.2',
      role: '소형 학생 모델',
      latencyMs: 124,
      tokens: 184,
      schemaValid: false,
      error: "SCHEMA_ERROR: Missing target_zone & Dropped second intent",
      output: `[
  {
    "tool": "set_air_conditioner",
    "args": {
      "temperature": 22
    }
  }
]`,
    },
    {
      id: 'claude',
      modelName: 'Claude 3.5 Sonnet',
      role: 'Teacher 1 (Benchmark)',
      latencyMs: 820,
      tokens: 420,
      schemaValid: true,
      output: JSON.stringify(
        [
          {
            tool: 'climate.set_temperature',
            args: { target_temp_celsius: 22.0, target_zone: 'all', auto_defrost: false },
          },
          {
            tool: 'navigation.set_destination',
            args: { query: '판교 현대백화점', search_category: 'department_store', routing_mode: 'recommended' },
          },
        ],
        null,
        2
      ),
    },
    {
      id: 'gpt4o',
      modelName: 'GPT-4o (2024-11-20)',
      role: 'Teacher 2',
      latencyMs: 690,
      tokens: 395,
      schemaValid: true,
      output: JSON.stringify(
        [
          {
            tool: 'climate.set_temperature',
            args: { target_temp_celsius: 22.0, target_zone: 'driver_and_passenger' },
          },
          { tool: 'navigation.route_to_poi', args: { keyword: '판교 현대백화점' } },
        ],
        null,
        2
      ),
    },
  ]);

  const [mobileActiveOutputIndex, setMobileActiveOutputIndex] = useState(0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleRunInference = () => {
    setIsRunning(true);
    showToast('선택한 모델들로 병렬 추론 요청을 전송했습니다...');

    setTimeout(() => {
      setIsRunning(false);
      showToast('다중 모델 실시간 응답 완료 (4개 모델)');
    }, 1200);
  };

  const handleSaveToRun = (outputItem: (typeof modelOutputs)[0]) => {
    if (onSaveAsCandidate && initialRecord) {
      onSaveAsCandidate(initialRecord.id, outputItem.output, outputItem.modelName);
    }
    showToast(`${outputItem.modelName} 출력이 레코드의 검수 후보로 등록되었습니다.`);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      {toastMsg && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#31353e] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">terminal</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">Playground 완료</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMsg}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#c0c1ff]/10 border border-[#8083ff]/30 flex items-center justify-center text-[#c0c1ff] shrink-0">
            <span className="material-symbols-outlined text-[1.5rem]">terminal</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-lg text-[#dfe2ee] tracking-tight flex flex-wrap items-center gap-2">
              <span>다중 모델 비교 추론 플레이그라운드</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#8083ff]/20 text-[#c0c1ff]">
                MULTI-MODEL REPLAY
              </span>
            </h1>
            <p className="text-xs text-[#c7c4d7] mt-0.5">
              실운영 LLM 로그를 기반으로 여러 모델에 프롬프트를 즉시 전달하고 실시간 도구 호출과 응답 일치도를 교차 검증합니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setUserQuery('“시트 열선 2단으로 켜고 통풍은 꺼줘”');
              setPriorContext('');
            }}
            type="button"
            className="min-h-[40px] px-3 py-2 rounded bg-[#262a33] hover:bg-[#31353e] text-xs font-mono text-[#dfe2ee] transition-colors border border-[#31353e] flex items-center justify-center"
          >
            차량 제어 샘플 로드
          </button>
          <button
            onClick={handleRunInference}
            disabled={isRunning}
            type="button"
            className="min-h-[44px] px-4 py-2 bg-[#4cd7f6] hover:bg-[#03b5d3] text-[#001f26] font-bold rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#001f26] border-t-transparent rounded-full animate-spin"></span>
                <span>Inference Running...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[1.125rem]">play_arrow</span>
                <span>Run Parallel Inference</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Grid: Left Prompt/Context, Right Params & Model Checkboxes */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left: Input Context Editor (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
            <span className="font-mono text-xs font-bold text-[#dfe2ee] uppercase">Prompt & Multiturn Input</span>
            <span className="font-mono text-[0.6875rem] text-[#908fa0]">실운영 로그 파라미터 직접 편집</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-mono text-[0.6875rem] text-[#908fa0] uppercase block mb-1">
                System Prompt (Tool Schema Rules)
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0e16] text-[#dfe2ee] p-2.5 rounded font-mono text-xs border border-[#262a33] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
              />
            </div>

            <div>
              <label className="font-mono text-[0.6875rem] text-[#908fa0] uppercase block mb-1">
                Prior Turns Context (Multiturn History)
              </label>
              <textarea
                value={priorContext}
                onChange={(e) => setPriorContext(e.target.value)}
                rows={2}
                placeholder="User: ...&#10;Assistant: ..."
                className="w-full bg-[#0a0e16] text-[#c7c4d7] p-2.5 rounded font-mono text-xs border border-[#262a33] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
              />
            </div>

            <div>
              <label className="font-mono text-[0.6875rem] text-[#4cd7f6] uppercase block mb-1 font-bold">
                Target User Voice Query (PII Protected)
              </label>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full bg-[#0a0e16] text-[#dfe2ee] font-semibold p-2.5 rounded text-sm border border-[#262a33] focus:outline-none focus:ring-1 focus:ring-[#4cd7f6]"
              />
            </div>
          </div>
        </div>

        {/* Right: Params & Target Models Selection (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
          <div className="pb-1 border-b border-[#262a33]">
            <span className="font-mono text-xs font-bold text-[#dfe2ee] uppercase">Comparison Lineup & Parameters</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[#908fa0] uppercase text-[0.6875rem] block mb-1.5">Evaluate Models:</span>
              <div className="space-y-2 bg-[#0a0e16] p-2.5 rounded-lg border border-[#262a33]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedModels.production}
                      onChange={(e) => setSelectedModels({ ...selectedModels, production: e.target.checked })}
                      className="accent-[#4cd7f6]"
                    />
                    <span className="text-[#dfe2ee]">Production (Real)</span>
                  </div>
                  <span className="text-[0.625rem] text-[#908fa0]">실운영 로그</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedModels.student}
                      onChange={(e) => setSelectedModels({ ...selectedModels, student: e.target.checked })}
                      className="accent-[#4cd7f6]"
                    />
                    <span className="text-[#4cd7f6] font-bold">gleo-student-v1.2</span>
                  </div>
                  <span className="text-[0.625rem] text-[#4cd7f6]">Student</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedModels.claude}
                      onChange={(e) => setSelectedModels({ ...selectedModels, claude: e.target.checked })}
                      className="accent-[#8083ff]"
                    />
                    <span className="text-[#c0c1ff] font-bold">Claude 3.5 Sonnet</span>
                  </div>
                  <span className="text-[0.625rem] text-[#c0c1ff]">Teacher 1</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedModels.gpt4o}
                      onChange={(e) => setSelectedModels({ ...selectedModels, gpt4o: e.target.checked })}
                      className="accent-[#4edea3]"
                    />
                    <span className="text-[#dfe2ee]">GPT-4o</span>
                  </div>
                  <span className="text-[0.625rem] text-[#4edea3]">Teacher 2</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedModels.deepseek}
                      onChange={(e) => setSelectedModels({ ...selectedModels, deepseek: e.target.checked })}
                      className="accent-[#c7c4d7]"
                    />
                    <span className="text-[#908fa0]">DeepSeek V3</span>
                  </div>
                  <span className="text-[0.625rem] text-[#908fa0]">Challenger</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Temperature:</span>
                <span className="text-[#dfe2ee] font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#8083ff]"
              />

              <div className="flex justify-between pt-1">
                <span className="text-[#908fa0]">Max Tokens:</span>
                <span className="text-[#dfe2ee] font-bold">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="128"
                max="2048"
                step="64"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-[#8083ff]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Model Outputs Comparison Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[1.25rem]">view_column</span>
            <h2 className="font-semibold text-base text-[#dfe2ee]">Parallel Model Responses</h2>
            <span className="font-mono text-xs text-[#908fa0]">({modelOutputs.length} Models Mounted)</span>
          </div>
        </div>

        {/* Mobile Segmented Switcher (< md) */}
        <div className="flex md:hidden bg-[#181c24] p-1 rounded-xl border border-[#262a33] overflow-x-auto no-scrollbar gap-1">
          {modelOutputs.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setMobileActiveOutputIndex(idx)}
              type="button"
              className={`flex-1 min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
                mobileActiveOutputIndex === idx
                  ? 'bg-[#4cd7f6] text-[#001f26] font-bold shadow'
                  : 'text-[#908fa0] hover:text-[#dfe2ee]'
              }`}
            >
              <span>{item.modelName.split(' ')[0]}</span>
              {item.schemaValid ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Single Card Focus (< md) */}
        <div className="block md:hidden">
          {(() => {
            const item = modelOutputs[mobileActiveOutputIndex];
            if (!item) return null;
            return (
              <div className="bg-[#181c24] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
                  <span className="font-bold text-sm text-[#dfe2ee]">{item.modelName}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1c2028] text-[#908fa0]">
                    {item.role}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#908fa0] bg-[#0a0e16] px-3 py-1.5 rounded-lg">
                  <span>{item.latencyMs}ms</span>
                  <span>{item.tokens} tokens</span>
                  <span className={item.schemaValid ? 'text-[#4edea3] font-bold' : 'text-[#ffb4ab] font-bold'}>
                    {item.schemaValid ? 'Schema OK' : 'Schema Fail'}
                  </span>
                </div>

                {item.error && (
                  <div className="p-2 rounded bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffb4ab] font-mono text-xs">
                    {item.error}
                  </div>
                )}

                <div className="bg-[#0a0e16] p-3 rounded-lg font-mono text-xs max-h-60 overflow-x-auto overflow-y-auto border border-[#262a33]">
                  <pre className="text-[#c7c4d7] whitespace-pre-wrap">
                    <code>{item.output}</code>
                  </pre>
                </div>

                <button
                  onClick={() => handleSaveToRun(item)}
                  type="button"
                  className="w-full min-h-[44px] py-2.5 bg-[#262a33] hover:bg-[#8083ff]/30 text-[#c0c1ff] hover:text-white rounded-xl text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#31353e] active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                  <span>후보로 승격 (Save to Record)</span>
                </button>
              </div>
            );
          })()}
        </div>

        {/* Desktop Multi-column Grid (>= md) */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {modelOutputs.map((item) => (
            <div
              key={item.id}
              className="bg-[#181c24] rounded-xl p-3.5 border border-[#262a33] shadow-md flex flex-col justify-between hover:bg-[#1c2028] transition-all"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
                  <span className="font-bold text-xs text-[#dfe2ee]">{item.modelName}</span>
                  <span className="font-mono text-[0.625rem] px-1.5 py-0.5 rounded bg-[#1c2028] text-[#908fa0]">
                    {item.role}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#908fa0] bg-[#0a0e16] px-2 py-1 rounded">
                  <span>{item.latencyMs}ms</span>
                  <span>{item.tokens} tokens</span>
                  <span className={item.schemaValid ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}>
                    {item.schemaValid ? 'Schema OK' : 'Schema Fail'}
                  </span>
                </div>

                {item.error && (
                  <div className="p-1.5 rounded bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffb4ab] font-mono text-[0.6875rem]">
                    {item.error}
                  </div>
                )}

                <div className="bg-[#0a0e16] p-2.5 rounded font-mono text-xs max-h-56 overflow-y-auto border border-[#262a33]">
                  <pre className="text-[#c7c4d7] whitespace-pre-wrap">
                    <code>{item.output}</code>
                  </pre>
                </div>
              </div>

              <div className="pt-3 border-t border-[#262a33] mt-2">
                <button
                  onClick={() => handleSaveToRun(item)}
                  type="button"
                  className="w-full py-1.5 bg-[#262a33] hover:bg-[#8083ff]/30 text-[#c0c1ff] hover:text-white rounded text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1 border border-[#31353e]"
                >
                  <span className="material-symbols-outlined text-[1rem]">add_task</span>
                  <span>후보로 승격 (Save to Record)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
