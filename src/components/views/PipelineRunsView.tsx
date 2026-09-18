import React, { useState } from 'react';

export const PipelineRunsView: React.FC = () => {
  const [selectedLogRun, setSelectedLogRun] = useState('r-202503-491');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      {toastMsg && (
        <div className="fixed bottom-6 right-8 pointer-events-none transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-[#1c2028] border border-[#31353e] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4edea3] text-[1.5rem]">play_circle</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dfe2ee]">파이프라인 트리거</span>
              <span className="font-mono text-xs text-[#908fa0]">{toastMsg}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
        <div>
          <h1 className="text-lg font-bold text-[#dfe2ee] flex items-center gap-2">
            파이프라인 실행 엔진 (Pipeline Runs)
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3]">
              KUBERNETES EVAL CLUSTER
            </span>
          </h1>
          <p className="text-xs text-[#c7c4d7]">
            수천 건의 실운영 로그를 병렬 분산 노드에서 모델 추론 및 룰 검증하는 배치 파이프라인의 실시간 실행 상태입니다.
          </p>
        </div>

        <button
          onClick={() => showToast('신규 배치 파이프라인이 즉시 큐에 스케줄링되었습니다.')}
          className="px-4 py-2 bg-[#8083ff] hover:bg-[#686bff] text-[#0d0096] hover:text-white font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 shadow"
        >
          <span className="material-symbols-outlined text-[1.125rem]">play_arrow</span>
          <span>신규 파이프라인 트리거</span>
        </button>
      </div>

      {/* Runs Table */}
      <div className="bg-[#181c24] rounded-xl border border-[#262a33] overflow-hidden shadow-md">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#0a0e16] text-[#908fa0] uppercase text-[0.6875rem] border-b border-[#262a33]">
              <th className="p-3.5">Run ID</th>
              <th className="p-3.5">Target Batch</th>
              <th className="p-3.5">Stages</th>
              <th className="p-3.5">Processed</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Duration</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262a33]">
            <tr className="hover:bg-[#1c2028] transition-colors">
              <td className="p-3.5 font-bold text-[#4cd7f6]">r-202503-492</td>
              <td className="p-3.5 text-[#dfe2ee]">bch-202503a</td>
              <td className="p-3.5 text-[#4edea3]">Teacher Replay (71%)</td>
              <td className="p-3.5">28.4k / 40.0k</td>
              <td className="p-3.5">
                <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#03b5d3]/20 text-[#4cd7f6] font-bold">
                  RUNNING
                </span>
              </td>
              <td className="p-3.5 text-[#908fa0]">12m 40s</td>
              <td className="p-3.5 text-right">
                <button
                  onClick={() => setSelectedLogRun('r-202503-492')}
                  className="px-2 py-1 bg-[#262a33] hover:bg-[#31353e] rounded text-xs"
                >
                  Logs
                </button>
              </td>
            </tr>

            <tr className="hover:bg-[#1c2028] transition-colors bg-[#93000a]/10">
              <td className="p-3.5 font-bold text-[#ffb4ab]">r-202503-491</td>
              <td className="p-3.5 text-[#dfe2ee]">bch-202503a</td>
              <td className="p-3.5 text-[#ffb4ab]">Rules & Judge (Failed)</td>
              <td className="p-3.5">38.9k / 40.0k</td>
              <td className="p-3.5">
                <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#93000a] text-[#ffdad6] font-bold">
                  FAILED (OOM)
                </span>
              </td>
              <td className="p-3.5 text-[#908fa0]">3h ago</td>
              <td className="p-3.5 text-right space-x-1.5">
                <button
                  onClick={() => setSelectedLogRun('r-202503-491')}
                  className="px-2 py-1 bg-[#262a33] hover:bg-[#31353e] rounded text-xs text-[#ffb4ab]"
                >
                  Inspect Error
                </button>
                <button
                  onClick={() => showToast('r-202503-491 파드가 메모리 64GB로 재기동되었습니다.')}
                  className="px-2 py-1 bg-[#8083ff]/30 text-[#c0c1ff] rounded text-xs font-bold"
                >
                  재시도
                </button>
              </td>
            </tr>

            <tr className="hover:bg-[#1c2028] transition-colors">
              <td className="p-3.5 font-bold text-[#c0c1ff]">r-202503-488</td>
              <td className="p-3.5 text-[#dfe2ee]">bch-202503b</td>
              <td className="p-3.5 text-[#4edea3]">Review Queue Handoff</td>
              <td className="p-3.5">45.2k / 45.2k</td>
              <td className="p-3.5">
                <span className="px-2 py-0.5 rounded text-[0.625rem] bg-[#00885d]/30 text-[#4edea3] font-bold">
                  COMPLETED
                </span>
              </td>
              <td className="p-3.5 text-[#908fa0]">1d ago</td>
              <td className="p-3.5 text-right">
                <button
                  onClick={() => setSelectedLogRun('r-202503-488')}
                  className="px-2 py-1 bg-[#262a33] hover:bg-[#31353e] rounded text-xs"
                >
                  Logs
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pod Logs Terminal Console */}
      <div className="bg-[#0a0e16] rounded-xl p-4 border border-[#262a33] shadow-md flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
          <span className="font-mono text-xs font-bold text-[#4cd7f6]">
            Worker Pod Log Stream: {selectedLogRun} (node: worker-k8-04)
          </span>
          <span className="font-mono text-[0.6875rem] text-[#908fa0]">Live stdout/stderr tail</span>
        </div>

        <div className="font-mono text-xs text-[#c7c4d7] bg-black/50 p-3 rounded-lg max-h-48 overflow-y-auto leading-relaxed border border-[#262a33]">
          <div className="text-[#908fa0]">[2025-03-08 14:10:02 UTC] [INIT] Ingesting shard 14 of 32 from s3://gleo-telemetry/</div>
          <div className="text-[#4edea3]">[2025-03-08 14:10:05 UTC] [NORM] Batch normalization completed. WER: 0.0%, PII scrubbed: 4,821 tokens.</div>
          <div className="text-[#4cd7f6]">[2025-03-08 14:10:12 UTC] [TEACHER] Parallel replay dispatches to Claude 3.5 Sonnet & GPT-4o.</div>
          {selectedLogRun === 'r-202503-491' ? (
            <>
              <div className="text-[#ffb4ab] font-bold">[2025-03-08 14:10:45 UTC] [WARN] Memory footprint reached 94.2% on worker-k8-04.</div>
              <div className="text-[#ffb4ab] font-bold">[2025-03-08 14:11:00 UTC] [FATAL] OOMKilled: Process terminated with signal 9.</div>
            </>
          ) : (
            <div className="text-[#c0c1ff]">[2025-03-08 14:10:55 UTC] [EVAL] Current discrepancy rate calculated: 5.98% (886/14,820 records).</div>
          )}
        </div>
      </div>
    </div>
  );
};
