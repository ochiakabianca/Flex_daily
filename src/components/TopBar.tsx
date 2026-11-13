import { Award, Calendar, Compass, Play, Sun } from 'lucide-react';

export type AppTab = 'today' | 'routines' | 'progress' | 'appreciation';

interface TopBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onStartDaily: () => void;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'routines', label: 'Routines' },
  { id: 'progress', label: 'Progress' },
  { id: 'appreciation', label: 'Milestones' },
];

export function TopBar({ activeTab, onSelectTab, onStartDaily }: TopBarProps) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[#F7F9FA]/95 backdrop-blur-md border-b border-[#E4E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('today')}
            className="font-display text-xl font-semibold tracking-tight text-[#111827] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4D3E] cursor-pointer"
          >
            Supple
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4D3E] ${
                    isActive
                      ? 'text-[#111827]'
                      : 'text-[#52606D] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4D3E]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onStartDaily}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#143B2F] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4D3E]"
            >
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Start Daily Stretch</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom thumb-zone tab bar (strictly 60px height, <=15% viewport cap) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4E9EE] h-[60px] grid grid-cols-4 items-center"
        aria-label="Mobile navigation"
      >
        <button
          type="button"
          onClick={() => onSelectTab('today')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
            activeTab === 'today' ? 'text-[#1B4D3E]' : 'text-[#52606D]'
          }`}
        >
          <Sun className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'today' ? 2.2 : 1.75} />
          <span>Today</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('routines')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
            activeTab === 'routines' ? 'text-[#1B4D3E]' : 'text-[#52606D]'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'routines' ? 2.2 : 1.75} />
          <span>Routines</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('progress')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
            activeTab === 'progress' ? 'text-[#1B4D3E]' : 'text-[#52606D]'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'progress' ? 2.2 : 1.75} />
          <span>Progress</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('appreciation')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
            activeTab === 'appreciation' ? 'text-[#1B4D3E]' : 'text-[#52606D]'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'appreciation' ? 2.2 : 1.75} />
          <span>Milestones</span>
        </button>
      </nav>
    </>
  );
}
