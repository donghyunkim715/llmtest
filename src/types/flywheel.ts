export type UserRole = 'admin' | 'developer' | 'labeler' | 'approver' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  avatarUrl: string;
}

export type PipelineStage = 'Router' | 'Planner' | 'Respgen' | 'GSI' | 'Aegis';

export type InsightType =
  | 'student_gap'
  | 'label_suspect'
  | 'teacher_split'
  | 'data_quality'
  | 'all_fail'
  | 'ok';

export interface ModelRubricScores {
  intentAccuracy: number; // 1 to 5
  toolPrecision: number; // 1 to 5
  parameterCompleteness: number; // 1 to 5
  naturalness: number; // 1 to 5
  overall?: number;
}

export interface AspectVotes {
  intent: 'A' | 'B' | 'C' | 'D';
  toolCalls: 'A' | 'B' | 'C' | 'D';
  parameters: 'A' | 'B' | 'C' | 'D';
  responseText: 'A' | 'B' | 'C' | 'D';
}

export interface InferenceCandidate {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  modelName: string;
  modelRole: 'production' | 'student' | 'teacher1' | 'teacher2' | 'challenger';
  latencyMs: number;
  tokens: number;
  judgeScore: number;
  schemaStatus: 'valid' | 'invalid' | 'warning';
  schemaPassRate?: string;
  validationErrorNote?: string;
  outputJson: string;
  explanation: string;
  isRecommended?: boolean;
  extractedIntents?: string[];
  naturalLanguageResponse?: string;
  thoughtProcess?: string;
  pros?: string[];
  cons?: string[];
  rubricScores?: ModelRubricScores;
  votesCount?: number;
}

export interface ReviewDecision {
  selectedCandidateId: 'A' | 'B' | 'C' | 'D';
  action: 'adopt' | 'fix' | 'drop' | 'escalate';
  editedPayload?: string;
  rationale: string;
  aspectVotes?: AspectVotes;
  candidateScores?: Record<'A' | 'B' | 'C' | 'D', ModelRubricScores>;
  reviewerId: string;
  reviewerName: string;
  reviewedAt: string;
}

export interface ApprovalDecision {
  status: 'approved' | 'returned';
  approverNote?: string;
  approverId: string;
  approverName: string;
  approvedAt: string;
}

export interface VehicleTelemetryContext {
  speedKmh: number;
  indoorTempC: number;
  windowsOpenPercent: number;
  passengerZones: string[];
  navCurrentDestination?: string;
  mediaStatus?: string;
}

export interface StageRecord {
  id: string;
  hash: string;
  carModel: string;
  clientVersion: string;
  systemPrompt: string;
  priorTurns: Array<{ role: 'user' | 'assistant'; text: string }>;
  currentTargetQuery: string;
  vehicleContext?: VehicleTelemetryContext;
  groundTruthExpectation?: string[];
  stage: PipelineStage;
  category: string;
  insightType: InsightType;
  insightLabel: string;
  blockingFlags: number;
  intentDensity: string;
  agreementRate: string;
  candidates: InferenceCandidate[];
  reviewDecision?: ReviewDecision;
  approvalDecision?: ApprovalDecision;
  runId: string;
  batchId: string;
}

export interface BatchManifest {
  id: string;
  manifestUri: string;
  sourceCluster: string;
  recordVolume: number;
  checksumStatus: 'SHA-256 VERIFIED' | 'MD5 MATCH' | 'SCHEMA FAIL';
  ingestState: 'Ready' | 'Completed' | 'Quarantined';
  lastPolled: string;
}

export interface AttentionItem {
  id: string;
  type: 'CRITICAL' | 'STALLED' | 'QUARANTINE' | 'APPROVAL' | 'REJECTED';
  badgeColor: string;
  age: string;
  count: number;
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  targetView: string;
}

export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';
export type MfaStatusType = 'FIDO2' | 'TOTP' | 'NONE';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarBg?: string;
  avatarTextColor?: string;
  role: 'ADMIN' | 'DEVELOPER' | 'APPROVER' | 'LABELER' | 'GUEST';
  team: string;
  weeklyPerformance: string;
  weeklyPerformanceSub?: string;
  mfaType: MfaStatusType;
  mfaLabel: string;
  lastActive: string;
  ipAddress: string;
  status: AccountStatus;
  statusLabel: string;
  isKeyMaster?: boolean;
}

export interface GovernanceAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  targetUser: string;
  detail: string;
  ticketNumber: string;
  hash: string;
}

