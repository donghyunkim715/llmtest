import React, { useState } from 'react';
import { BatchManifest } from '../../types/flywheel';

interface BatchesViewProps {
  batches: BatchManifest[];
  onAddNewBatch: (batch: BatchManifest) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({ batches, onAddNewBatch }) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [manifestUri, setManifestUri] = useState('s3://gleo-telemetry/2025-w12.manifest');
  const [sourceCluster, setSourceCluster] = useState('AWS ap-northeast-2 (Seoul)');
  const [volume, setVolume] = useState(85000);

  const handleImportSubmit = () => {
    const newBatch: BatchManifest = {
      id: `bch-202503-${Math.floor(10 + Math.random() * 90)}`,
      manifestUri,
      sourceCluster,
      recordVolume: volume,
      checksumStatus: 'SHA-256 VERIFIED',
      ingestState: 'Ready',
      lastPolled: 'Just now',
    };
    onAddNewBatch(newBatch);
    setIsImportModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-[#dfe2ee]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181c24] p-4 rounded-xl border border-[#262a33] shadow-md">
        <div>
          <h1 className="text-lg font-bold text-[#dfe2ee] flex flex-wrap items-center gap-2">
            <span>배치 매니페스트 관리 (Batches & Deploy)</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6]">
              TELEMETRY INGESTION
            </span>
          </h1>
          <p className="text-xs text-[#c7c4d7] mt-1">
            실운영 제네시스/현대 커넥티드 카 텔레메트리 클러스터로부터 전송되는 로그 배치를 관리하고 파이프라인에 주입합니다.
          </p>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="min-h-[44px] px-4 py-2 bg-[#4cd7f6] hover:bg-[#03b5d3] text-[#001f26] font-bold rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[1.125rem]">upload_file</span>
          <span>신규 로그 배치 임포트</span>
        </button>
      </div>

      {/* Batches Mobile Cards (< sm) */}
      <div className="flex sm:hidden flex-col gap-3">
        {batches.map((b) => (
          <div key={b.id} className="bg-[#181c24] p-3.5 rounded-xl border border-[#262a33] shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#4cd7f6]">{b.id}</span>
              <span
                className={`px-2 py-0.5 rounded text-[0.625rem] font-bold ${
                  b.ingestState === 'Ready'
                    ? 'bg-[#00885d]/30 text-[#4edea3]'
                    : b.ingestState === 'Completed'
                    ? 'bg-[#262a33] text-[#908fa0]'
                    : 'bg-[#93000a]/40 text-[#ffb4ab]'
                }`}
              >
                {b.ingestState}
              </span>
            </div>

            <div className="text-xs text-[#dfe2ee] font-mono truncate">{b.manifestUri}</div>

            <div className="flex items-center justify-between text-[0.6875rem] font-mono text-[#908fa0] pt-1 border-t border-[#262a33]">
              <span>{b.sourceCluster}</span>
              <span className="font-bold text-[#dfe2ee]">{b.recordVolume.toLocaleString()} recs</span>
            </div>

            <div className="flex items-center justify-between text-[0.6875rem] font-mono text-[#908fa0]">
              <span
                className={`px-1.5 py-0.5 rounded text-[0.625rem] font-bold ${
                  b.checksumStatus === 'SHA-256 VERIFIED'
                    ? 'bg-[#00885d]/30 text-[#4edea3]'
                    : b.checksumStatus === 'MD5 MATCH'
                    ? 'bg-[#03b5d3]/20 text-[#4cd7f6]'
                    : 'bg-[#93000a]/30 text-[#ffb4ab]'
                }`}
              >
                {b.checksumStatus}
              </span>
              <span>{b.lastPolled}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Batches Table (>= sm) */}
      <div className="hidden sm:block bg-[#181c24] rounded-xl border border-[#262a33] overflow-x-auto no-scrollbar shadow-md">
        <table className="w-full text-left font-mono text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#0a0e16] text-[#908fa0] uppercase text-[0.6875rem] border-b border-[#262a33]">
              <th className="p-3.5">Batch ID</th>
              <th className="p-3.5">Manifest URI</th>
              <th className="p-3.5">Source Cluster</th>
              <th className="p-3.5 text-right">Volume</th>
              <th className="p-3.5">Checksum</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Polled</th>
              <th className="p-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262a33]">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-[#1c2028] transition-colors">
                <td className="p-3.5 font-bold text-[#4cd7f6]">{b.id}</td>
                <td className="p-3.5 text-[#dfe2ee]">{b.manifestUri}</td>
                <td className="p-3.5 text-[#c7c4d7]">{b.sourceCluster}</td>
                <td className="p-3.5 text-right font-bold text-[#dfe2ee]">{b.recordVolume.toLocaleString()} recs</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[0.625rem] font-bold ${
                      b.checksumStatus === 'SHA-256 VERIFIED'
                        ? 'bg-[#00885d]/30 text-[#4edea3]'
                        : b.checksumStatus === 'MD5 MATCH'
                        ? 'bg-[#03b5d3]/20 text-[#4cd7f6]'
                        : 'bg-[#93000a]/30 text-[#ffb4ab]'
                    }`}
                  >
                    {b.checksumStatus}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[0.625rem] font-bold ${
                      b.ingestState === 'Ready'
                        ? 'bg-[#00885d]/30 text-[#4edea3]'
                        : b.ingestState === 'Completed'
                        ? 'bg-[#262a33] text-[#908fa0]'
                        : 'bg-[#93000a]/40 text-[#ffb4ab]'
                    }`}
                  >
                    {b.ingestState}
                  </span>
                </td>
                <td className="p-3.5 text-[#908fa0]">{b.lastPolled}</td>
                <td className="p-3.5 text-center">
                  <button className="px-2.5 py-1 bg-[#262a33] hover:bg-[#8083ff]/30 text-[#c0c1ff] rounded text-[0.6875rem]">
                    파이프라인 실행
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#181c24] border-t sm:border border-[#31353e] rounded-t-2xl sm:rounded-xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <span className="font-bold text-sm text-[#dfe2ee]">신규 실운영 텔레메트리 배치 주입</span>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-[#908fa0] hover:text-white material-symbols-outlined"
                type="button"
              >
                close
              </button>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[#908fa0] block mb-1">Manifest S3/GCS URI</label>
                <input
                  type="text"
                  value={manifestUri}
                  onChange={(e) => setManifestUri(e.target.value)}
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] p-2 rounded-lg border border-[#262a33]"
                />
              </div>
              <div>
                <label className="text-[#908fa0] block mb-1">Source Cluster</label>
                <input
                  type="text"
                  value={sourceCluster}
                  onChange={(e) => setSourceCluster(e.target.value)}
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] p-2 rounded-lg border border-[#262a33]"
                />
              </div>
              <div>
                <label className="text-[#908fa0] block mb-1">Estimated Records Volume</label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full bg-[#0a0e16] text-[#dfe2ee] p-2 rounded-lg border border-[#262a33]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="min-h-[40px] px-4 py-2 bg-[#262a33] hover:bg-[#31353e] rounded-lg text-xs text-[#dfe2ee]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="min-h-[40px] px-5 py-2 bg-[#4cd7f6] hover:bg-[#38c9ea] text-[#001f26] font-bold rounded-lg text-xs active:scale-95 transition-transform"
              >
                배치 등록 및 인제스트
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
