import { useMemo, useState } from 'react';
import {
  Send, MapPin, Camera, AlertTriangle, Sparkles, CheckCircle2,
  Loader2, FileText, Tag, Layers, Copy, ArrowRight,
} from 'lucide-react';
import {
  SAMPLE_INCIDENT_PHOTOS, CATEGORY_ICON, CATEGORY_PHOTO_MAP,
} from '../mockData';
import type { Category, Ward } from '../types';
import { Modal } from './Badges';

const CATEGORIES: Category[] = [
  'Pothole/Roads',
  'Sanitation/Garbage',
  'Broken Streetlight',
  'Sewage Overflow',
];

const WARDS: Ward[] = [
  'Ward 14 - Sector 14',
  'Ward 15 - Sector 15',
  'Ward 8 - Model Town',
  'Ward 3 - GT Road',
  'Ward 22 - Industrial Area',
  'Ward 11 - Civil Lines',
];

const SAMPLE_PHOTOS = [
  { label: 'Pothole', url: SAMPLE_INCIDENT_PHOTOS.pothole, cat: 'Pothole/Roads' },
  { label: 'Garbage', url: SAMPLE_INCIDENT_PHOTOS.garbage, cat: 'Sanitation/Garbage' },
  { label: 'Streetlight', url: SAMPLE_INCIDENT_PHOTOS.streetlight, cat: 'Broken Streetlight' },
  { label: 'Sewage', url: SAMPLE_INCIDENT_PHOTOS.sewage, cat: 'Sewage Overflow' },
];

interface SubmitResult {
  id: string;
  duplicateCluster: string | null;
}

export function CitizenPortal({
  onSubmit,
}: {
  onSubmit: (d: { title: string; category: string; ward: string; description: string; photo: string }) => SubmitResult;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Pothole/Roads');
  const [ward, setWard] = useState<Ward>('Ward 14 - Sector 14');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string>(SAMPLE_INCIDENT_PHOTOS.pothole);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  // Live duplicate detection preview: trigger when title contains "pothole"
  // and a ward/sector match against the seeded CIV-104 cluster (GT Road) OR
  // any Sector 14 reference.
  const duplicatePreview = useMemo(() => {
    const t = title.toLowerCase().trim();
    if (t.length < 8) return null;
    const mentionsPothole = t.includes('pothole');
    const mentionsSector14 = t.includes('sector 14') || t.includes('sec 14') || t.includes('sector-14');
    const mentionsGtRoad = t.includes('gt road');
    if (mentionsPothole && (mentionsSector14 || mentionsGtRoad || ward.includes('Sector 14') || ward.includes('GT Road'))) {
      return {
        cluster: 'CIV-104',
        count: 3,
        radius: '200m',
        message:
          mentionsSector14
            ? 'Agent 1 detected 3 similar reports in this 200m radius. Clustering under Master Incident #CIV-104.'
            : 'Agent 1 matched your report to cluster CIV-104 (GT Road potholes). 3 prior reports within 200m.',
      };
    }
    return null;
  }, [title, ward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    // simulate agent processing latency
    setTimeout(() => {
      const res = onSubmit({
        title: title.trim(),
        category,
        ward,
        description: description.trim(),
        photo,
      });
      setResult(res);
      setSubmitting(false);
      // reset form after success
      setTitle('');
      setDescription('');
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* form column */}
        <div className="panel-raised animate-slide-up p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink-100">
                <Send className="h-5 w-5 text-emerald-glow" />
                Report a Civic Issue
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                Your report is instantly triaged by autonomous agents and routed to the
                responsible municipal department.
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-glow sm:flex">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Assisted
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <Field label="Incident Title" icon={<FileText className="h-4 w-4" />}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pothole on Sector 14 main road"
                className="w-full rounded-xl border border-ink-700 bg-ink-850/60 px-4 py-3 text-sm text-ink-100 outline-none transition placeholder:text-ink-400 focus:border-emerald/60 focus:shadow-glow"
              />
            </Field>

            {/* Category + Ward */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" icon={<Tag className="h-4 w-4" />}>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => {
                    const Icon = CATEGORY_ICON[c];
                    const active = category === c;
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          setPhoto(CATEGORY_PHOTO_MAP[c]);
                        }}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                          active
                            ? 'border-emerald/60 bg-emerald/10 text-emerald-glow shadow-glow'
                            : 'border-ink-700 bg-ink-850/40 text-ink-300 hover:border-ink-600 hover:text-ink-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="leading-tight">{c}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Location / Ward" icon={<MapPin className="h-4 w-4" />}>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value as Ward)}
                  className="w-full rounded-xl border border-ink-700 bg-ink-850/60 px-4 py-3 text-sm text-ink-100 outline-none transition focus:border-emerald/60"
                >
                  {WARDS.map((w) => (
                    <option key={w} value={w} className="bg-ink-900">
                      {w}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Description */}
            <Field label="Description" icon={<FileText className="h-4 w-4" />}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what you observed, when, and any safety risks..."
                className="w-full resize-none rounded-xl border border-ink-700 bg-ink-850/60 px-4 py-3 text-sm text-ink-100 outline-none transition placeholder:text-ink-400 focus:border-emerald/60"
              />
            </Field>

            {/* Photo upload area */}
            <Field label="Photo Evidence" icon={<Camera className="h-4 w-4" />}>
              <div className="rounded-xl border border-dashed border-ink-700 bg-ink-850/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] text-ink-400">
                    Tap a sample incident photo to attach (for quick demo testing)
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((p) => {
                    const active = photo === p.url;
                    return (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => {
                          setPhoto(p.url);
                          setCategory(p.cat as Category);
                        }}
                        className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
                          active
                            ? 'border-emerald shadow-glow'
                            : 'border-ink-700 hover:border-ink-500'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent px-1.5 py-1 text-left text-[10px] font-semibold text-ink-100">
                          {p.label}
                        </div>
                        {active && (
                          <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald text-ink-950">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {photo && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-2">
                    <img src={photo} alt="attached" className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-ink-200">
                        evidence_{Date.now().toString().slice(-6)}.jpg
                      </p>
                      <p className="text-[10px] text-ink-400">Attached · geotag extracted</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="text-[11px] text-ink-400 hover:text-priority-critical"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </Field>

            {/* Duplicate detection preview */}
            {duplicatePreview && (
              <div className="flex items-start gap-3 rounded-xl border border-amber/40 bg-amber/10 p-4 animate-slide-in-right">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber/20 text-amber-glow">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-glow">
                    Duplicate report detected
                  </p>
                  <p className="mt-0.5 text-xs text-ink-200">
                    {duplicatePreview.message}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="inline-flex items-center gap-1 rounded-md bg-ink-900 px-2 py-1 font-mono text-ink-300">
                      <Layers className="h-3 w-3" /> Master #{duplicatePreview.cluster}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-ink-900 px-2 py-1 font-mono text-ink-300">
                      <Copy className="h-3 w-3" /> {duplicatePreview.count} similar
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-ink-900 px-2 py-1 font-mono text-ink-300">
                      <MapPin className="h-3 w-3" /> {duplicatePreview.radius} radius
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || submitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald-deep px-5 py-3.5 text-sm font-bold text-ink-950 shadow-glow transition hover:from-emerald-glow hover:to-emerald disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Triage agent processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  Submit Report to AI Triage
                </>
              )}
            </button>
          </form>
        </div>

        {/* side info column */}
        <div className="space-y-6">
          <div className="panel-raised animate-slide-up p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-200">
              <Sparkles className="h-4 w-4 text-emerald-glow" />
              What happens next
            </h3>
            <ol className="mt-4 space-y-3">
              {[
                ['1', 'Triage Agent extracts geotag, severity & category', 'text-emerald-glow'],
                ['2', 'Duplicate Detector clusters similar reports within 200m', 'text-amber-glow'],
                ['3', 'Routed to the responsible department (PWD / Sanitation / Power / Water)', 'text-blue-300'],
                ['4', 'SLA Watchdog tracks the deadline; auto-escalates on breach', 'text-priority-critical'],
                ['5', 'Auditor Agent verifies closure photos before ticket is closed', 'text-emerald-glow'],
              ].map(([n, t, c]) => (
                <li key={n} className="flex items-start gap-3">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-ink-700 bg-ink-850 font-mono text-xs font-bold ${c}`}>
                    {n}
                  </span>
                  <p className="pt-1 text-sm text-ink-300">{t}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="panel-raised animate-slide-up p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-200">
              <MapPin className="h-4 w-4 text-amber-glow" />
              Active clusters in your zone
            </h3>
            <div className="mt-4 space-y-2">
              {[
                ['#CIV-104', 'GT Road potholes', '3 reports', 'Critical'],
                ['#CIV-089', 'Model Town waste', '4 reports', 'High'],
                ['#CIV-101', 'Sector 15 streetlights', '2 reports', 'High'],
              ].map(([id, name, count, pri]) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-850/40 px-3 py-2.5"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-ink-100">{id}</p>
                    <p className="text-[11px] text-ink-400">{name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="rounded-md bg-ink-800 px-2 py-1 font-mono text-ink-300">{count}</span>
                    <span className={`rounded-md px-2 py-1 font-semibold ${
                      pri === 'Critical' ? 'bg-priority-critical/20 text-priority-critical' : 'bg-priority-high/20 text-priority-high'
                    }`}>{pri}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={!!result}
        onClose={() => setResult(null)}
        title={result?.duplicateCluster ? 'Report clustered' : 'Report submitted'}
        tone={result?.duplicateCluster ? 'warn' : 'success'}
      >
        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald/15 text-emerald-glow">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-100">
                  Ticket {result.id} created
                </p>
                <p className="text-xs text-ink-400">
                  {result.duplicateCluster
                    ? `Merged into Master Incident #${result.duplicateCluster}`
                    : 'New cluster created · routed to department'}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-ink-700 bg-ink-850/50 p-4">
              <p className="text-xs text-ink-300">
                The Triage Agent is processing your report. Track its progress in the
                Command Center, and watch autonomous decisions in the Agent Terminal.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setResult(null)}
                className="rounded-lg border border-ink-700 px-4 py-2 text-sm font-medium text-ink-200 hover:bg-ink-800"
              >
                Report another
              </button>
              <a
                href="#command"
                onClick={() => setResult(null)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald px-4 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-glow"
              >
                Track in Command Center <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({
  label, icon, children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-300">
        <span className="text-emerald-glow">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
