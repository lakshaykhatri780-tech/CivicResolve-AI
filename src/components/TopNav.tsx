import { Radio, LayoutDashboard, TerminalSquare, ShieldCheck, Activity } from 'lucide-react';
import type { ViewKey } from '../types';

const TABS: { key: ViewKey; label: string; icon: typeof Radio }[] = [
  { key: 'portal', label: 'Citizen Portal', icon: Radio },
  { key: 'command', label: 'Command Center', icon: LayoutDashboard },
  { key: 'agents', label: 'Agent Terminal', icon: TerminalSquare },
];

export function TopNav({
  view, onChange, liveCount,
}: {
  view: ViewKey;
  onChange: (v: ViewKey) => void;
  liveCount: number;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/70 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-deep to-ink-800 ring-1 ring-emerald/40 shadow-glow">
            <ShieldCheck className="h-5 w-5 text-emerald-glow" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-glow animate-pulse ring-2 ring-ink-950" />
          </div>
          <div className="leading-tight">
            <h1 className="font-extrabold tracking-tight text-ink-100">
              CivicResolve <span className="text-gradient-emerald">AI</span>
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
              Municipal Governance · SDG 11
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-xl border border-ink-700/70 bg-ink-900/60 p-1 md:flex">
          {TABS.map((t) => {
            const active = view === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald/15 text-emerald-glow shadow-glow'
                    : 'text-ink-300 hover:bg-ink-800/60 hover:text-ink-100'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.key === 'agents' && (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-glow">
                    <Activity className="h-2.5 w-2.5 animate-pulse" />
                    {liveCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-emerald/30 bg-emerald/10 px-3 py-1.5 lg:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-glow animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-glow">
              Agents Online
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-medium text-ink-300">Municipal HQ</p>
            <p className="text-[10px] text-ink-400 font-mono">Zone-N · Live</p>
          </div>
        </div>
      </div>

      {/* mobile nav */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-ink-800 px-3 py-2 no-scrollbar md:hidden">
        {TABS.map((t) => {
          const active = view === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'bg-emerald/15 text-emerald-glow'
                  : 'text-ink-300'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
