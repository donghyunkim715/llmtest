import React, { useState } from 'react';
import { UserProfile, StageRecord, BatchManifest, AspectVotes, ModelRubricScores } from './types/flywheel';
import { INITIAL_USERS, INITIAL_RECORDS, INITIAL_BATCHES } from './data/mockFlywheelData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { LabelingWorkbenchView } from './components/views/LabelingWorkbenchView';
import { ApprovalWorkbenchView } from './components/views/ApprovalWorkbenchView';
import { InsightsView } from './components/views/InsightsView';
import { EvalPlaygroundView } from './components/views/EvalPlaygroundView';
import { BatchesView } from './components/views/BatchesView';
import { RecordExplorerView } from './components/views/RecordExplorerView';
import { DatasetsHandoffView } from './components/views/DatasetsHandoffView';
import { PipelineRunsView } from './components/views/PipelineRunsView';
import { InfrastructureView } from './components/views/InfrastructureView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Dr. Elena Vance
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [records, setRecords] = useState<StageRecord[]>(INITIAL_RECORDS);
  const [batches, setBatches] = useState<BatchManifest[]>(INITIAL_BATCHES);
  const [currentRecordIndex, setCurrentRecordIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playgroundRecord, setPlaygroundRecord] = useState<StageRecord>(INITIAL_RECORDS[0]);

  // Handle saving 1st stage review verdict (Labeling)
  const handleSaveVerdict = (
    recordId: string,
    selectedCandidateId: 'A' | 'B' | 'C' | 'D',
    action: 'adopt' | 'fix' | 'drop' | 'escalate',
    rationale: string,
    editedPayload?: string,
    aspectVotes?: AspectVotes,
    candidateScores?: Record<'A' | 'B' | 'C' | 'D', ModelRubricScores>
  ) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          // Increment vote count for selected candidate
          const updatedCandidates = r.candidates.map((cand) => {
            if (cand.id === selectedCandidateId) {
              return {
                ...cand,
                votesCount: (cand.votesCount || 0) + 1,
                rubricScores: candidateScores?.[cand.id] || cand.rubricScores,
              };
            }
            if (candidateScores?.[cand.id]) {
              return {
                ...cand,
                rubricScores: candidateScores[cand.id],
              };
            }
            return cand;
          });

          return {
            ...r,
            candidates: updatedCandidates,
            reviewDecision: {
              selectedCandidateId,
              action,
              rationale,
              editedPayload,
              aspectVotes,
              candidateScores,
              reviewerId: currentUser.id,
              reviewerName: currentUser.name,
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          };
        }
        return r;
      })
    );
  };

  // Handle 2nd stage approval sign-off
  const handleApproveRecord = (recordId: string, note?: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            approvalDecision: {
              status: 'approved',
              approverNote: note,
              approverId: currentUser.id,
              approverName: currentUser.name,
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          };
        }
        return r;
      })
    );
  };

  // Handle 2nd stage return to 1st review
  const handleReturnRecord = (recordId: string, note: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            approvalDecision: {
              status: 'returned',
              approverNote: note,
              approverId: currentUser.id,
              approverName: currentUser.name,
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          };
        }
        return r;
      })
    );
  };

  const handleAddNewBatch = (newBatch: BatchManifest) => {
    setBatches((prev) => [newBatch, ...prev]);
  };

  const handleOpenInPlayground = (record: StageRecord) => {
    setPlaygroundRecord(record);
    setActiveTab('playground');
  };

  const handleSelectRecordForReview = (index: number) => {
    setCurrentRecordIndex(index);
    setActiveTab('reviews-labeling');
  };

  const handleNavigateToLabelingWithFilter = (stage: string, category: string) => {
    const foundIdx = records.findIndex(
      (r) => r.stage.toLowerCase() === stage.toLowerCase() && r.category.toLowerCase().includes(category.toLowerCase())
    );
    if (foundIdx >= 0) {
      setCurrentRecordIndex(foundIdx);
    }
    setActiveTab('reviews-labeling');
  };

  // Badges calculations
  const unassignedReviewCount = records.filter((r) => !r.reviewDecision).length;
  const pendingApprovalCount = records.filter((r) => r.reviewDecision && !r.approvalDecision).length;

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] font-sans flex antialiased selection:bg-[#8083ff] selection:text-[#0d0096]">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unassignedReviewCount={unassignedReviewCount}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Fixed Top Header */}
        <Header
          currentUser={currentUser}
          onSwitchUser={setCurrentUser}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'records') {
              setActiveTab('records');
            }
          }}
          onNavigateTab={setActiveTab}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              batches={batches}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'reviews-labeling' && (
            <LabelingWorkbenchView
              records={records}
              currentRecordIndex={currentRecordIndex}
              onSelectRecordIndex={setCurrentRecordIndex}
              currentUser={currentUser}
              onSaveVerdict={handleSaveVerdict}
              onOpenInPlayground={handleOpenInPlayground}
            />
          )}

          {activeTab === 'reviews-approval' && (
            <ApprovalWorkbenchView
              records={records}
              currentUser={currentUser}
              onApproveRecord={handleApproveRecord}
              onReturnRecord={handleReturnRecord}
              onSelectRecordForReview={handleSelectRecordForReview}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView
              onNavigateToLabelingWithFilter={handleNavigateToLabelingWithFilter}
            />
          )}

          {activeTab === 'playground' && (
            <EvalPlaygroundView
              initialRecord={playgroundRecord}
              onSaveAsCandidate={(recordId, payload, modelName) => {
                setRecords((prev) =>
                  prev.map((r) => {
                    if (r.id === recordId) {
                      return {
                        ...r,
                        candidates: [
                          ...r.candidates,
                          {
                            id: 'D',
                            label: `Playground ${modelName}`,
                            modelName,
                            modelRole: 'challenger',
                            latencyMs: 320,
                            tokens: 280,
                            judgeScore: 92,
                            schemaStatus: 'valid',
                            outputJson: payload,
                            explanation: 'Eval Playground에서 직접 시뮬레이션 및 추가된 후보.',
                          },
                        ],
                      };
                    }
                    return r;
                  })
                );
              }}
            />
          )}

          {activeTab === 'batches' && (
            <BatchesView batches={batches} onAddNewBatch={handleAddNewBatch} />
          )}

          {activeTab === 'records' && (
            <RecordExplorerView
              records={records}
              onSelectRecordForReview={handleSelectRecordForReview}
              onOpenInPlayground={handleOpenInPlayground}
            />
          )}

          {activeTab === 'pipeline-runs' && <PipelineRunsView />}

          {activeTab === 'datasets' && <DatasetsHandoffView records={records} />}

          {activeTab === 'infrastructure' && <InfrastructureView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
