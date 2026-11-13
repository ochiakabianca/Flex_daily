import { useMemo, useState } from 'react';
import { Check, Clock, Play, Plus, Trash2, X } from 'lucide-react';
import {
  HERO_STUDIO_IMAGE,
  POSE_CATALOG,
  getPoseHoldSeconds,
  getRoutineDurationMinutes,
} from '../data/routines';
import type { BodyZone, HoldPace, StretchPose, StretchRoutine } from '../types/mobility';
import { ALL_BODY_ZONES } from '../utils/stats';
import { PoseIllustration } from './PoseIllustration';
import { ResilientImage } from './ResilientImage';

interface RoutinesViewProps {
  routines: StretchRoutine[];
  holdPace: HoldPace;
  onChangeHoldPace: (pace: HoldPace) => void;
  onStartRoutine: (routine: StretchRoutine) => void;
  onCreateCustomRoutine: (routine: StretchRoutine) => void;
  onDeleteCustomRoutine: (routineId: string) => void;
  inspectedRoutine: StretchRoutine | null;
  onInspectRoutine: (routine: StretchRoutine | null) => void;
}

const ALL_POSES = Object.values(POSE_CATALOG);

export function RoutinesView({
  routines,
  holdPace,
  onChangeHoldPace,
  onStartRoutine,
  onCreateCustomRoutine,
  onDeleteCustomRoutine,
  inspectedRoutine,
  onInspectRoutine,
}: RoutinesViewProps) {
  const [selectedZone, setSelectedZone] = useState<'All' | BodyZone>('All');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customZone, setCustomZone] = useState<BodyZone>('Full Body');
  const [selectedPoseIds, setSelectedPoseIds] = useState<string[]>([
    'cat-cow',
    'low-lunge',
    'forward-fold',
    'childs-pose',
  ]);

  const filteredRoutines = useMemo(() => {
    if (selectedZone === 'All') return routines;
    return routines.filter((r) => r.zone === selectedZone);
  }, [routines, selectedZone]);

  const togglePoseInBuilder = (poseId: string) => {
    setSelectedPoseIds((prev) =>
      prev.includes(poseId) ? prev.filter((id) => id !== poseId) : [...prev, poseId]
    );
  };

  const handleSaveCustomRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPoseIds.length < 2) return;
    const poses: StretchPose[] = selectedPoseIds
      .map((id) => POSE_CATALOG[id])
      .filter(Boolean);
    const title = customTitle.trim() || `${customZone} Personal Flow`;
    const newRoutine: StretchRoutine = {
      id: `custom-${Date.now()}`,
      title,
      subtitle: `Custom ${poses.length}-pose mobility sequence tailored to ${customZone.toLowerCase()}.`,
      zone: customZone,
      level: 'Moderate',
      recommendedTime: 'Anytime',
      image: HERO_STUDIO_IMAGE,
      isCustom: true,
      poses,
    };
    onCreateCustomRoutine(newRoutine);
    setBuilderOpen(false);
    setCustomTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Header & Hold Pace Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E4E9EE]">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111827] [text-wrap:balance]">
            Stretching Routines
          </h1>
          <p className="text-[15px] text-[#52606D] leading-relaxed">
            Pick a structured mobility flow by target region, adjust hold length to match your energy, or build your own sequence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hold Pace Segmented Control */}
          <div
            role="group"
            aria-label="Pose hold duration"
            className="inline-flex items-center p-1 bg-[#EBF0F3] rounded-xl"
          >
            {(
              [
                { id: 'gentle', label: 'Gentle · 30s' },
                { id: 'standard', label: 'Standard · 45s' },
                { id: 'deep', label: 'Deep · 60s' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeHoldPace(opt.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  holdPace === opt.id
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#52606D] hover:text-[#111827]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setBuilderOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl border border-[#1B4D3E] text-[#1B4D3E] bg-white text-sm font-medium hover:bg-[#EDF4F2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Create Custom Flow</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', ...ALL_BODY_ZONES] as const).map((zone) => {
          const active = selectedZone === zone;
          return (
            <button
              key={zone}
              type="button"
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 min-h-[40px] rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#111827] text-white'
                  : 'bg-white border border-[#E4E9EE] text-[#52606D] hover:text-[#111827]'
              }`}
            >
              {zone === 'All' ? 'All Routines' : zone}
            </button>
          );
        })}
      </div>

      {/* Routine Grid */}
      {filteredRoutines.length === 0 ? (
        <div className="bg-white border border-[#E4E9EE] rounded-2xl p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#111827]">
            No routines match {selectedZone} yet
          </p>
          <p className="text-sm text-[#52606D]">
            Reset the filter or create a custom flow targeting {selectedZone}.
          </p>
          <button
            type="button"
            onClick={() => setSelectedZone('All')}
            className="px-4 py-2 min-h-[40px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium cursor-pointer"
          >
            Show All Routines
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => {
            const mins = getRoutineDurationMinutes(routine, holdPace);
            return (
              <article
                key={routine.id}
                className="bg-white border border-[#E4E9EE] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#C5D0DA] transition-colors"
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
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#52606D]">
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        <span>{routine.zone}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{mins} min</span>
                        <span aria-hidden="true">·</span>
                        <span>{routine.poses.length} poses</span>
                      </div>
                      {routine.isCustom && (
                        <button
                          type="button"
                          onClick={() => onDeleteCustomRoutine(routine.id)}
                          aria-label={`Delete ${routine.title}`}
                          className="text-[#6B7785] hover:text-[#DC2626] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-[#111827]">
                      {routine.title}
                    </h2>
                    <p className="text-sm text-[#52606D] leading-relaxed">
                      {routine.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onStartRoutine(routine)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>Start Routine</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectRoutine(routine)}
                    className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#D5DCE2] text-sm font-medium text-[#111827] hover:bg-[#F7F9FA] transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Routine Preview Modal */}
      {inspectedRoutine && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-routine-title"
        >
          <div className="bg-white border border-[#E4E9EE] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#EEF2F5] flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#52606D]">
                  {inspectedRoutine.zone} ·{' '}
                  <span className="font-mono tabular-nums">
                    {getRoutineDurationMinutes(inspectedRoutine, holdPace)} min
                  </span>{' '}
                  · {inspectedRoutine.level}
                </p>
                <h2
                  id="preview-routine-title"
                  className="font-display text-2xl font-semibold text-[#111827] mt-1"
                >
                  {inspectedRoutine.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onInspectRoutine(null)}
                aria-label="Close routine preview"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#52606D] hover:bg-[#F1F5F8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto divide-y divide-[#EEF2F5]">
              {inspectedRoutine.poses.map((pose, idx) => {
                const secs = getPoseHoldSeconds(pose, holdPace);
                return (
                  <div key={`${pose.id}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-20 h-16 shrink-0 bg-[#F8FAFB] border border-[#EEF2F5] rounded-xl p-1">
                      <PoseIllustration poseKey={pose.poseKey} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-base font-semibold text-[#111827] truncate">
                          {idx + 1}. {pose.name}
                        </h3>
                        <span className="font-mono text-xs text-[#52606D] tabular-nums shrink-0 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {secs}s {pose.bilateral ? '× 2 sides' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-[#52606D] mt-0.5">{pose.targetMuscles}</p>
                      <p className="text-xs text-[#1B4D3E] mt-1">{pose.cues[0]}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 border-t border-[#EEF2F5] bg-[#F8FAFB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onInspectRoutine(null)}
                className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#D5DCE2] bg-white text-sm font-medium text-[#111827] hover:bg-[#F1F5F8] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = inspectedRoutine;
                  onInspectRoutine(null);
                  onStartRoutine(target);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Start This Routine</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Routine Builder Modal */}
      {builderOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-builder-title"
        >
          <form
            onSubmit={handleSaveCustomRoutine}
            className="bg-white border border-[#E4E9EE] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-[#EEF2F5] flex items-center justify-between gap-4">
              <div>
                <h2 id="custom-builder-title" className="font-display text-2xl font-semibold text-[#111827]">
                  Build Custom Flow
                </h2>
                <p className="text-xs text-[#52606D] mt-0.5">
                  Select 2 or more stretches to assemble your personal daily sequence.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBuilderOpen(false)}
                aria-label="Close custom flow builder"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#52606D] hover:bg-[#F1F5F8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="custom-routine-name" className="block text-xs font-medium text-[#52606D] mb-1.5">
                    Routine Name
                  </label>
                  <input
                    id="custom-routine-name"
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Post-Work Neck & Hip Reset"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DCE2] text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E]"
                  />
                </div>
                <div>
                  <label htmlFor="custom-routine-zone" className="block text-xs font-medium text-[#52606D] mb-1.5">
                    Primary Focus Zone
                  </label>
                  <select
                    id="custom-routine-zone"
                    value={customZone}
                    onChange={(e) => setCustomZone(e.target.value as BodyZone)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DCE2] text-sm text-[#111827] bg-white focus:outline-none focus:border-[#1B4D3E]"
                  >
                    {ALL_BODY_ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#52606D]">
                    Choose Stretches ({selectedPoseIds.length} selected)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_POSES.map((pose) => {
                    const selected = selectedPoseIds.includes(pose.id);
                    return (
                      <button
                        key={pose.id}
                        type="button"
                        onClick={() => togglePoseInBuilder(pose.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#1B4D3E] bg-[#EDF4F2]/60 text-[#111827]'
                            : 'border-[#E4E9EE] bg-white text-[#52606D] hover:border-[#C5D0DA]'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111827] truncate">{pose.name}</p>
                          <p className="text-xs text-[#52606D] truncate">
                            {pose.zone} · {getPoseHoldSeconds(pose, holdPace)}s
                            {pose.bilateral ? ' × 2' : ''}
                          </p>
                        </div>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            selected ? 'bg-[#1B4D3E] text-white' : 'border border-[#CBD5E1]'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#EEF2F5] bg-[#F8FAFB] flex items-center justify-between gap-3">
              <span className="text-xs text-[#52606D]">
                {selectedPoseIds.length < 2
                  ? 'Select at least 2 stretches to save.'
                  : `${selectedPoseIds.length} poses ready`}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBuilderOpen(false)}
                  className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#D5DCE2] bg-white text-sm font-medium text-[#111827] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedPoseIds.length < 2}
                  className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] disabled:opacity-45 cursor-pointer"
                >
                  Save Custom Flow
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
