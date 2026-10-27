import {
  CopyPlus, TimerOff, ScanEye, Zap, X, CheckCircle2, AlertTriangle, Info,
} from 'lucide-react';
import type { Toast } from '../hooks/useAgentEngine';

export function JudgePanel({
  onA, onB, onC,
}: {
  onA: () => void;
  onB: () => void;
  onC: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[90] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 px-2">
      <div className="panel-raised border-emerald/20 p-3 animate-slide-up">
        <div className="flex items-center justify-between gap-2 px-1 pb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-emerald to-emerald-deep text-ink-950">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-ink-100">Judge Demo Control Panel</p>
              <p className="text-[10px] text-ink-400">One-click autonomous agent triggers</p>
            </div>
          </div>
          <span className="hidden text-[10px] text-ink-400 sm:block">
            Demo · instant feedback
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <TriggerButton
            onClick={onA}
            icon={<CopyPlus className="h-4 w-4" />}
            label="Trigger Duplicate Report"
            sub="Agent 1 detects + merges"
            tone="emerald"
          />
          <TriggerButton
            onClick={onB}
            icon={<TimerOff className="h-4 w-4" />}
            label="Simulate Missed Deadline"
            sub="SLA breach · auto-escalate"
            tone="red"
          />
          <TriggerButton
            onClick={onC}
            icon={<ScanEye className="h-4 w-4" />}
            label="Contradictory Closure"
            sub="Auditor rejects · reopens"
            tone="amber"
          />
        </div>
      </div>
    </div>
  );
}

function TriggerButton({
  onClick, icon, label, sub, tone,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  tone: 'emerald' | 'red' | 'amber';
}) {
  const styles = {
    emerald: 'border-emerald/40 hover:bg-emerald/15 hover:shadow-glow text-emerald-glow',
    red: 'border-priority-critical/40 hover:bg-priority-critical/15 hover:shadow-glow-red text-priority-critical',
    amber: 'border-amber/40 hover:bg-amber/15 hover:shadow-glow-amber text-amber-glow',
  }[tone];
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl border bg-ink-850/60 px-3 py-2.5 text-left transition-all ${styles}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-900 group-hover:scale-105 transition">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-bold text-ink-100">{label}</span>
        <span className="block truncate text-[10px] text-ink-400">{sub}</span>
      </span>
    </button>
  );
}

export function ToastStack({
  toasts, onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed right-4 top-20 z-[95] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const tone = {
          info: { icon: Info, color: 'text-blue-300 border-blue-500/40' },
          success: { icon: CheckCircle2, color: 'text-emerald-glow border-emerald/40' },
          error: { icon: AlertTriangle, color: 'text-priority-critical border-priority-critical/40' },
          warn: { icon: AlertTriangle, color: 'text-amber-glow border-amber/40' },
        }[t.tone];
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className={`panel-raised flex items-start gap-3 border p-3 animate-slide-in-right ${tone.color}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-ink-100">{t.title}</p>
              <p className="mt-0.5 text-[11px] text-ink-300">{t.body}</p>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-ink-400 hover:text-ink-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
