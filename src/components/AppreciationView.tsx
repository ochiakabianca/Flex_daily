import { useState } from 'react';
import { Award, CheckCircle2, Flame, HeartHandshake, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import type { MilestoneBadge, PracticeState } from '../types/mobility';
import type { StreakSummary } from '../utils/stats';
import { getAppreciationMessage } from '../utils/stats';

interface AppreciationViewProps {
  state: PracticeState;
  summary: StreakSummary;
  milestones: MilestoneBadge[];
  onAddNote: (text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onStartDaily: () => void;
}

export function AppreciationView({
  state,
  summary,
  milestones,
  onAddNote,
  onDeleteNote,
  onStartDaily,
}: AppreciationViewProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in-progress'>('all');
  const [noteInput, setNoteInput] = useState('');

  const appreciation = getAppreciationMessage(summary, state);
  const unlockedCount = milestones.filter((m) => m.unlocked).length;

  const visibleMilestones = milestones.filter((m) => {
    if (filter === 'unlocked') return m.unlocked;
    if (filter === 'in-progress') return !m.unlocked;
    return true;
  });

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNoteInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      {/* Section 1: Consistency Appreciation Banner */}
      <section className="bg-white border border-[#E4E9EE] rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[#1B4D3E]">
            <HeartHandshake className="w-4 h-4" aria-hidden="true" />
            <span>Consistency Appreciation</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111827] [text-wrap:balance]">
            {appreciation.headline}
          </h1>
          <p className="text-[15px] text-[#52606D] leading-relaxed max-w-2xl">
            {appreciation.body}
          </p>
        </div>

        <div className="lg:col-span-4 bg-[#F8FAFB] border border-[#EEF2F5] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#52606D]">Milestones Earned</span>
            <span className="font-mono text-sm font-semibold text-[#111827] tabular-nums">
              {unlockedCount} / {milestones.length}
            </span>
          </div>
          <div className="h-2 w-full bg-[#E4E9EE] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B4D3E] rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((unlockedCount / Math.max(1, milestones.length)) * 100)}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E4E9EE]">
            <div>
              <span className="text-[11px] text-[#52606D] block">Active Streak</span>
              <span className="inline-flex items-center gap-1 font-mono text-base font-semibold text-[#111827] tabular-nums mt-0.5">
                <Flame className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
                {summary.currentStreak}d
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#52606D] block">Grace Shield</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1B4D3E] mt-0.5">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                {summary.graceShieldEarned ? 'Protected' : 'Locked'}
              </span>
            </div>
          </div>
          {!summary.practicedToday && (
            <button
              type="button"
              onClick={onStartDaily}
              className="w-full py-2.5 min-h-[42px] rounded-xl bg-[#1B4D3E] text-white text-xs font-medium hover:bg-[#143B2F] transition-colors cursor-pointer"
            >
              Complete Today&apos;s Stretch
            </button>
          )}
        </div>
      </section>

      {/* Section 2: Milestone Recognition Gallery */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#111827]">
              Practice Milestones
            </h2>
            <p className="text-sm text-[#52606D] mt-1">
              Milestones celebrate steady attendance, balanced body care, and patient observation.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter milestones"
            className="inline-flex items-center p-1 bg-[#EBF0F3] rounded-xl self-start sm:self-auto"
          >
            {(
              [
                { id: 'all', label: `All (${milestones.length})` },
                { id: 'unlocked', label: `Earned (${unlockedCount})` },
                { id: 'in-progress', label: `In Progress (${milestones.length - unlockedCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#52606D] hover:text-[#111827]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleMilestones.map((badge) => {
            const pct = Math.min(100, Math.round((badge.progress / badge.target) * 100));
            return (
              <article
                key={badge.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  badge.unlocked
                    ? 'bg-white border-[#1B4D3E]/30'
                    : 'bg-[#F8FAFB] border-[#E4E9EE]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#52606D]">{badge.category}</span>
                    {badge.unlocked ? (
                      <span className="inline-flex items-center gap-1 font-medium text-[#1B4D3E]">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Earned</span>
                      </span>
                    ) : (
                      <span className="text-[#6B7785] font-medium">In Progress</span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        badge.unlocked
                          ? 'bg-[#EDF4F2] text-[#1B4D3E]'
                          : 'bg-[#EEF2F5] text-[#6B7785]'
                      }`}
                    >
                      <Award className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-[#111827]">
                        {badge.title}
                      </h3>
                      <p className="text-xs text-[#52606D] mt-0.5 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#EEF2F5]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#52606D]">{badge.criteriaLabel}</span>
                    <span className="font-mono font-semibold text-[#111827] tabular-nums">
                      {badge.progress}/{badge.target}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E4E9EE] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        badge.unlocked ? 'bg-[#1B4D3E]' : 'bg-[#64748B]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {badge.unlocked && badge.unlockedDateISO && (
                    <p className="text-[11px] font-mono text-[#52606D] tabular-nums">
                      Earned on {badge.unlockedDateISO}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Section 3: Personal Appreciation & Intention Notes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-[#E4E9EE] rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#111827]">
              Appreciation &amp; Why Notes
            </h2>
            <p className="text-xs text-[#52606D] mt-1 leading-relaxed">
              Capture small physical wins or personal reminders to stay encouraged on low-energy mornings.
            </p>
          </div>

          <form onSubmit={handleSubmitNote} className="space-y-3">
            <label htmlFor="appreciation-note-input" className="sr-only">
              Write a personal appreciation note
            </label>
            <textarea
              id="appreciation-note-input"
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. My lower back feels noticeably calmer after morning cat-cow..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DCE2] text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E]"
            />
            <button
              type="submit"
              disabled={!noteInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#111827] text-white text-sm font-medium hover:bg-[#1B4D3E] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Pin Appreciation Note</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white border border-[#E4E9EE] rounded-2xl divide-y divide-[#EEF2F5]">
          {state.appreciationNotes.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#52606D]">
              No pinned reflections yet. Add a small note about how your body feels today.
            </div>
          ) : (
            state.appreciationNotes.map((note) => (
              <div key={note.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-[#52606D] tabular-nums">{note.dateISO}</p>
                  <p className="text-sm text-[#111827] leading-relaxed">{note.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note.id)}
                  aria-label="Delete appreciation note"
                  className="p-2 text-[#6B7785] hover:text-[#DC2626] rounded-lg cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
