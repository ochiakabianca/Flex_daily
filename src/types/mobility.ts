export type BodyZone =
  | 'Spine & Neck'
  | 'Hips & Pelvis'
  | 'Hamstrings & Legs'
  | 'Shoulders & Chest'
  | 'Full Body';

export type RoutineLevel = 'Gentle' | 'Moderate' | 'Focused';

export type HoldPace = 'gentle' | 'standard' | 'deep';

export type PoseKey =
  | 'cat-cow'
  | 'seated-twist'
  | 'neck-release'
  | 'thread-needle'
  | 'low-lunge'
  | 'pigeon-prep'
  | 'butterfly'
  | 'hip-90-90'
  | 'forward-fold'
  | 'half-split'
  | 'calf-wall'
  | 'childs-pose'
  | 'chest-opener'
  | 'overhead-lat'
  | 'supine-twist'
  | 'figure-four';

export interface StretchPose {
  id: string;
  name: string;
  zone: BodyZone;
  targetMuscles: string;
  defaultSeconds: number;
  bilateral: boolean;
  poseKey: PoseKey;
  cues: string[];
  breathPattern: string;
  modification: string;
}

export interface StretchRoutine {
  id: string;
  title: string;
  subtitle: string;
  zone: BodyZone;
  level: RoutineLevel;
  recommendedTime: 'Morning' | 'Midday' | 'Evening' | 'Anytime';
  image: string;
  isCustom?: boolean;
  poses: StretchPose[];
}

export type ComfortRating = 1 | 2 | 3;

export interface SessionLog {
  id: string;
  routineId: string;
  routineTitle: string;
  zone: BodyZone;
  dateISO: string; // YYYY-MM-DD in local time
  completedAtISO: string;
  durationMinutes: number;
  posesCompleted: number;
  comfortRating: ComfortRating;
  note: string;
}

export interface BenchmarkEntry {
  id: string;
  dateISO: string;
  value: number;
  note?: string;
}

export interface FlexibilityBenchmark {
  id: string;
  metricName: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  entries: BenchmarkEntry[];
}

export interface AppreciationNote {
  id: string;
  dateISO: string;
  text: string;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  criteriaLabel: string;
  category: 'Consistency' | 'Volume' | 'Balance' | 'Mobility';
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedDateISO?: string;
}

export interface PracticeState {
  sessions: SessionLog[];
  benchmarks: FlexibilityBenchmark[];
  customRoutines: StretchRoutine[];
  appreciationNotes: AppreciationNote[];
  weeklyGoal: number;
  holdPace: HoldPace;
  soundEnabled: boolean;
}
