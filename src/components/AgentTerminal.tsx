import { useEffect, useRef } from 'react';
import {
  Terminal, Cpu, ShieldAlert, ScanEye, Bot, Activity, Trash2,
} from 'lucide-react';
import type { AgentLogEntry, AgentName } from '../types';
import {
  AGENT_LOG_LEVEL_COLOR, AGENT_LOG_LEVEL_TAG,
} from '../mockData';
import { formatTimestamp } from '../utils/format';

const AGENT_META: Record<AgentName, { icon: typeof Bot; color: string }> = {
  'Triage Agent': { icon: Cpu, color: 'text-emerald-glow' },
  'SLA Watchdog': { icon: ShieldAlert, color: 'text-priority-critical' },
  'Auditor Agent': { icon: ScanEye, color: 'text-amber-glow' },
  'Duplicate Detector': { icon: Activity, color: 'text-blue-300' },
  'Coordinator': { icon: Bot, color: 'text-ink-200' },
};

export function AgentTerminal({
  logs, compact,
}: {
  logs: AgentLogEntry[];
  compact?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs.length]);

  return (
    <div className={`flex flex-col panel-raised overflow-hidden ${compact ? 'h-full' : ''}`}>
      {/* header */}
      <div className="flex items-center justify-between border-b border-ink-700/70 bg-ink-900/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-glow" />
          <h3 className="text-sm font-bold text-ink-100">autonomous_agents.log</h3>
          <span className="rounded-md bg-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-glow">
            {logs.length} events
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-glow animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-glow">
            streaming
          </span>
        </div>
      </div>

      {/* agent roster */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-ink-700/60 bg-ink-850/50 px-3 py-2">
        {(Object.keys(AGENT_META) as AgentName[]).map((name) => {
          const M = AGENT_META[name];
          return (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-md border border-ink-700/60 bg-ink-900/60 px-2 py-1 text-[10px] font-medium text-ink-300"
            >
              <M.icon className={`h-3 w-3 ${M.color}`} />
              {name}
            </span>
          );
        })}
      </div>

      {/* log stream */}
      <div
        ref={scrollRef}
        className="grid-bg flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed"
        style={{ maxHeight: compact ? 'none' : '60vh' }}
      >
        {logs.length === 0 ? (
          <div className="grid place-items-center py-10 text-ink-400">
            <Trash2 className="h-5 w-5" />
            <p className="mt-2 text-xs">Awaiting agent activity...</p>
          </div>
        ) : (
          logs.map((l) => {
            const M = AGENT_META[l.agent];
            return (
              <div
                key={l.id}
                className="mb-1.5 flex items-start gap-2 rounded-md border border-transparent px-2 py-1.5 transition hover:border-ink-700 hover:bg-ink-850/40 animate-slide-in-right"
              >
                <span className="shrink-0 text-ink-400 tabular-nums">
                  {formatTimestamp(l.timestamp)}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${AGENT_LOG_LEVEL_COLOR[l.level]} bg-ink-900`}
                >
                  {AGENT_LOG_LEVEL_TAG[l.level]}
                </span>
                <span className={`flex shrink-0 items-center gap-1 font-semibold ${M.color}`}>
                  <M.icon className="h-3 w-3" />
                  [{l.agent}]
                </span>
                <span className="text-ink-200">{l.message}</span>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
