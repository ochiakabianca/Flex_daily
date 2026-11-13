import { useEffect, useMemo, useState } from 'react';
import { AppreciationView } from './components/AppreciationView';
import { GuidedPlayer } from './components/GuidedPlayer';
import { ProgressView } from './components/ProgressView';
import { RoutinesView } from './components/RoutinesView';
import { TodayView } from './components/TodayView';
import type { AppTab } from './components/TopBar';
import { TopBar } from './components/TopBar';
import {
  BUILTIN_ROUTINES,
  createSeededPracticeState,
  toLocalDateISO,
} from './data/routines';
import type {
  BodyZone,
  ComfortRating,
  HoldPace,
  MilestoneBadge,
  PracticeState,
  SessionLog,
  StretchRoutine,
} from './types/mobility';
import { computeStreakSummary, evaluateMilestones } from './utils/stats';

const STORAGE_KEY = 'supple-mobility-practice-v1';

function loadInitialState(): PracticeState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PracticeState;
      if (parsed && Array.isArray(parsed.sessions) && Array.isArray(parsed.benchmarks)) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors and fall back to seeded practice state
  }
  return createSeededPracticeState();
}

export default function App() {
  const [state, setState] = useState<PracticeState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [activeRoutine, setActiveRoutine] = useState<StretchRoutine | null>(null);
  const [inspectedRoutine, setInspectedRoutine] = useState<StretchRoutine | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const allRoutines = useMemo(
    () => [...BUILTIN_ROUTINES, ...state.customRoutines],
    [state.customRoutines]
  );

  const summary = useMemo(() => computeStreakSummary(state), [state]);
  const milestones = useMemo(() => evaluateMilestones(state), [state]);

  // Recommend routine matched to time of day
  const recommendedRoutine = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) {
      return allRoutines.find((r) => r.id === 'morning-spinal-wakeup') ?? allRoutines[0];
    }
    if (hour < 17) {
      return allRoutines.find((r) => r.id === 'desk-hip-opener') ?? allRoutines[0];
    }
    return allRoutines.find((r) => r.id === 'evening-downshift') ?? allRoutines[0];
  }, [allRoutines]);

  const handleCompleteSession = (payload: {
    routine: StretchRoutine;
    durationMinutes: number;
    comfortRating: ComfortRating;
    note: string;
  }): MilestoneBadge[] => {
    const now = new Date();
    const todayISO = toLocalDateISO(now);

    const newSession: SessionLog = {
      id: `session-${Date.now()}`,
      routineId: payload.routine.id,
      routineTitle: payload.routine.title,
      zone: payload.routine.zone,
      dateISO: todayISO,
      completedAtISO: now.toISOString(),
      durationMinutes: payload.durationMinutes,
      posesCompleted: payload.routine.poses.length,
      comfortRating: payload.comfortRating,
      note: payload.note,
    };

    const prevUnlockedIds = new Set(milestones.filter((m) => m.unlocked).map((m) => m.id));
    const nextState: PracticeState = {
      ...state,
      sessions: [...state.sessions, newSession],
    };
    const nextMilestones = evaluateMilestones(nextState);
    const newlyUnlocked = nextMilestones.filter(
      (m) => m.unlocked && !prevUnlockedIds.has(m.id)
    );

    setState(nextState);
    return newlyUnlocked;
  };

  const handleLogBenchmark = (benchmarkId: string, value: number, note: string) => {
    const todayISO = toLocalDateISO();
    setState((prev) => ({
      ...prev,
      benchmarks: prev.benchmarks.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              entries: [
                ...b.entries,
                {
                  id: `entry-${Date.now()}`,
                  dateISO: todayISO,
                  value,
                  note: note || undefined,
                },
              ],
            }
          : b
      ),
    }));
  };

  const handleCreateCustomRoutine = (routine: StretchRoutine) => {
    setState((prev) => ({
      ...prev,
      customRoutines: [...prev.customRoutines, routine],
    }));
  };

  const handleDeleteCustomRoutine = (routineId: string) => {
    setState((prev) => ({
      ...prev,
      customRoutines: prev.customRoutines.filter((r) => r.id !== routineId),
    }));
  };

  const handleAddAppreciationNote = (text: string) => {
    const todayISO = toLocalDateISO();
    setState((prev) => ({
      ...prev,
      appreciationNotes: [
        { id: `note-${Date.now()}`, dateISO: todayISO, text },
        ...prev.appreciationNotes,
      ],
    }));
  };

  const handleDeleteAppreciationNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      appreciationNotes: prev.appreciationNotes.filter((n) => n.id !== noteId),
    }));
  };

  const handlePracticeZone = (zone: BodyZone) => {
    const match = allRoutines.find((r) => r.zone === zone) ?? allRoutines[0];
    setActiveRoutine(match);
  };

  const handleResetPracticeData = () => {
    setState((prev) => ({
      ...prev,
      sessions: [],
      appreciationNotes: [],
      benchmarks: prev.benchmarks.map((b) => ({ ...b, entries: [] })),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FA] text-[#111827] pb-[72px] md:pb-0">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onStartDaily={() => setActiveRoutine(recommendedRoutine)}
      />

      <main className="flex-1">
        {activeTab === 'today' && (
          <TodayView
            state={state}
            summary={summary}
            milestones={milestones}
            routines={allRoutines}
            recommendedRoutine={recommendedRoutine}
            onStartRoutine={setActiveRoutine}
            onInspectRoutine={(r) => {
              setInspectedRoutine(r);
              setActiveTab('routines');
            }}
            onOpenRoutines={() => setActiveTab('routines')}
            onOpenMilestones={() => setActiveTab('appreciation')}
          />
        )}

        {activeTab === 'routines' && (
          <RoutinesView
            routines={allRoutines}
            holdPace={state.holdPace}
            onChangeHoldPace={(pace: HoldPace) =>
              setState((prev) => ({ ...prev, holdPace: pace }))
            }
            onStartRoutine={setActiveRoutine}
            onCreateCustomRoutine={handleCreateCustomRoutine}
            onDeleteCustomRoutine={handleDeleteCustomRoutine}
            inspectedRoutine={inspectedRoutine}
            onInspectRoutine={setInspectedRoutine}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            state={state}
            summary={summary}
            onLogBenchmark={handleLogBenchmark}
            onUpdateWeeklyGoal={(goal) =>
              setState((prev) => ({ ...prev, weeklyGoal: goal }))
            }
            onPracticeZone={handlePracticeZone}
            onResetPracticeData={handleResetPracticeData}
          />
        )}

        {activeTab === 'appreciation' && (
          <AppreciationView
            state={state}
            summary={summary}
            milestones={milestones}
            onAddNote={handleAddAppreciationNote}
            onDeleteNote={handleDeleteAppreciationNote}
            onStartDaily={() => setActiveRoutine(recommendedRoutine)}
          />
        )}
      </main>

      <footer className="border-t border-[#E4E9EE] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#52606D]">
          <span>Supple · Guided Daily Mobility &amp; Flexibility Practice</span>
          <span>Move patiently within comfortable range · Stop if you feel sharp joint pain</span>
        </div>
      </footer>

      {activeRoutine && (
        <GuidedPlayer
          routine={activeRoutine}
          holdPace={state.holdPace}
          soundEnabled={state.soundEnabled}
          onToggleSound={() =>
            setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
          }
          onCompleteSession={handleCompleteSession}
          onClose={() => setActiveRoutine(null)}
        />
      )}
    </div>
  );
}
