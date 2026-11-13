import { useMemo, useState } from 'react';
import { Calendar, Plus, RotateCcw, TrendingUp } from 'lucide-react';
import { shiftLocalDays, toLocalDateISO } from '../data/routines';
import type { BodyZone, ComfortRating, PracticeState } from '../types/mobility';
import type { StreakSummary } from '../utils/stats';
import { computeZoneMinutes } from '../utils/stats';

interface ProgressViewProps {
  state: PracticeState;
  summary: StreakSummary;
  onLogBenchmark: (benchmarkId: string, value: number, note: string) => void;
  onUpdateWeeklyGoal: (goal: number) => void;
  onPracticeZone: (zone: BodyZone) => void;
  onResetPracticeData: () => void;
}

const COMFORT_LABELS: Record<ComfortRating, string> = {
  1: 'Tight',
  2: 'Steady',
  3: 'Open',
};

export function ProgressView({
  state,
  summary,
  onLogBenchmark,
  onUpdateWeeklyGoal,
  onPracticeZone,
  onResetPracticeData,
}: ProgressViewProps) {
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() => toLocalDateISO());
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(
    state.benchmarks[0]?.id ?? 'forward-fold-reach'
  );
  const [newVal, setNewVal] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [showLogForm, setShowLogForm] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Build 12-week (84 days) calendar grid ending on Sunday of current week
  const { calendarWeeks, sessionsByDate } = useMemo(() => {
    const map = new Map<string, typeof state.sessions>();
    for (const s of state.sessions) {
      const existing = map.get(s.dateISO) ?? [];
      map.set(s.dateISO, [...existing, s]);
    }

    const today = new Date();
    const dayIdx = (today.getDay() + 6) % 7; // Mon=0..Sun=6
    const currentSunday = shiftLocalDays(today, 6 - dayIdx);
    const startMonday = shiftLocalDays(currentSunday, -(12 * 7 - 1));

    const weeks: { dateISO: string; minutes: number; isFuture: boolean; label: string }[][] = [];
    const todayISO = toLocalDateISO(today);

    for (let w = 0; w < 12; w += 1) {
      const col = [];
      for (let d = 0; d < 7; d += 1) {
        const current = shiftLocalDays(startMonday, w * 7 + d);
        const iso = toLocalDateISO(current);
        const daySessions = map.get(iso) ?? [];
        const minutes = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
        col.push({
          dateISO: iso,
          minutes,
          isFuture: iso > todayISO,
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        });
      }
      weeks.push(col);
    }

    return { calendarWeeks: weeks, sessionsByDate: map };
  }, [state.sessions]);

  const selectedDaySessions = sessionsByDate.get(selectedDateISO) ?? [];

  const activeBenchmark =
    state.benchmarks.find((b) => b.id === selectedBenchmarkId) ?? state.benchmarks[0];

  const zoneBreakdown = useMemo(() => computeZoneMinutes(state.sessions), [state.sessions]);
  const maxZoneMinutes = Math.max(1, ...zoneBreakdown.map((z) => z.minutes));
  const leastPracticedZone = useMemo(() => {
    return [...zoneBreakdown].sort((a, b) => a.minutes - b.minutes)[0];
  }, [zoneBreakdown]);

  // Chart math
  const chartData = useMemo(() => {
    if (!activeBenchmark) return null;
    const entries = [...activeBenchmark.entries].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    if (entries.length === 0) return null;

    const values = entries.map((e) => e.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const pad = Math.max(1, (maxVal - minVal) * 0.2);
    const yMin = minVal - pad;
    const yMax = maxVal + pad;

    const width = 560;
    const height = 200;
    const padX = 36;
    const padY = 22;

    const points = entries.map((e, i) => {
      const x =
        entries.length === 1
          ? width / 2
          : padX + (i / (entries.length - 1)) * (width - padX * 2);
      const y =
        height -
        padY -
        ((e.value - yMin) / Math.max(0.01, yMax - yMin)) * (height - padY * 2);
      return { ...e, x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath =
      points.length > 1
        ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} L ${points[0].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`
        : '';

    const firstVal = entries[0].value;
    const latestVal = entries[entries.length - 1].value;
    const delta = Number((latestVal - firstVal).toFixed(1));

    return { width, height, padX, padY, points, linePath, areaPath, firstVal, latestVal, delta };
  }, [activeBenchmark]);

  const handleBenchmarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBenchmark) return;
    const parsed = Number(newVal);
    if (Number.isNaN(parsed)) return;
    onLogBenchmark(activeBenchmark.id, parsed, newNote.trim());
    setNewVal('');
    setNewNote('');
    setShowLogForm(false);
  };

  const sortedSessions = useMemo(
    () => [...state.sessions].sort((a, b) => b.completedAtISO.localeCompare(a.completedAtISO)),
    [state.sessions]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      {/* Header & Weekly Goal Control */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E4E9EE]">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111827] [text-wrap:balance]">
            Flexibility Progress
          </h1>
          <p className="text-[15px] text-[#52606D] leading-relaxed">
            Track daily consistency, range-of-motion benchmarks, and muscle-group balance across your practice.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-[#E4E9EE] rounded-xl px-4 py-2.5">
          <span className="text-xs font-medium text-[#52606D] whitespace-nowrap">
            Weekly Goal
          </span>
          <div className="flex items-center gap-1" role="group" aria-label="Weekly goal days">
            {[3, 4, 5, 6, 7].map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => onUpdateWeeklyGoal(goal)}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                  state.weeklyGoal === goal
                    ? 'bg-[#1B4D3E] text-white'
                    : 'text-[#52606D] hover:bg-[#F1F5F8]'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#52606D]">days</span>
        </div>
      </div>

      {/* Section 1: 12-Week Consistency Heatmap + Day Inspector */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 bg-white border border-[#E4E9EE] rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#111827]">
                12-Week Practice Rhythm
              </h2>
              <p className="text-xs text-[#52606D] mt-0.5 tabular-nums">
                {summary.distinctDays} active days logged · Click any day to inspect sessions
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#52606D]">
              <span>Rest</span>
              <span className="w-3.5 h-3.5 rounded-xs bg-[#EEF2F5] inline-block" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#A7C8BE] inline-block" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#1B4D3E] inline-block" />
              <span>12+ min</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="inline-flex gap-2 min-w-full justify-between">
              <div className="flex flex-col justify-between py-0.5 text-[11px] font-mono text-[#6B7785] pr-1">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
              <div className="grid grid-cols-12 gap-2 flex-1">
                {calendarWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-2">
                    {week.map((cell) => {
                      const isSelected = cell.dateISO === selectedDateISO;
                      const colorClass = cell.isFuture
                        ? 'bg-[#F8FAFB] border border-dashed border-[#E4E9EE] opacity-50'
                        : cell.minutes === 0
                        ? 'bg-[#EEF2F5] hover:bg-[#DFE6EC]'
                        : cell.minutes < 10
                        ? 'bg-[#A7C8BE] hover:bg-[#8FB8AB]'
                        : 'bg-[#1B4D3E] hover:bg-[#143B2F]';
                      return (
                        <button
                          key={cell.dateISO}
                          type="button"
                          disabled={cell.isFuture}
                          onClick={() => setSelectedDateISO(cell.dateISO)}
                          title={`${cell.label}: ${cell.minutes} min`}
                          aria-label={`${cell.label}, ${cell.minutes} minutes practiced`}
                          className={`w-full aspect-square min-w-[18px] min-h-[18px] rounded-sm transition-transform cursor-pointer disabled:cursor-default ${colorClass} ${
                            isSelected ? 'ring-2 ring-[#111827] ring-offset-1' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-[#E4E9EE] rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EEF2F5]">
              <div>
                <p className="text-xs font-medium text-[#52606D]">Selected Day</p>
                <p className="font-display text-lg font-semibold text-[#111827] font-mono tabular-nums">
                  {selectedDateISO}
                </p>
              </div>
              <Calendar className="w-5 h-5 text-[#52606D]" aria-hidden="true" />
            </div>

            {selectedDaySessions.length === 0 ? (
              <div className="py-6 space-y-2">
                <p className="text-sm font-medium text-[#111827]">Rest &amp; Recovery Day</p>
                <p className="text-xs text-[#52606D] leading-relaxed">
                  No stretching session logged on this date. Rest days give connective tissue time to adapt.
                </p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-[#EEF2F5]">
                {selectedDaySessions.map((s) => (
                  <div key={s.id} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display text-base font-semibold text-[#111827]">
                        {s.routineTitle}
                      </p>
                      <span className="font-mono text-xs text-[#1B4D3E] tabular-nums shrink-0">
                        {s.durationMinutes} min
                      </span>
                    </div>
                    <p className="text-xs text-[#52606D]">
                      {s.zone} · Feeling: {COMFORT_LABELS[s.comfortRating]}
                    </p>
                    {s.note && (
                      <p className="text-xs text-[#111827] leading-relaxed pt-1">
                        &ldquo;{s.note}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#EEF2F5] text-xs text-[#52606D]">
            Weekly progress:{' '}
            <span className="font-mono font-semibold text-[#111827] tabular-nums">
              {summary.weeklySessions}/{summary.weeklyGoal}
            </span>{' '}
            days completed this week.
          </div>
        </div>
      </section>

      {/* Section 2: Flexibility Benchmarks Chart & Zone Balance */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Range-of-Motion Benchmarks */}
        <div className="lg:col-span-7 bg-white border border-[#E4E9EE] rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#111827]">
                Range-of-Motion Benchmarks
              </h2>
              <p className="text-xs text-[#52606D] mt-0.5">
                Log measurable flexibility tests every week to observe steady physical gains.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogForm((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#1B4D3E] text-white text-xs font-medium hover:bg-[#143B2F] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Log Measurement</span>
            </button>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {state.benchmarks.map((b) => {
              const active = b.id === activeBenchmark?.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBenchmarkId(b.id)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#111827] text-white'
                      : 'bg-[#F1F5F8] text-[#52606D] hover:text-[#111827]'
                  }`}
                >
                  {b.metricName}
                </button>
              );
            })}
          </div>

          {showLogForm && activeBenchmark && (
            <form
              onSubmit={handleBenchmarkSubmit}
              className="bg-[#F8FAFB] border border-[#E4E9EE] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
            >
              <div className="sm:col-span-4">
                <label htmlFor="bench-value" className="block text-xs font-medium text-[#52606D] mb-1">
                  New Value ({activeBenchmark.unit})
                </label>
                <input
                  id="bench-value"
                  type="number"
                  step="0.5"
                  required
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full px-3 py-2 rounded-lg border border-[#D5DCE2] bg-white text-sm font-mono tabular-nums"
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="bench-note" className="block text-xs font-medium text-[#52606D] mb-1">
                  Observation (optional)
                </label>
                <input
                  id="bench-note"
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Warm after 10m walk"
                  className="w-full px-3 py-2 rounded-lg border border-[#D5DCE2] bg-white text-sm"
                />
              </div>
              <div className="sm:col-span-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-lg bg-[#1B4D3E] text-white text-xs font-medium cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {activeBenchmark && chartData ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#EEF2F5] pb-3">
                <p className="text-xs text-[#52606D] max-w-md">{activeBenchmark.description}</p>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-[#52606D] block">Latest</span>
                    <span className="font-mono text-lg font-semibold text-[#111827] tabular-nums">
                      {chartData.latestVal} {activeBenchmark.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#52606D] block">Change</span>
                    <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-[#1B4D3E] tabular-nums">
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                      {chartData.delta >= 0 ? '+' : ''}
                      {chartData.delta} {activeBenchmark.unit}
                    </span>
                  </div>
                </div>
              </div>

              <svg
                viewBox={`0 0 ${chartData.width} ${chartData.height}`}
                className="w-full h-auto overflow-visible"
                role="img"
                aria-label={`${activeBenchmark.metricName} progress chart`}
              >
                <defs>
                  <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                {/* Baseline grid lines */}
                {[0.25, 0.5, 0.75].map((ratio) => {
                  const y = chartData.padY + ratio * (chartData.height - chartData.padY * 2);
                  return (
                    <line
                      key={ratio}
                      x1={chartData.padX}
                      x2={chartData.width - chartData.padX}
                      y1={y}
                      y2={y}
                      stroke="#EEF2F5"
                      strokeWidth="1"
                    />
                  );
                })}
                {chartData.areaPath && <path d={chartData.areaPath} fill="url(#benchGrad)" />}
                <path
                  d={chartData.linePath}
                  fill="none"
                  stroke="#1B4D3E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {chartData.points.map((pt) => (
                  <g key={pt.id}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#1B4D3E" strokeWidth="2.5" />
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className="fill-[#111827] text-[11px] font-mono font-semibold"
                    >
                      {pt.value}
                    </text>
                    <text
                      x={pt.x}
                      y={chartData.height - 4}
                      textAnchor="middle"
                      className="fill-[#6B7785] text-[10px] font-mono"
                    >
                      {pt.dateISO.slice(5)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <p className="text-sm text-[#52606D] py-8 text-center">
              No measurements logged for this metric yet. Click &ldquo;Log Measurement&rdquo; to set your baseline.
            </p>
          )}
        </div>

        {/* Body Zone Balance */}
        <div className="lg:col-span-5 bg-white border border-[#E4E9EE] rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#111827]">
                Body Zone Balance
              </h2>
              <p className="text-xs text-[#52606D] mt-0.5">
                Total minutes invested per mobility focus area.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {zoneBreakdown.map((item) => {
                const pct = Math.round((item.minutes / maxZoneMinutes) * 100);
                return (
                  <div key={item.zone} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#111827]">{item.zone}</span>
                      <span className="font-mono text-[#52606D] tabular-nums">
                        {item.minutes} min · {item.sessions} {item.sessions === 1 ? 'session' : 'sessions'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#EEF2F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1B4D3E] rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(item.minutes > 0 ? 6 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {leastPracticedZone && (
            <div className="pt-4 border-t border-[#EEF2F5] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#111827]">
                  Next Balanced Focus: {leastPracticedZone.zone}
                </p>
                <p className="text-xs text-[#52606D]">
                  Giving attention here keeps mobility symmetrical.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPracticeZone(leastPracticedZone.zone)}
                className="px-3.5 py-2 min-h-[38px] rounded-xl border border-[#1B4D3E] text-[#1B4D3E] text-xs font-medium hover:bg-[#EDF4F2] whitespace-nowrap shrink-0 cursor-pointer"
              >
                Practice Zone
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Recent Session Journal */}
      <section className="bg-white border border-[#E4E9EE] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#EEF2F5] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#111827]">
              Session Journal
            </h2>
            <p className="text-xs text-[#52606D] mt-0.5 tabular-nums">
              {sortedSessions.length} total sessions recorded
            </p>
          </div>

          <div>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52606D] hover:text-[#111827] py-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Start Fresh from Day 0</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#52606D]">Clear seeded &amp; logged data?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetPracticeData();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-medium cursor-pointer"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#D5DCE2] text-xs font-medium text-[#111827] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="font-display text-base font-semibold text-[#111827]">
              Your journal is ready for Day 1
            </p>
            <p className="text-sm text-[#52606D]">
              Complete any guided stretch routine to record your first entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF2F5] text-xs font-medium text-[#52606D] bg-[#F8FAFB]">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Routine</th>
                  <th className="py-3 px-4">Focus Zone</th>
                  <th className="py-3 px-4 text-right">Duration</th>
                  <th className="py-3 px-4">Feeling</th>
                  <th className="py-3 px-6">Reflection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F5] text-sm">
                {sortedSessions.slice(0, 12).map((session) => (
                  <tr key={session.id} className="hover:bg-[#F8FAFB] transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs text-[#52606D] tabular-nums whitespace-nowrap">
                      {session.dateISO}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111827] whitespace-nowrap">
                      {session.routineTitle}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#52606D] whitespace-nowrap">
                      {session.zone}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#111827] tabular-nums text-right whitespace-nowrap">
                      {session.durationMinutes} min
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#1B4D3E] whitespace-nowrap">
                      {COMFORT_LABELS[session.comfortRating]}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-[#52606D] max-w-xs truncate">
                      {session.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
