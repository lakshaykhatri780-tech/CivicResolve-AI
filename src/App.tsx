import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { CitizenPortal } from './components/CitizenPortal';
import { CommandCenter } from './components/CommandCenter';
import { AgentTerminal } from './components/AgentTerminal';
import { JudgePanel, ToastStack } from './components/JudgePanel';
import { useAgentEngine } from './hooks/useAgentEngine';
import type { ViewKey } from './types';

function App() {
  const [view, setView] = useState<ViewKey>('command');
  const engine = useAgentEngine();

  return (
    <div className="min-h-screen">
      <TopNav view={view} onChange={setView} liveCount={engine.logs.length} />

      <main className="pb-28">
        {view === 'portal' && <CitizenPortal onSubmit={engine.submitReport} />}
        {view === 'command' && (
          <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
            <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
              <CommandCenter
                incidents={engine.incidents}
                metrics={engine.metrics}
                alarmPulseId={engine.alarmPulseId}
                onAckAlarm={engine.clearAlarm}
              />
              <div className="hidden xl:block">
                <div className="sticky top-20">
                  <AgentTerminal logs={engine.logs} compact />
                </div>
              </div>
            </div>
            {/* mobile terminal toggle below board */}
            <div className="mt-4 xl:hidden">
              <AgentTerminal logs={engine.logs} />
            </div>
          </div>
        )}
        {view === 'agents' && (
          <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-ink-100">Autonomous Agent Live Log</h2>
              <p className="text-sm text-ink-400">
                Every decision, escalation, and audit verdict — streamed in real time.
              </p>
            </div>
            <AgentTerminal logs={engine.logs} compact />
          </div>
        )}
      </main>

      <JudgePanel
        onA={engine.triggerDuplicate}
        onB={engine.triggerSlaBreach}
        onC={engine.triggerContradictoryClosure}
      />

      <ToastStack toasts={engine.toasts} onDismiss={() => {}} />
    </div>
  );
}

export default App;
