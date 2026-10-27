import { type ReactNode } from 'react';
import {
  PRIORITY_COLOR, DEPARTMENT_COLOR, AGENT_STATUS_COLOR,
} from '../mockData';
import type { Priority, Department, AgentStatus } from '../types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${PRIORITY_COLOR[priority]}`}
    >
      {priority === 'Critical' && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-blink" />
      )}
      {priority}
    </span>
  );
}

export function DeptBadge({ dept }: { dept: Department }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${DEPARTMENT_COLOR[dept]}`}
    >
      {dept}
    </span>
  );
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${AGENT_STATUS_COLOR[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Active'
            ? 'bg-emerald-glow animate-pulse'
            : status === 'Alert'
              ? 'bg-priority-critical animate-blink'
              : status === 'Reviewing'
                ? 'bg-amber-glow animate-pulse'
                : 'bg-ink-400'
        }`}
      />
      {status}
    </span>
  );
}

export function StatTile({
  label, value, icon, tone = 'default', sub,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: 'default' | 'emerald' | 'amber' | 'red';
  sub?: string;
}) {
  const toneRing = {
    default: 'border-ink-700/70',
    emerald: 'border-emerald/30 shadow-glow',
    amber: 'border-amber/30 shadow-glow-amber',
    red: 'border-priority-critical/30 shadow-glow-red',
  }[tone];
  const valueColor = {
    default: 'text-ink-100',
    emerald: 'text-emerald-glow',
    amber: 'text-amber-glow',
    red: 'text-priority-critical',
  }[tone];
  return (
    <div
      className={`panel relative overflow-hidden p-4 transition-all hover:border-ink-600 ${toneRing}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
            {label}
          </p>
          <p className={`mt-2 font-mono text-3xl font-bold tabular-nums ${valueColor}`}>
            {value}
          </p>
          {sub && <p className="mt-1 text-[11px] text-ink-400">{sub}</p>}
        </div>
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl bg-ink-800 ${valueColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Modal({
  open, onClose, title, children, tone = 'default',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  tone?: 'default' | 'success' | 'error' | 'warn';
}) {
  if (!open) return null;
  const accent = {
    default: 'border-ink-700',
    success: 'border-emerald/40 shadow-glow',
    error: 'border-priority-critical/40 shadow-glow-red',
    warn: 'border-amber/40 shadow-glow-amber',
  }[tone];
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`panel-raised relative z-10 w-full max-w-lg border ${accent} p-6 animate-slide-up`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-100">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
