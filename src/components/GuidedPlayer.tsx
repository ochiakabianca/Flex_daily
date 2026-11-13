import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Plus,
  Volume2,
  VolumeX,
  Wind,
  X,
} from 'lucide-react';
import { getPoseHoldSeconds } from '../data/routines';
import type {
  ComfortRating,
  HoldPace,
  MilestoneBadge,
  StretchPose,
  StretchRoutine,
} from '../types/mobility';
import { playSoftChime } from '../utils/sound';
import { PoseIllustration } from './PoseIllustration';

interface GuidedStep {
  pose: StretchPose;
  sideLabel: 'Left Side' | 'Right Side' | 'Both Sides';
  durationSeconds: number;
  poseIndex: number;
}

interface GuidedPlayerProps {
  routine: StretchRoutine;
  holdPace: HoldPace;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteSession: (payload: {
    routine: StretchRoutine;
    durationMinutes: number;
    comfortRating: ComfortRating;
    note: string;
  }) => MilestoneBadge[];
  onClose: () => void;
}

const PREP_SECONDS = 5;

export function GuidedPlayer({
  routine,
  holdPace,
  soundEnabled,
  onToggleSound,
  onCompleteSession,
  onClose,
}: GuidedPlayerProps) {
  const steps: GuidedStep[] = useMemo(() => {
    const list: GuidedStep[] = [];
    routine.poses.forEach((pose, idx) => {
      const secs = getPoseHoldSeconds(pose, holdPace);
      if (pose.bilateral) {
        list.push({ pose, sideLabel: 'Left Side', durationSeconds: secs, poseIndex: idx });
        list.push({ pose, sideLabel: 'Right Side', durationSeconds: secs, poseIndex: idx });
      } else {
        list.push({ pose, sideLabel: 'Both Sides', durationSeconds: secs, poseIndex: idx });
      }
    });
    return list;
  }, [routine, holdPace]);

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<'prep' | 'hold' | 'done'>('prep');
  const [secondsLeft, setSecondsLeft] = useState(PREP_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Completion form state
  const [comfortRating, setComfortRating] = useState<ComfortRating>(2);
  const [reflectionNote, setReflectionNote] = useState('');
  const [savedMilestones, setSavedMilestones] = useState<MilestoneBadge[] | null>(null);

  const currentStep = steps[stepIndex] ?? steps[0];

  // Breath rhythm cycle (4s inhale, 6s exhale)
  useEffect(() => {
    if (isPaused || phase === 'done') return;
    const cycleSec = elapsedSeconds % 10;
    setBreathPhase(cycleSec < 4 ? 'inhale' : 'exhale');
  }, [elapsedSeconds, isPaused, phase]);

  // Countdown tick
  useEffect(() => {
    if (isPaused || phase === 'done') return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition when hitting 0
        if (phase === 'prep') {
          playSoftChime('transition', soundEnabled);
          setPhase('hold');
          return currentStep.durationSeconds;
        }

        // Finished current hold step
        const nextIdx = stepIndex + 1;
        if (nextIdx >= steps.length) {
          playSoftChime('complete', soundEnabled);
          setPhase('done');
          return 0;
        }

        const nextStep = steps[nextIdx];
        const isSamePoseSideSwitch = nextStep.poseIndex === currentStep.poseIndex;
        playSoftChime(isSamePoseSideSwitch ? 'side' : 'transition', soundEnabled);
        setStepIndex(nextIdx);
        setPhase('prep');
        return PREP_SECONDS;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPaused, phase, stepIndex, steps, currentStep, soundEnabled]);

  const jumpToStep = (targetIndex: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, targetIndex));
    setStepIndex(clamped);
    setPhase('prep');
    setSecondsLeft(PREP_SECONDS);
    setIsPaused(false);
  };

  const handleExtendHold = () => {
    if (phase === 'prep') {
      setPhase('hold');
      setSecondsLeft(currentStep.durationSeconds + 15);
    } else {
      setSecondsLeft((s) => s + 15);
    }
  };

  const handleFinishAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedMins = Math.max(1, Math.round(elapsedSeconds / 60)) || Math.max(3, Math.round(
      steps.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    ));
    const newlyUnlocked = onCompleteSession({
      routine,
      durationMinutes: estimatedMins,
      comfortRating,
      note: reflectionNote.trim(),
    });
    setSavedMilestones(newlyUnlocked);
  };

  const totalDurationForPhase = phase === 'prep' ? PREP_SECONDS : currentStep.durationSeconds;
  const progressRatio = Math.max(0, Math.min(1, 1 - secondsLeft / Math.max(1, totalDurationForPhase)));
  const ringRadius = 78;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progressRatio);

  if (phase === 'done') {
    if (savedMilestones !== null) {
      return (
        <div className="fixed inset-0 z-50 bg-[#F7F9FA] overflow-y-auto flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-lg w-full bg-white border border-[#E4E9EE] rounded-2xl p-8 text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EDF4F2] text-[#1B4D3E] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#111827]">
                Session Logged &amp; Celebrated
              </h2>
              <p className="text-sm text-[#52606D] leading-relaxed">
                You completed <span className="font-medium text-[#111827]">{routine.title}</span>. Every calm minute compounds into lasting ease.
              </p>
            </div>

            {savedMilestones.length > 0 && (
              <div className="bg-[#EDF4F2] border border-[#1B4D3E]/20 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4D3E]">
                  <Award className="w-4 h-4" />
                  <span>New Consistency Milestone Earned</span>
                </div>
                {savedMilestones.map((m) => (
                  <div key={m.id}>
                    <p className="font-display text-base font-semibold text-[#111827]">
                      {m.title}
                    </p>
                    <p className="text-xs text-[#52606D]">{m.description}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 min-h-[46px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] transition-colors cursor-pointer"
            >
              Return to Practice Overview
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-[#F7F9FA] overflow-y-auto flex items-center justify-center p-4 sm:p-8">
        <form
          onSubmit={handleFinishAndSave}
          className="max-w-xl w-full bg-white border border-[#E4E9EE] rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#1B4D3E]">Routine Complete</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#111827]">
              How did your body feel today?
            </h2>
            <p className="text-sm text-[#52606D]">
              Logging a quick reflection helps track how your flexibility responds over weeks.
            </p>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#52606D]">
              Range &amp; Ease Check-in
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { rating: 1 as ComfortRating, label: 'Tight', hint: 'Resisting stretch' },
                  { rating: 2 as ComfortRating, label: 'Steady', hint: 'Comfortable tension' },
                  { rating: 3 as ComfortRating, label: 'Open', hint: 'Smooth & relaxed' },
                ]
              ).map((opt) => {
                const active = comfortRating === opt.rating;
                return (
                  <button
                    key={opt.rating}
                    type="button"
                    onClick={() => setComfortRating(opt.rating)}
                    className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-[#1B4D3E] bg-[#EDF4F2] text-[#111827]'
                        : 'border-[#E4E9EE] bg-white text-[#52606D] hover:border-[#C5D0DA]'
                    }`}
                  >
                    <p className="font-display text-sm font-semibold text-[#111827]">
                      {opt.label}
                    </p>
                    <p className="text-xs text-[#52606D] mt-0.5">{opt.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="session-reflection-note" className="block text-xs font-medium text-[#52606D] mb-1.5">
              Optional Practice Note
            </label>
            <textarea
              id="session-reflection-note"
              rows={3}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="e.g. Left hip opened smoothly after 30 seconds; shoulders felt lighter."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DCE2] text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[#D5DCE2] text-sm font-medium text-[#52606D] hover:text-[#111827] cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 min-h-[44px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] cursor-pointer"
            >
              Save Session &amp; Update Streak
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F9FA] flex flex-col">
      {/* Top Studio Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-[#E4E9EE] bg-white flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit guided session"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border border-[#E4E9EE] text-[#111827] hover:bg-[#F7F9FA] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p className="font-display text-sm sm:text-base font-semibold text-[#111827] truncate">
              {routine.title}
            </p>
            <p className="text-xs text-[#52606D] font-mono tabular-nums">
              Step {stepIndex + 1} of {steps.length} · {currentStep.sideLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute transition chimes' : 'Enable transition chimes'}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl border border-[#E4E9EE] text-xs font-medium text-[#111827] hover:bg-[#F7F9FA] cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#1B4D3E]" /> : <VolumeX className="w-4 h-4 text-[#6B7785]" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chimes On' : 'Muted'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPhase('done')}
            className="px-3.5 py-2 min-h-[40px] rounded-xl border border-[#E4E9EE] text-xs font-medium text-[#111827] hover:bg-[#F7F9FA] cursor-pointer whitespace-nowrap"
          >
            Finish Early
          </button>
        </div>
      </header>

      {/* Main Studio Stage */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Anatomical Illustration & Form Checkpoints */}
          <div className="lg:col-span-7 bg-white border border-[#E4E9EE] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#1B4D3E]">
                  {currentStep.pose.zone} · {currentStep.sideLabel}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#111827] mt-1">
                  {currentStep.pose.name}
                </h1>
                <p className="text-xs text-[#52606D] mt-1">
                  Targets: {currentStep.pose.targetMuscles}
                </p>
              </div>
            </div>

            <div className="bg-[#F8FAFB] border border-[#EEF2F5] rounded-xl p-4 sm:p-6">
              <PoseIllustration
                poseKey={currentStep.pose.poseKey}
                breathPhase={breathPhase}
                className="max-h-[220px] mx-auto"
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-[#52606D]">Form Alignment Cues</h2>
              <ul className="space-y-2">
                {currentStep.pose.cues.map((cue, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#111827] leading-relaxed">
                    <span className="font-mono text-xs text-[#1B4D3E] font-semibold mt-0.5 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#52606D] pt-2 border-t border-[#EEF2F5]">
                Gentle option: {currentStep.pose.modification}
              </p>
            </div>
          </div>

          {/* Right: Countdown Ring, Breath Pace & Controls */}
          <div className="lg:col-span-5 bg-white border border-[#E4E9EE] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#1B4D3E]">
                {phase === 'prep' ? 'Get Into Position' : 'Hold & Breathe'}
              </p>
              <p className="text-xs text-[#52606D]">{currentStep.pose.breathPattern}</p>
            </div>

            {/* SVG Radial Countdown */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 180 180" aria-hidden="true">
                <circle
                  cx="90"
                  cy="90"
                  r={ringRadius}
                  fill="none"
                  stroke="#EEF2F5"
                  strokeWidth="8"
                />
                <circle
                  cx="90"
                  cy="90"
                  r={ringRadius}
                  fill="none"
                  stroke={phase === 'prep' ? '#B45309' : '#1B4D3E'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  className="transition-[stroke-dashoffset] duration-700 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-semibold text-[#111827] tabular-nums">
                  00:{String(secondsLeft).padStart(2, '0')}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52606D] mt-1">
                  <Wind className="w-3.5 h-3.5 text-[#1B4D3E]" aria-hidden="true" />
                  <span>{breathPhase === 'inhale' ? 'Slow inhale' : 'Long exhale'}</span>
                </span>
              </div>
            </div>

            {/* Primary Transport Controls */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => jumpToStep(stepIndex - 1)}
                  disabled={stepIndex === 0}
                  aria-label="Previous stretch"
                  className="w-12 h-12 rounded-xl border border-[#D5DCE2] flex items-center justify-center text-[#111827] hover:bg-[#F7F9FA] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex-1 h-12 rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (stepIndex + 1 >= steps.length) {
                      setPhase('done');
                    } else {
                      jumpToStep(stepIndex + 1);
                    }
                  }}
                  aria-label="Next stretch"
                  className="w-12 h-12 rounded-xl border border-[#D5DCE2] flex items-center justify-center text-[#111827] hover:bg-[#F7F9FA] cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleExtendHold}
                className="w-full py-2.5 min-h-[40px] rounded-xl border border-[#E4E9EE] text-xs font-medium text-[#52606D] hover:text-[#111827] hover:bg-[#F7F9FA] inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add 15 Seconds to Current Hold</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Step Timeline */}
      <footer className="border-t border-[#E4E9EE] bg-white px-4 sm:px-8 py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto">
          {steps.map((s, idx) => {
            const isCurrent = idx === stepIndex;
            const isDone = idx < stepIndex;
            return (
              <button
                key={`${s.pose.id}-${s.sideLabel}-${idx}`}
                type="button"
                onClick={() => jumpToStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1B4D3E] text-white'
                    : isDone
                    ? 'bg-[#EDF4F2] text-[#1B4D3E]'
                    : 'bg-[#F1F5F8] text-[#52606D] hover:text-[#111827]'
                }`}
              >
                {idx + 1}. {s.pose.name.split(' ')[0]}{' '}
                {s.sideLabel !== 'Both Sides' ? `(${s.sideLabel[0]})` : ''}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
