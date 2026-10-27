import type { Incident, AgentLogEntry } from './types';
import { Construction, Trash2, Lightbulb, Waves } from 'lucide-react';

// Verified Pexels image URLs for real-world municipal issues.
export const SAMPLE_INCIDENT_PHOTOS = {
  pothole:
    'https://images.pexels.com/photos/11849379/pexels-photo-11849379.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  garbage:
    'https://images.pexels.com/photos/39715324/pexels-photo-39715324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  streetlight:
    'https://images.pexels.com/photos/9953451/pexels-photo-9953451.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  sewage:
    'https://images.pexels.com/photos/31560723/pexels-photo-31560723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export const CATEGORY_PHOTO_MAP: Record<string, string> = {
  'Pothole/Roads': SAMPLE_INCIDENT_PHOTOS.pothole,
  'Sanitation/Garbage': SAMPLE_INCIDENT_PHOTOS.garbage,
  'Broken Streetlight': SAMPLE_INCIDENT_PHOTOS.streetlight,
  'Sewage Overflow': SAMPLE_INCIDENT_PHOTOS.sewage,
};

export const CATEGORY_DEPARTMENT: Record<string, string> = {
  'Pothole/Roads': 'PWD',
  'Sanitation/Garbage': 'Sanitation',
  'Broken Streetlight': 'Power',
  'Sewage Overflow': 'Water',
};

export const CATEGORY_ICON: Record<string, typeof MapPin> = {
  'Pothole/Roads': Construction,
  'Sanitation/Garbage': Trash2,
  'Broken Streetlight': Lightbulb,
  'Sewage Overflow': Waves,
};

const NOW = Date.now();
const HOUR = 3600_000;

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'CIV-104',
    title: 'Large pothole on GT Road near bus depot',
    category: 'Pothole/Roads',
    ward: 'Ward 3 - GT Road',
    description:
      'A deep pothole (~1.2m wide) on the GT Road carriageway near the intra-city bus depot has caused two minor two-wheeler accidents this week. Waterlogging from overnight rain is worsening the damage.',
    department: 'PWD',
    column: 'assigned',
    priority: 'Critical',
    agentStatus: 'Active',
    clusterId: 'CIV-104',
    clusterCount: 3,
    slaDeadline: NOW + 2 * HOUR + 14 * 60_000,
    slaTotalMs: 8 * HOUR,
    createdAt: NOW - 5 * HOUR + 46 * 60_000,
    photo: SAMPLE_INCIDENT_PHOTOS.pothole,
    geoTag: '28.6692°N, 77.4538°E',
    reportedBy: 'R. Mehta (Citizen)',
  },
  {
    id: 'CIV-101',
    title: 'Streetlight outage cluster — Sector 15 Block C',
    category: 'Broken Streetlight',
    ward: 'Ward 15 - Sector 15',
    description:
      'Four consecutive streetlight poles (C-12 to C-15) on Sector 15 Block C main avenue have been dark for 9 nights. Visibility near the children\'s park entrance is near zero after 8pm.',
    department: 'Power',
    column: 'assigned',
    priority: 'High',
    agentStatus: 'Active',
    clusterId: 'CIV-101',
    clusterCount: 2,
    slaDeadline: NOW + 9 * HOUR,
    slaTotalMs: 24 * HOUR,
    createdAt: NOW - 15 * HOUR,
    photo: SAMPLE_INCIDENT_PHOTOS.streetlight,
    geoTag: '28.7186°N, 77.2905°E',
    reportedBy: 'S. Kaur (Citizen)',
  },
  {
    id: 'CIV-089',
    title: 'Waste accumulation behind Model Town market',
    category: 'Sanitation/Garbage',
    ward: 'Ward 8 - Model Town',
    description:
      'Uncollected municipal solid waste (~3 tonnes estimate) has piled up behind the Model Town weekly market. Stray dogs and vectors reported; residents complaining of smell and risk of dengue outbreak.',
    department: 'Sanitation',
    column: 'escalated',
    priority: 'High',
    agentStatus: 'Alert',
    clusterId: 'CIV-089',
    clusterCount: 4,
    slaDeadline: NOW - 2 * HOUR, // already breached — drives escalation
    slaTotalMs: 18 * HOUR,
    createdAt: NOW - 20 * HOUR,
    photo: SAMPLE_INCIDENT_PHOTOS.garbage,
    geoTag: '28.7028°N, 77.1932°E',
    reportedBy: 'Municipal Sanitary Inspector',
  },
  {
    id: 'CIV-112',
    title: 'Sewage overflow outside Sector 14 main road gate',
    category: 'Sewage Overflow',
    ward: 'Ward 14 - Sector 14',
    description:
      'Manhole cover overflow at Sector 14 main gate intersection. Sewage is flowing across the carriageway for ~40m. Pedestrian crossing blocked; strong odour reported by shop owners.',
    department: 'Water',
    column: 'ingested',
    priority: 'Critical',
    agentStatus: 'Active',
    clusterId: 'CIV-112',
    clusterCount: 1,
    slaDeadline: NOW + 3 * HOUR + 20 * 60_000,
    slaTotalMs: 6 * HOUR,
    createdAt: NOW - 40 * 60_000,
    photo: SAMPLE_INCIDENT_PHOTOS.sewage,
    geoTag: '28.6139°N, 77.2090°E',
    reportedBy: 'CivicResolve App',
  },
  {
    id: 'CIV-107',
    title: 'Damaged road surface — Industrial Area approach',
    category: 'Pothole/Roads',
    ward: 'Ward 22 - Industrial Area',
    description:
      'Broken road surface / cratering on the industrial area approach road near truck loading bay 4. Heavy vehicle movement has worsened it; risk to two-wheelers and material trucks.',
    department: 'PWD',
    column: 'pending_verification',
    priority: 'Medium',
    agentStatus: 'Reviewing',
    clusterId: 'CIV-107',
    clusterCount: 2,
    slaDeadline: NOW + 30 * 60_000, // closing window — verification pending
    slaTotalMs: 48 * HOUR,
    createdAt: NOW - 47 * HOUR + 30 * 60_000,
    photo: SAMPLE_INCIDENT_PHOTOS.pothole,
    geoTag: '28.6517°N, 77.3825°E',
    reportedBy: 'P. Anand (Citizen)',
  },
];

export const INITIAL_LOGS: AgentLogEntry[] = [
  {
    id: 'log-1',
    agent: 'Triage Agent',
    message:
      'Extracted geotag (28.6139°N, 77.2090°E) and severity (Critical) from CIV-112. Routed to Water department.',
    timestamp: NOW - 38 * 60_000,
    level: 'info',
  },
  {
    id: 'log-2',
    agent: 'Duplicate Detector',
    message:
      'CIV-112 shares 200m radius with 0 existing reports. New cluster created.',
    timestamp: NOW - 37 * 60_000,
    level: 'success',
  },
  {
    id: 'log-3',
    agent: 'SLA Watchdog',
    message:
      'Ticket #CIV-089 (Sanitation) SLA expired 2h 03m ago. Penalty notice logged. Escalating to Zonal Officer.',
    timestamp: NOW - 30 * 60_000,
    level: 'error',
  },
  {
    id: 'log-4',
    agent: 'Auditor Agent',
    message:
      'CIV-107 closure evidence photo uploaded by contractor. Queued for visual inspection against original report.',
    timestamp: NOW - 12 * 60_000,
    level: 'info',
  },
];

// Seed log IDs for stable uniqueness
let logSeq = 100;
export function nextLogId() {
  logSeq += 1;
  return `log-${logSeq}`;
}

let incSeq = 200;
export function nextIncidentId() {
  incSeq += 1;
  return `CIV-${incSeq}`;
}

export const COLUMNS: { key: import('./types').ColumnKey; label: string; accent: string }[] = [
  { key: 'ingested', label: 'Ingested & Clustered', accent: 'text-ink-300' },
  { key: 'assigned', label: 'Assigned to Department', accent: 'text-emerald-glow' },
  { key: 'pending_verification', label: 'Pending Verification', accent: 'text-amber-glow' },
  { key: 'escalated', label: 'Escalated / Reopened', accent: 'text-priority-critical' },
  { key: 'closed', label: 'Verified Closed', accent: 'text-emerald-glow' },
];

export const DEPARTMENT_COLOR: Record<string, string> = {
  PWD: 'text-amber-glow border-amber/40',
  Sanitation: 'text-emerald-glow border-emerald/40',
  Power: 'text-ink-100 border-ink-500',
  Water: 'text-blue-300 border-blue-500/40',
};

export const PRIORITY_COLOR: Record<string, string> = {
  Critical: 'bg-priority-critical/20 text-priority-critical border-priority-critical/40',
  High: 'bg-priority-high/20 text-priority-high border-priority-high/40',
  Medium: 'bg-priority-medium/20 text-priority-medium border-priority-medium/40',
  Low: 'bg-priority-low/20 text-priority-low border-priority-low/40',
};

export const AGENT_STATUS_COLOR: Record<string, string> = {
  Active: 'bg-emerald/20 text-emerald-glow',
  Idle: 'bg-ink-700/60 text-ink-300',
  Alert: 'bg-priority-critical/20 text-priority-critical',
  Reviewing: 'bg-amber/20 text-amber-glow',
};

export const AGENT_LOG_LEVEL_COLOR: Record<string, string> = {
  info: 'text-blue-300',
  warn: 'text-amber-glow',
  error: 'text-priority-critical',
  success: 'text-emerald-glow',
};

export const AGENT_LOG_LEVEL_TAG: Record<string, string> = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERR ',
  success: ' OK ',
};
