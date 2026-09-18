import React from 'react';

export const InfrastructureView: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#dfe2ee] flex flex-wrap items-center gap-2">
            <span>인프라 및 분산 노드 상태 (Infrastructure)</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3]">
              ALL SYSTEMS NOMINAL
            </span>
          </h1>
          <p className="text-xs text-[#c7c4d7] mt-1">
            제네시스/현대 커넥티드 카 텔레메트리 스트림 수집 Kafka 브로커, Redis 캐시, 분산 K8s 추론 워커 현황
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#908fa0]">Kafka Event Stream</span>
            <span className="text-[#4edea3] font-bold">Connected</span>
          </div>
          <div className="text-xl font-bold text-[#dfe2ee]">32 Partitions</div>
          <p className="text-[#908fa0] text-[0.6875rem] mt-1">Lag: 42 ms / Throughput: 142k msg/hr</p>
        </div>

        <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#908fa0]">Inference Worker Pods</span>
            <span className="text-[#4cd7f6] font-bold">48 Active</span>
          </div>
          <div className="text-xl font-bold text-[#dfe2ee]">G4dn.12xlarge</div>
          <p className="text-[#908fa0] text-[0.6875rem] mt-1">NVIDIA T4 GPUs x 48 (Cluster: ap-northeast-2)</p>
        </div>

        <div className="bg-[#181c24] p-4 rounded-xl border border-[#262a33]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#908fa0]">Vector & DB Cache</span>
            <span className="text-[#c0c1ff] font-bold">Qdrant + Redis</span>
          </div>
          <div className="text-xl font-bold text-[#dfe2ee]">4.8M Embeddings</div>
          <p className="text-[#908fa0] text-[0.6875rem] mt-1">Hit Rate: 96.4% / P99 Latency: 4ms</p>
        </div>
      </div>
    </div>
  );
};
