import {
  Inbox, Activity, AlertOctagon, TrendingUp, ShieldCheck,
  Filter, RefreshCw,
} from 'lucide-react';
import type { Incident } from '../types';
import { COLUMNS } from '../mockData';
import { StatTile } from './Badges';
import { IncidentCard } from './IncidentCard';

export function CommandCenter({
  incidents, metrics, alarmPulseId, onAckAlarm,
}: {
  incidents: Incident[];
  metrics: {
    totalReported: number;
    autoTriaged: number;
    missedSlas: number;
    autoEscalated: number;
    verifiedResolved: number;
  };
  alarmPulseId: string | null;
  onAckAlarm: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink-100">Municipal Command Center</h2>
          <p className="text-sm text-ink-400">
            Real-time triage, assignment, and SLA enforcement across all departments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850/60 px-3 py-1.5 text-xs font-medium text-ink-300 hover:bg-ink-800">
            <Filter className="h-3.5 w-3.5" /> All Departments
          </button>
          <span className="flex items-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-glow">
            <RefreshCw className="h-3 w-3 animate-spin [animation-duration:3s]" />
            Live feed
          </span>
        </div>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile
          label="Total Reported"
          value={metrics.totalReported}
          tone="default"
          icon={<Inbox className="h-5 w-5" />}
        />
        <StatTile
          label="Auto-Triaged"
          value={metrics.autoTriaged}
          tone="emerald"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatTile
          label="Missed SLAs"
          value={metrics.missedSlas}
          tone="red"
          icon={<AlertOctagon className="h-5 w-5" />}
        />
        <StatTile
          label="Auto-Escalated"
          value={metrics.autoEscalated}
          tone="amber"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatTile
          label="Verified Resolved"
          value={metrics.verifiedResolved}
          tone="emerald"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      {/* Kanban */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {COLUMNS.map((col) => {
          const items = incidents.filter((i) => i.column === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col rounded-2xl border border-ink-700/70 bg-ink-900/40"
            >
              <div className="flex items-center justify-between border-b border-ink-700/60 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      col.key === 'escalated'
                        ? 'bg-priority-critical'
                        : col.key === 'closed'
                          ? 'bg-emerald-glow'
                          : col.key === 'pending_verification'
                            ? 'bg-amber-glow'
                            : col.key === 'assigned'
                              ? 'bg-emerald'
                              : 'bg-ink-400'
                    }`}
                  />
                  <h3 className={`text-[11px] font-bold uppercase tracking-wider ${col.accent}`}>
                    {col.label}
                  </h3>
                </div>
                <span className="rounded-md bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-ink-300">
                  {items.length}
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-2" style={{ maxHeight: '70vh' }}>
                {items.length === 0 ? (
                  <div className="grid place-items-center rounded-lg border border-dashed border-ink-700/50 py-8 text-center">
                    <p className="text-[11px] text-ink-400">No incidents</p>
                  </div>
                ) : (
                  items.map((inc) => (
                    <IncidentCard
                      key={inc.id}
                      incident={inc}
                      alarmActive={alarmPulseId === inc.id}
                      onAckAlarm={onAckAlarm}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
