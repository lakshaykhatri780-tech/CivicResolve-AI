import { useCallback, useEffect, useState } from 'react';
import type { AgentLogEntry, AgentName, ColumnKey, Incident } from '../types';
import {
  INITIAL_INCIDENTS, INITIAL_LOGS, CATEGORY_DEPARTMENT, CATEGORY_PHOTO_MAP,
  nextIncidentId, nextLogId,
} from '../mockData';

const toastSeqRef = { current: 0 };

export interface Toast {
  id: number;
  title: string;
  body: string;
  tone: 'info' | 'success' | 'error' | 'warn';
}

function computeMetrics(incidents: Incident[]) {
  const m = {
    totalReported: incidents.length,
    autoTriaged: 0,
    missedSlas: 0,
    autoEscalated: 0,
    verifiedResolved: 0,
  };
  for (const i of incidents) {
    if (i.column !== 'ingested') m.autoTriaged += 1;
    if (i.slaDeadline < Date.now() && i.column !== 'closed' && i.column !== 'escalated') m.missedSlas += 1;
    if (i.column === 'escalated') {
      m.autoEscalated += 1;
      m.missedSlas += 1;
    }
    if (i.column === 'closed') m.verifiedResolved += 1;
  }
  return m;
}

export function useAgentEngine() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [logs, setLogs] = useState<AgentLogEntry[]>(INITIAL_LOGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [alarmPulseId, setAlarmPulseId] = useState<string | null>(null);
  // Live ticking every second so SLA countdowns stay accurate.
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const pushLog = useCallback(
    (agent: AgentName, message: string, level: AgentLogEntry['level'] = 'info') => {
      setLogs((prev) => {
        const next: AgentLogEntry = {
          id: nextLogId(),
          agent,
          message,
          timestamp: Date.now(),
          level,
        };
        return [...prev.slice(-199), next];
      });
    },
    [],
  );

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastSeqRef.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 6000);
  }, []);

  const clearAlarm = useCallback(() => setAlarmPulseId(null), []);

  // ---------- Trigger A: Duplicate report ----------
  const triggerDuplicate = useCallback(() => {
    const id = nextIncidentId();
    const target = incidents.find((i) => i.id === 'CIV-104')!;
    const newInc: Incident = {
      id,
      title: 'Pothole on Sector 14 main road (near gate 2)',
      category: 'Pothole/Roads',
      ward: 'Ward 14 - Sector 14',
      description:
        'Citizen reports a pothole on Sector 14 main road, ~150m from CIV-104 cluster centroid.',
      department: 'PWD',
      column: 'ingested',
      priority: 'High',
      agentStatus: 'Active',
      clusterId: 'CIV-104',
      clusterCount: 1,
      slaDeadline: Date.now() + 8 * 3600_000,
      slaTotalMs: 8 * 3600_000,
      createdAt: Date.now(),
      photo: CATEGORY_PHOTO_MAP['Pothole/Roads'],
      geoTag: '28.6145°N, 77.2098°E',
      reportedBy: 'CivicResolve App',
    };

    setIncidents((prev) => {
      const withNew = [...prev, newInc];
      // Merge into CIV-104 cluster, bump cluster count, keep CIV-104 as master.
      return withNew.map((i) =>
        i.id === 'CIV-104'
          ? { ...i, clusterCount: i.clusterCount + 1 }
          : i,
      );
    });

    pushLog(
      'Duplicate Detector',
      `New report ${id} ("Pothole on Sector 14 main road") located 138m from cluster CIV-104 centroid. Semantic similarity 0.91. Merging under Master Incident #CIV-104. Cluster size now ${(target.clusterCount || 3) + 1}.`,
      'success',
    );
    pushLog(
      'Triage Agent',
      `${id} auto-routed to PWD (matched master category). Priority inherited: High.`,
    );
    pushToast({
      title: 'Duplicate detected & merged',
      body: `${id} clustered under Master Incident #CIV-104. Cluster size now ${(target.clusterCount || 3) + 1}.`,
      tone: 'success',
    });
  }, [incidents, pushLog, pushToast]);

  // ---------- Trigger B: SLA breach ----------
  const triggerSlaBreach = useCallback(() => {
    // pick an active ticket with the most urgent deadline that isn't already escalated/closed
    const candidates = incidents.filter(
      (i) => i.column !== 'escalated' && i.column !== 'closed',
    );
    if (candidates.length === 0) return;
    const target = candidates.reduce((a, b) =>
      a.slaDeadline < b.slaDeadline ? a : b,
    );

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === target.id
          ? {
              ...i,
              slaDeadline: Date.now() - 1000,
              column: 'escalated',
              priority: 'Critical',
              agentStatus: 'Alert',
            }
          : i,
      ),
    );
    setAlarmPulseId(target.id);

    pushLog(
      'SLA Watchdog',
      `Deadline expired for Ticket #${target.id} (${target.department}). Auto-escalating to Zonal Officer and raising priority to P1 (Critical). Penalty notice logged.`,
      'error',
    );
    pushLog(
      'Coordinator',
      `Escalation chain started for ${target.id}: Zonal Officer → Municipal Commissioner. SMS + email dispatched to assigned contractor.`,
      'warn',
    );
    pushToast({
      title: 'SLA breach triggered',
      body: `Ticket #${target.id} moved to Escalated / Reopened. Alarm pulse active.`,
      tone: 'error',
    });
  }, [incidents, pushLog, pushToast]);

  // ---------- Trigger C: Contradictory closure report ----------
  const triggerContradictoryClosure = useCallback(() => {
    // prefer a pending_verification ticket; otherwise pick an assigned one
    let target = incidents.find((i) => i.column === 'pending_verification');
    if (!target) target = incidents.find((i) => i.column === 'assigned');
    if (!target) return;

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === target!.id
          ? {
              ...i,
              column: 'escalated',
              agentStatus: 'Alert',
              priority: 'High',
            }
          : i,
      ),
    );

    pushLog(
      'Auditor Agent',
      `Comparing contractor's repair photo for #${target.id} against original report using vision analysis. Match score: 24% (Inconclusive/Contradictory). Detected: "Debris still present, road surface not levelled." Rejecting closure. Reopening case.`,
      'error',
    );
    pushLog(
      'Auditor Agent',
      `Supervisor notified for ${target.id}. Contractor flagged for re-inspection. SLA clock restarted with 6h bonus window.`,
      'warn',
    );
    pushToast({
      title: 'Closure rejected',
      body: `#${target.id}: vision analysis 24% match. Debris still present. Case reopened.`,
      tone: 'warn',
    });
  }, [incidents, pushLog, pushToast]);

  // ---------- Citizen submission ----------
  const submitReport = useCallback(
    (data: {
      title: string;
      category: string;
      ward: string;
      description: string;
      photo: string;
    }) => {
      const id = nextIncidentId();
      const department = CATEGORY_DEPARTMENT[data.category] || 'PWD';
      const slaHours =
        data.category === 'Sewage Overflow' ? 6 :
        data.category === 'Pothole/Roads' ? 8 :
        data.category === 'Broken Streetlight' ? 24 : 18;

      // duplicate detection: look for a similar incident within 200m (mocked by ward+category)
      const duplicate = incidents.find(
        (i) =>
          i.ward === data.ward &&
          i.category === data.category &&
          i.column !== 'closed' &&
          i.column !== 'escalated',
      );

      const newInc: Incident = {
        id,
        title: data.title,
        category: data.category as Incident['category'],
        ward: data.ward as Incident['ward'],
        description: data.description,
        department: department as Incident['department'],
        column: 'ingested',
        priority: 'Medium',
        agentStatus: 'Active',
        clusterId: duplicate ? duplicate.clusterId : id,
        clusterCount: 1,
        slaDeadline: Date.now() + slaHours * 3600_000,
        slaTotalMs: slaHours * 3600_000,
        createdAt: Date.now(),
        photo: data.photo,
        geoTag: '28.6200°N, 77.2300°E',
        reportedBy: 'CivicResolve App',
      };

      setIncidents((prev) => {
        const withNew = [...prev, newInc];
        if (duplicate) {
          return withNew.map((i) =>
            i.clusterId === duplicate.clusterId && i.id === duplicate.clusterId
              ? { ...i, clusterCount: i.clusterCount + 1 }
              : i,
          );
        }
        return withNew;
      });

      pushLog(
        'Triage Agent',
        `New report ${id} received. Extracted geotag and severity. Category: ${data.category}. Routed to ${department} department.`,
      );
      if (duplicate) {
        pushLog(
          'Duplicate Detector',
          `${id} matched existing cluster #${duplicate.clusterId} in 200m radius (same ward + category). Merging under Master Incident #${duplicate.clusterId}. Cluster size now ${duplicate.clusterCount + 1}.`,
          'success',
        );
        pushToast({
          title: 'Similar report detected',
          body: `${id} clustered under Master Incident #${duplicate.clusterId}. Cluster size now ${duplicate.clusterCount + 1}.`,
          tone: 'success',
        });
      } else {
        pushLog(
          'Duplicate Detector',
          `${id} has no neighbours in 200m radius. New cluster created.`,
          'success',
        );
      }

      // simulated auto-triage: move from ingested -> assigned after 1.6s
      setTimeout(() => {
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === id
              ? { ...i, column: 'assigned', agentStatus: 'Active' }
              : i,
          ),
        );
        pushLog(
          'Triage Agent',
          `${id} auto-triage complete. Assigned to ${department}. SLA clock started (${slaHours}h window).`,
        );
      }, 1600);

      return { id, duplicateCluster: duplicate?.clusterId ?? null };
    },
    [incidents, pushLog, pushToast],
  );

  // ---------- Background SLA watchdog (every 5s, checks for natural breaches) ----------
  useEffect(() => {
    const t = setInterval(() => {
      setIncidents((prev) => {
        let changed = false;
        const next = prev.map((i) => {
          if (
            i.slaDeadline < Date.now() &&
            i.column !== 'escalated' &&
            i.column !== 'closed'
          ) {
            changed = true;
            return { ...i, column: 'escalated' as ColumnKey, priority: 'Critical' as const, agentStatus: 'Alert' as const };
          }
          return i;
        });
        if (changed) {
          const breached = prev.filter(
            (i) =>
              i.slaDeadline < Date.now() &&
              i.column !== 'escalated' &&
              i.column !== 'closed',
          );
          breached.forEach((b) => {
            pushLog(
              'SLA Watchdog',
              `Ticket #${b.id} (${b.department}) SLA expired. Auto-escalating to Zonal Officer.`,
              'error',
            );
            setAlarmPulseId(b.id);
          });
        }
        return changed ? next : prev;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [pushLog]);

  const metrics = computeMetrics(incidents);

  return {
    incidents,
    logs,
    metrics,
    toasts,
    alarmPulseId,
    clearAlarm,
    triggerDuplicate,
    triggerSlaBreach,
    triggerContradictoryClosure,
    submitReport,
    pushLog,
    pushToast,
  };
}
