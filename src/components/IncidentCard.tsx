import { useEffect, useState } from 'react';
import { Clock, MapPin, Layers, User, Bell } from 'lucide-react';
import type { Incident } from '../types';
import { CATEGORY_ICON } from '../mockData';
import { formatClock } from '../utils/format';
import { PriorityBadge, DeptBadge, AgentStatusBadge } from './Badges';

export function IncidentCard({
  incident, alarmActive, onAckAlarm,
}: {
  incident: Incident;
  alarmActive: boolean;
  onAckAlarm: () => void;
}) {
  const Icon = CATEGORY_ICON[incident.category];
  const remaining = incident.slaDeadline - Date.now();
  const isBreached = remaining <= 0 && incident.column !== 'closed';
  const totalPct = Math.max(0, Math.min(100, (remaining / incident.slaTotalMs) * 100));

  // smooth countdown
  const [display, setDisplay] = useState(formatClock(remaining));
  useEffect(() => {
    const id = setInterval(() => setDisplay(formatClock(incident.slaDeadline - Date.now())), 1000);
    return () => clearInterval(id);
  }, [incident.slaDeadline]);

  const slaColor = isBreached
    ? 'text-priority-critical'
    : totalPct < 25
      ? 'text-amber-glow'
      : 'text-emerald-glow';

  const barColor = isBreached
    ? 'bg-priority-critical'
    : totalPct < 25
      ? 'bg-amber'
      : 'bg-emerald';

  return (
    <div
      className={`group relative rounded-xl border bg-ink-850/70 p-3 transition-all hover:-translate-y-0.5 hover:border-ink-600 ${
        alarmActive
          ? 'border-priority-critical/70 shadow-glow-red animate-pulse-ring'
          : 'border-ink-700'
      }`}
    >
      {/* header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink-800 text-emerald-glow">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold text-ink-100">{incident.id}</p>
            <p className="text-[10px] text-ink-400">{formatTimeShort(incident.createdAt)}</p>
          </div>
        </div>
        <PriorityBadge priority={incident.priority} />
      </div>

      {/* title */}
      <p className="mt-2 line-clamp-2 text-xs font-medium text-ink-100">
        {incident.title}
      </p>

      {/* meta */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className="inline-flex items-center gap-1 rounded-md bg-ink-800 px-1.5 py-0.5 text-ink-300">
          <MapPin className="h-2.5 w-2.5" /> {incident.ward.replace('Ward ', 'W').replace(' - ', '·')}
        </span>
        <DeptBadge dept={incident.department} />
        {incident.clusterCount > 1 && (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald/10 px-1.5 py-0.5 font-mono text-emerald-glow">
            <Layers className="h-2.5 w-2.5" /> x{incident.clusterCount}
          </span>
        )}
      </div>

      {/* SLA timer */}
      <div className="mt-3 rounded-lg border border-ink-700/60 bg-ink-900/60 p-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-ink-400">
            <Clock className="h-3 w-3" /> SLA
          </span>
          <span className={`font-mono text-sm font-bold tabular-nums ${slaColor}`}>
            {isBreached ? 'BREACHED' : display}
            {!isBreached && <span className="ml-1 text-[9px] font-normal text-ink-400">remaining</span>}
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${isBreached ? 100 : totalPct}%` }}
          />
        </div>
      </div>

      {/* footer */}
      <div className="mt-2.5 flex items-center justify-between">
        <AgentStatusBadge status={incident.agentStatus} />
        <span className="flex items-center gap-1 text-[10px] text-ink-400">
          <User className="h-2.5 w-2.5" />
          {incident.reportedBy.length > 18 ? incident.reportedBy.slice(0, 16) + '…' : incident.reportedBy}
        </span>
      </div>

      {/* alarm ack */}
      {alarmActive && (
        <button
          onClick={onAckAlarm}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-priority-critical/50 bg-priority-critical/15 px-3 py-1.5 text-[11px] font-semibold text-priority-critical hover:bg-priority-critical/25"
        >
          <Bell className="h-3 w-3 animate-blink" />
          Acknowledge escalation
        </button>
      )}
    </div>
  );
}

function formatTimeShort(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
