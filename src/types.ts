export type Category = 'Pothole/Roads' | 'Sanitation/Garbage' | 'Broken Streetlight' | 'Sewage Overflow';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Department = 'PWD' | 'Sanitation' | 'Power' | 'Water';

export type Ward =
  | 'Ward 14 - Sector 14'
  | 'Ward 15 - Sector 15'
  | 'Ward 8 - Model Town'
  | 'Ward 3 - GT Road'
  | 'Ward 22 - Industrial Area'
  | 'Ward 11 - Civil Lines';

export type AgentStatus = 'Active' | 'Idle' | 'Alert' | 'Reviewing';

export type ColumnKey =
  | 'ingested'
  | 'assigned'
  | 'pending_verification'
  | 'escalated'
  | 'closed';

export interface Incident {
  id: string;
  title: string;
  category: Category;
  ward: Ward;
  description: string;
  department: Department;
  column: ColumnKey;
  priority: Priority;
  agentStatus: AgentStatus;
  clusterId?: string;
  clusterCount: number;
  // SLA deadline as epoch ms
  slaDeadline: number;
  slaTotalMs: number;
  createdAt: number;
  photo: string;
  geoTag: string;
  reportedBy: string;
}

export interface AgentLogEntry {
  id: string;
  agent: AgentName;
  message: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'success';
}

export type AgentName =
  | 'Triage Agent'
  | 'SLA Watchdog'
  | 'Auditor Agent'
  | 'Duplicate Detector'
  | 'Coordinator';

export type ViewKey = 'portal' | 'command' | 'agents';
