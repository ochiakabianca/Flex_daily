import { shiftLocalDays, toLocalDateISO } from '../data/routines';
import type { BodyZone, MilestoneBadge, PracticeState, SessionLog } from '../types/mobility';

export const ALL_BODY_ZONES: BodyZone[] = [
  'Spine & Neck',
  'Hips & Pelvis',
  'Hamstrings & Legs',
  'Shoulders & Chest',
  'Full Body',
];

export interface StreakSummary {
  currentStreak: number;
  bestStreak: number;
  practicedToday: boolean;
  graceShieldEarned: boolean;
  graceShieldUsedRecently: boolean;
  totalMinutes: number;
  totalSessions: number;
  weeklySessions: number;
  weeklyGoal: number;
  distinctDays: number;
}

function getUniqueSortedDates(sessions: SessionLog[]): string[] {
  const unique = Array.from(new Set(sessions.map((s) => s.dateISO)));
  return unique.sort();
}

export function computeStreakSummary(state: PracticeState): StreakSummary {
  const { sessions, weeklyGoal } = state;
  const uniqueDates = getUniqueSortedDates(sessions);
  const dateSet = new Set(uniqueDates);

  const today = new Date();
  const todayISO = toLocalDateISO(today);
  const yesterdayISO = toLocalDateISO(shiftLocalDays(today, -1));
  const practicedToday = dateSet.has(todayISO);

  // Current streak with 1-day Grace Shield protection if 5+ days were completed before a single rest day
  let currentStreak = 0;
  let graceShieldUsedRecently = false;
  let cursor = practicedToday ? new Date(today) : dateSet.has(yesterdayISO) ? shiftLocalDays(today, -1) : null;

  if (!cursor) {
    // Check if user missed only yesterday, practiced 2 days ago, and had >= 4 prior consecutive days
    const twoDaysAgoISO = toLocalDateISO(shiftLocalDays(today, -2));
    if (dateSet.has(twoDaysAgoISO)) {
      let priorRun = 0;
      let probe = shiftLocalDays(today, -2);
      while (dateSet.has(toLocalDateISO(probe))) {
        priorRun += 1;
        probe = shiftLocalDays(probe, -1);
      }
      if (priorRun >= 4) {
        currentStreak = priorRun;
        graceShieldUsedRecently = true;
      }
    }
  } else {
    let missesAllowed = 1;
    let consecutiveBeforeMiss = 0;
    while (true) {
      const iso = toLocalDateISO(cursor);
      if (dateSet.has(iso)) {
        currentStreak += 1;
        consecutiveBeforeMiss += 1;
        cursor = shiftLocalDays(cursor, -1);
      } else if (missesAllowed > 0 && consecutiveBeforeMiss >= 5) {
        // Grace bridge across 1 missed day only if preceded by >=5 consistent days
        const prevIso = toLocalDateISO(shiftLocalDays(cursor, -1));
        if (dateSet.has(prevIso)) {
          missesAllowed -= 1;
          graceShieldUsedRecently = true;
          cursor = shiftLocalDays(cursor, -1);
          continue;
        }
        break;
      } else {
        break;
      }
    }
  }

  // Best raw consecutive run across history
  let bestStreak = 0;
  let run = 0;
  let prevDate: Date | null = null;
  for (const iso of uniqueDates) {
    const [y, m, d] = iso.split('-').map(Number);
    const current = new Date(y, m - 1, d);
    if (prevDate) {
      const diffDays = Math.round((current.getTime() - prevDate.getTime()) / 86400000);
      if (diffDays === 1) {
        run += 1;
      } else {
        run = 1;
      }
    } else {
      run = 1;
    }
    if (run > bestStreak) bestStreak = run;
    prevDate = current;
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  // Weekly sessions (Monday through Sunday of current week)
  const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0..Sun=6
  const weekStart = shiftLocalDays(today, -dayOfWeek);
  const weekStartISO = toLocalDateISO(weekStart);
  const weeklyDays = new Set(
    sessions.filter((s) => s.dateISO >= weekStartISO && s.dateISO <= todayISO).map((s) => s.dateISO)
  );

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return {
    currentStreak,
    bestStreak,
    practicedToday,
    graceShieldEarned: currentStreak >= 5,
    graceShieldUsedRecently,
    totalMinutes,
    totalSessions: sessions.length,
    weeklySessions: weeklyDays.size,
    weeklyGoal,
    distinctDays: uniqueDates.length,
  };
}

export function computeZoneMinutes(sessions: SessionLog[]): { zone: BodyZone; minutes: number; sessions: number }[] {
  const map = new Map<BodyZone, { minutes: number; sessions: number }>();
  for (const z of ALL_BODY_ZONES) {
    map.set(z, { minutes: 0, sessions: 0 });
  }
  for (const s of sessions) {
    const entry = map.get(s.zone) ?? { minutes: 0, sessions: 0 };
    map.set(s.zone, {
      minutes: entry.minutes + s.durationMinutes,
      sessions: entry.sessions + 1,
    });
  }
  return ALL_BODY_ZONES.map((zone) => ({
    zone,
    minutes: map.get(zone)?.minutes ?? 0,
    sessions: map.get(zone)?.sessions ?? 0,
  }));
}

export function evaluateMilestones(state: PracticeState): MilestoneBadge[] {
  const summary = computeStreakSummary(state);
  const uniqueDates = getUniqueSortedDates(state.sessions);
  const zonesCovered = new Set(state.sessions.map((s) => s.zone)).size;
  const totalBenchmarkLogs = state.benchmarks.reduce((sum, b) => sum + b.entries.length, 0);
  const openComfortCount = state.sessions.filter((s) => s.comfortRating === 3).length;

  const findDateAtSessionIndex = (count: number) =>
    state.sessions.length >= count ? [...state.sessions].sort((a, b) => a.dateISO.localeCompare(b.dateISO))[count - 1].dateISO : undefined;

  const findDateAtMinutes = (targetMinutes: number) => {
    const sorted = [...state.sessions].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    let acc = 0;
    for (const s of sorted) {
      acc += s.durationMinutes;
      if (acc >= targetMinutes) return s.dateISO;
    }
    return undefined;
  };

  const todayISO = toLocalDateISO();

  return [
    {
      id: 'first-step',
      title: 'First Unroll',
      description: 'Completed your very first guided flexibility session and began showing up for your joints.',
      criteriaLabel: 'Complete 1 stretching session',
      category: 'Consistency',
      target: 1,
      progress: Math.min(1, summary.totalSessions),
      unlocked: summary.totalSessions >= 1,
      unlockedDateISO: findDateAtSessionIndex(1),
    },
    {
      id: 'five-day-rhythm',
      title: 'Steady Rhythm',
      description: 'Maintained five active practice days in a row—earning your Recovery Grace Shield.',
      criteriaLabel: 'Reach a 5-day practice streak',
      category: 'Consistency',
      target: 5,
      progress: Math.min(5, summary.bestStreak),
      unlocked: summary.bestStreak >= 5,
      unlockedDateISO: summary.bestStreak >= 5 ? uniqueDates[uniqueDates.length - 1] ?? todayISO : undefined,
    },
    {
      id: 'six-day-momentum',
      title: 'Six-Day Momentum',
      description: 'Carried your consistency past day five into a grounded daily ritual.',
      criteriaLabel: 'Reach a 6-day practice streak',
      category: 'Consistency',
      target: 6,
      progress: Math.min(6, summary.bestStreak),
      unlocked: summary.bestStreak >= 6,
      unlockedDateISO: summary.bestStreak >= 6 ? todayISO : undefined,
    },
    {
      id: 'balanced-mover',
      title: 'Balanced Mover',
      description: 'Nurtured every major mobility zone: Spine, Hips, Hamstrings, Shoulders, and Full Body.',
      criteriaLabel: 'Practice all 5 body zones',
      category: 'Balance',
      target: 5,
      progress: zonesCovered,
      unlocked: zonesCovered >= 5,
      unlockedDateISO: zonesCovered >= 5 ? uniqueDates[uniqueDates.length - 1] : undefined,
    },
    {
      id: 'hundred-minutes',
      title: '100 Minutes of Ease',
      description: 'Invested 100 cumulative minutes in slow, mindful breathing and tissue lengthening.',
      criteriaLabel: 'Reach 100 total minutes stretched',
      category: 'Volume',
      target: 100,
      progress: Math.min(100, summary.totalMinutes),
      unlocked: summary.totalMinutes >= 100,
      unlockedDateISO: findDateAtMinutes(100),
    },
    {
      id: 'two-fifty-minutes',
      title: '250 Minutes Dedicated',
      description: 'Built over four hours of deliberate mobility work across weeks of steady effort.',
      criteriaLabel: 'Reach 250 total minutes stretched',
      category: 'Volume',
      target: 250,
      progress: Math.min(250, summary.totalMinutes),
      unlocked: summary.totalMinutes >= 250,
      unlockedDateISO: findDateAtMinutes(250),
    },
    {
      id: 'measurer',
      title: 'Patient Observer',
      description: 'Tracked range-of-motion benchmarks across multiple sessions to witness real change.',
      criteriaLabel: 'Log 10+ flexibility measurements',
      category: 'Mobility',
      target: 10,
      progress: Math.min(10, totalBenchmarkLogs),
      unlocked: totalBenchmarkLogs >= 10,
      unlockedDateISO: totalBenchmarkLogs >= 10 ? todayISO : undefined,
    },
    {
      id: 'feeling-open',
      title: 'Deep Release',
      description: 'Completed five sessions finishing in a calm, open state of mobility.',
      criteriaLabel: 'Log 5 sessions rated "Open"',
      category: 'Mobility',
      target: 5,
      progress: Math.min(5, openComfortCount),
      unlocked: openComfortCount >= 5,
      unlockedDateISO: openComfortCount >= 5 ? todayISO : undefined,
    },
  ];
}

export function getAppreciationMessage(summary: StreakSummary, state: PracticeState): {
  headline: string;
  body: string;
} {
  if (summary.totalSessions === 0) {
    return {
      headline: 'Every supple joint starts with one quiet session.',
      body: 'Ten unhurried minutes on the mat today is more valuable than an intense hour once a month.',
    };
  }
  if (summary.practicedToday) {
    return {
      headline: `You showed up today—day ${summary.currentStreak} in motion.`,
      body: `You've invested ${summary.totalMinutes} minutes across ${summary.totalSessions} sessions. Your joints remember the patience you give them.`,
    };
  }
  if (summary.graceShieldUsedRecently) {
    return {
      headline: 'Your Recovery Grace Shield kept your streak intact.',
      body: 'Life gets busy. Because you built five steady days beforehand, one rest day never erases your momentum.',
    };
  }
  if (summary.currentStreak >= 5) {
    return {
      headline: `${summary.currentStreak} consecutive days of steady care.`,
      body: `One quick session today brings your streak to ${summary.currentStreak + 1} days and reinforces lasting neural ease.`,
    };
  }
  const latestNote = state.appreciationNotes[0]?.text;
  return {
    headline: `${summary.weeklySessions} of ${summary.weeklyGoal} sessions completed this week.`,
    body: latestNote
      ? `Your reminder: "${latestNote}"`
      : 'Consistency is built through gentle, repeatable sessions rather than pushing into discomfort.',
  };
}
