import { ArrowRight, CheckCircle2, Flame, Play, ShieldCheck } from 'lucide-react';
import {
  HERO_STUDIO_IMAGE,
  getRoutineDurationMinutes,
  shiftLocalDays,
  toLocalDateISO,
} from '../data/routines';
import type {
  HoldPace,
  MilestoneBadge,
  PracticeState,
  StretchRoutine,
} from '../types/mobility';
import type { StreakSummary } from '../utils/stats';
import { getAppreciationMessage } from '../utils/stats';
import { ResilientImage } from './ResilientImage';

interface TodayViewProps {
  state: PracticeState;
  summary: StreakSummary;
  milestones: MilestoneBadge[];
  routines: StretchRoutine[];
  recommendedRoutine: StretchRoutine;
  onStartRoutine: (routine: StretchRoutine) => void;
  onInspectRoutine: (routine: StretchRoutine) => void;
  onOpenRoutines: () => void;
  onOpenMilestones: () => void;
}

export function TodayView({
  state,
  summary,
  milestones,
  routines,
  recommendedRoutine,
  onStartRoutine,
  onInspectRoutine,
  onOpenRoutines,
  onOpenMilestones,
}: TodayViewProps) {
  const appreciation = getAppreciationMessage(summary, state);
  const recommendedMinutes = getRoutineDurationMinutes(recommendedRoutine, state.holdPace);

  // Build 7-day ribbon (Monday to Sunday of current week)
  const today = new Date();
  const todayISO = toLocalDateISO(today);
  const mondayOffset = -((today.getDay() + 6) % 7);
  const practicedDateSet = new Set(state.sessions.map((s) => s.dateISO));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = shiftLocalDays(today, mondayOffset + i);
    const iso = toLocalDateISO(d);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return {
      iso,
      label,
      dayNum,
      isToday: iso === todayISO,
      isFuture: iso > todayISO,
      done: practicedDateSet.has(iso),
    };
  });

  const nextMilestone =
    milestones.find((m) => !m.unlocked) ?? milestones[milestones.length - 1];

  const paceLabel = (pace: HoldPace) =>
    pace === 'gentle' ? 'Gentle 30s holds' : pace === 'deep' ? 'Deep 60s holds' : 'Standard 45s holds';

  const quickAlternatives = routines
    .filter((r) => r.id !== recommendedRoutine.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      {/* Section 1: Focal Hero Split (items-stretch) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white border border-[#E4E9EE] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52606D]">
              <span>Today&apos;s Guided Flow</span>
              <span aria-hidden="true">·</span>
              <span>{recommendedRoutine.zone}</span>
              <span aria-hidden="true">·</span>
              <span>{paceLabel(state.holdPace)}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#111827] leading-[1.12] [text-wrap:balance]">
                {recommendedRoutine.title}
              </h1>
              <p className="text-[15px] sm:text-base text-[#52606D] leading-relaxed max-w-xl">
                {recommendedRoutine.subtitle}
              </p>
            </div>

            <div className="pt-2 border-t border-[#EEF2F5] space-y-1.5">
              <p className="text-sm font-medium text-[#111827]">{appreciation.headline}</p>
              <p className="text-sm text-[#52606D] leading-relaxed max-w-xl">
                {appreciation.body}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onStartRoutine(recommendedRoutine)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[46px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4D3E]"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>
                  {summary.practicedToday ? 'Practice Again' : `Begin ${recommendedMinutes}-Min Routine`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onInspectRoutine(recommendedRoutine)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl border border-[#D5DCE2] bg-white text-[#111827] text-sm font-medium hover:bg-[#F7F9FA] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4D3E]"
              >
                <span>Preview {recommendedRoutine.poses.length} Poses</span>
              </button>
            </div>

            {/* 7-day weekly consistency strip */}
            <div className="pt-5 border-t border-[#EEF2F5]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#52606D]">
                  This Week&apos;s Rhythm
                </span>
                <span className="font-mono text-xs text-[#111827] tabular-nums">
                  {summary.weeklySessions} / {summary.weeklyGoal} days goal
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((d) => (
                  <div
                    key={d.iso}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-center transition-colors ${
                      d.done
                        ? 'bg-[#EDF4F2] border-[#1B4D3E]/25 text-[#1B4D3E]'
                        : d.isToday
                        ? 'bg-white border-[#111827] text-[#111827]'
                        : 'bg-[#F8FAFB] border-[#EEF2F5] text-[#6B7785]'
                    }`}
                  >
                    <span className="text-[11px] font-medium">{d.label}</span>
                    <span className="font-mono text-sm font-semibold tabular-nums mt-0.5">
                      {d.dayNum}
                    </span>
                    <span className="mt-1 h-4 flex items-center justify-center">
                      {d.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E]" aria-label="Completed" />
                      ) : d.isToday ? (
                        <span className="text-[10px] font-medium text-[#111827]">Today</span>
                      ) : (
                        <span className="text-[10px] text-[#94A3B8]">—</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#E4E9EE] min-h-[280px] lg:min-h-full">
          <ResilientImage
            src={HERO_STUDIO_IMAGE}
            alt="Sunlit architectural movement studio with unrolled slate stretching mat"
            fallbackTitle="Calm Daily Mobility Practice"
            className="w-full h-full object-cover lg:absolute lg:inset-0"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white flex items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/80">
                {recommendedRoutine.recommendedTime} Session · {recommendedRoutine.level}
              </p>
              <p className="font-display text-xl font-semibold">
                {recommendedRoutine.poses.length} Guided Poses · {recommendedMinutes} min
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Full-width 4-column KPI strip below hero */}
      <section
        aria-label="Practice summary metrics"
        className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#E4E9EE] rounded-2xl divide-y lg:divide-y-0 lg:divide-x divide-[#EEF2F5]"
      >
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#52606D]">Current Streak</p>
            <p className="font-mono text-2xl sm:text-3xl font-semibold text-[#111827] tabular-nums mt-1">
              {summary.currentStreak} {summary.currentStreak === 1 ? 'day' : 'days'}
            </p>
            <p className="text-xs text-[#52606D] mt-1 tabular-nums">
              Best streak: {summary.bestStreak} days
            </p>
          </div>
          <Flame className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
        </div>

        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#52606D]">Consistency Shield</p>
            <p className="font-display text-xl sm:text-2xl font-semibold text-[#111827] mt-1">
              {summary.graceShieldEarned ? 'Active' : `${Math.max(0, 5 - summary.currentStreak)} days away`}
            </p>
            <p className="text-xs text-[#52606D] mt-1">
              {summary.graceShieldEarned
                ? 'Protects 1 rest day without resetting'
                : 'Earn at 5 consecutive days'}
            </p>
          </div>
          <ShieldCheck
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              summary.graceShieldEarned ? 'text-[#1B4D3E]' : 'text-[#94A3B8]'
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="p-6">
          <p className="text-xs font-medium text-[#52606D]">Total Mobility Time</p>
          <p className="font-mono text-2xl sm:text-3xl font-semibold text-[#111827] tabular-nums mt-1">
            {summary.totalMinutes} min
          </p>
          <p className="text-xs text-[#52606D] mt-1 tabular-nums">
            Across {summary.totalSessions} completed sessions
          </p>
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-[#52606D]">Next Milestone</p>
            <p className="font-display text-lg font-semibold text-[#111827] mt-1 truncate">
              {nextMilestone.title}
            </p>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full bg-[#EEF2F5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B4D3E] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((nextMilestone.progress / nextMilestone.target) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#52606D]">
              <span className="font-mono tabular-nums">
                {nextMilestone.progress}/{nextMilestone.target}
              </span>
              <button
                type="button"
                onClick={onOpenMilestones}
                className="font-medium text-[#1B4D3E] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Other Routines for Today */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#111827]">
              Choose Another Focus
            </h2>
            <p className="text-sm text-[#52606D] mt-1">
              Adapt today&apos;s stretching routine to how your body feels right now.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenRoutines}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4D3E] hover:text-[#143B2F] whitespace-nowrap shrink-0 cursor-pointer py-2"
          >
            <span>All {routines.length} Routines</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickAlternatives.map((routine) => {
            const mins = getRoutineDurationMinutes(routine, state.holdPace);
            return (
              <article
                key={routine.id}
                className="bg-white border border-[#E4E9EE] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors hover:border-[#C5D0DA]"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#EEF2F5]">
                    <ResilientImage
                      src={routine.image}
                      alt={routine.title}
                      fallbackTitle={routine.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#52606D]">
                      <span>{routine.zone}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{mins} min</span>
                      <span aria-hidden="true">·</span>
                      <span>{routine.level}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#111827]">
                      {routine.title}
                    </h3>
                    <p className="text-sm text-[#52606D] leading-relaxed line-clamp-2">
                      {routine.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onStartRoutine(routine)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#111827] text-white text-sm font-medium hover:bg-[#1B4D3E] transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>Start</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectRoutine(routine)}
                    className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#D5DCE2] text-sm font-medium text-[#111827] hover:bg-[#F7F9FA] transition-colors cursor-pointer"
                  >
                    Poses
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
