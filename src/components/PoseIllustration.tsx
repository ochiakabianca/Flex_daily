import type { PoseKey } from '../types/mobility';

interface PoseIllustrationProps {
  poseKey: PoseKey;
  breathPhase?: 'inhale' | 'exhale';
  className?: string;
}

export function PoseIllustration({
  poseKey,
  breathPhase = 'inhale',
  className = '',
}: PoseIllustrationProps) {
  const strokePrimary = '#1E293B';
  const strokeAccent = '#1B4D3E';
  const matColor = '#CBD5E1';

  const renderPoseGeometry = () => {
    switch (poseKey) {
      case 'neck-release':
        return (
          <g>
            {/* Seated cross-legged base */}
            <path d="M 85 162 Q 115 150 155 162" stroke={strokePrimary} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 92 166 L 148 166" stroke={strokePrimary} strokeWidth="5" strokeLinecap="round" />
            {/* Torso upright */}
            <path d="M 120 160 L 120 105" stroke={strokePrimary} strokeWidth="6" strokeLinecap="round" />
            {/* Tilted head & neck release */}
            <circle cx="130" cy="76" r="13" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            <path d="M 120 105 Q 123 93 128 88" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Shoulder & hand reaching softly to temple */}
            <path d="M 120 112 L 100 132 L 90 156" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 120 112 L 146 95 L 136 74" stroke={strokeAccent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Gentle directional arc */}
            <path d="M 148 68 Q 158 78 154 90" stroke={strokeAccent} strokeWidth="2" strokeDasharray="3 3" fill="none" />
          </g>
        );
      case 'cat-cow':
        return (
          <g>
            {/* Arms & thighs vertical */}
            <path d="M 80 162 L 80 112" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 162 162 L 162 118 L 178 162" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Arched / rounded spine curve */}
            <path d="M 80 112 Q 122 86 162 118" stroke={strokeAccent} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            {/* Head */}
            <circle cx="64" cy="112" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Spine motion wave hint */}
            <path d="M 105 85 Q 122 76 139 85" stroke={strokeAccent} strokeWidth="2" strokeDasharray="3 3" fill="none" />
          </g>
        );
      case 'thread-needle':
        return (
          <g>
            {/* Knees and hips high */}
            <path d="M 158 162 L 154 114 L 174 162" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Low torso twisting */}
            <path d="M 154 114 L 94 148" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            {/* Head resting near mat */}
            <circle cx="84" cy="148" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Threading arm across floor */}
            <path d="M 104 140 L 146 158" stroke={strokeAccent} strokeWidth="4" strokeLinecap="round" />
            {/* Supporting arm bent overhead */}
            <path d="M 102 138 L 80 110 L 96 158" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      case 'seated-twist':
        return (
          <g>
            {/* Crossed legs */}
            <path d="M 82 162 Q 116 146 152 162" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 96 162 L 126 128 L 144 162" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Tall twisted spine */}
            <path d="M 118 160 L 118 102" stroke={strokeAccent} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="118" cy="82" r="12" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Arms wrapping and posting behind */}
            <path d="M 118 110 L 146 130 L 160 162" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 118 110 L 98 130 L 124 134" stroke={strokeAccent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      case 'low-lunge':
        return (
          <g>
            {/* Back leg extended along mat */}
            <path d="M 60 162 L 106 162 L 122 126" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Front bent knee stacked over ankle */}
            <path d="M 122 126 L 164 126 L 164 162" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Upright torso */}
            <path d="M 122 126 L 122 82" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="122" cy="64" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Hands on front knee */}
            <path d="M 122 92 L 146 112 L 160 124" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      case 'hip-90-90':
        return (
          <g>
            {/* Front shin parallel */}
            <path d="M 100 160 L 144 160 L 164 148" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Back leg 90-90 */}
            <path d="M 100 160 L 72 152 L 58 164" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hinged tall torso */}
            <path d="M 100 160 L 118 104" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="124" cy="86" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Hands balancing forward */}
            <path d="M 114 114 L 138 136 L 146 158" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      case 'pigeon-prep':
        return (
          <g>
            {/* Extended back leg */}
            <path d="M 48 162 L 116 156" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" />
            {/* Front folded shin */}
            <path d="M 116 156 L 154 150 L 142 162" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Folded torso resting forward */}
            <path d="M 116 156 L 166 128" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="176" cy="118" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Forearms on mat */}
            <path d="M 152 134 L 170 158 L 188 162" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      case 'butterfly':
        return (
          <g>
            {/* Diamond knees and heels */}
            <path d="M 86 156 L 120 162 L 154 156" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 86 156 L 120 144 L 154 156" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Upright spine hinging */}
            <path d="M 120 148 L 120 94" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="120" cy="76" r="11.5" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Hands holding ankles */}
            <path d="M 120 104 L 100 132 L 116 156" stroke={strokePrimary} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 120 104 L 140 132 L 124 156" stroke={strokePrimary} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
      case 'forward-fold':
        return (
          <g>
            {/* Extended straight legs */}
            <path d="M 74 162 L 178 162" stroke={strokeAccent} strokeWidth="5" strokeLinecap="round" />
            <path d="M 178 162 L 180 148" stroke={strokePrimary} strokeWidth="4" strokeLinecap="round" />
            {/* Hinged torso */}
            <path d="M 74 162 Q 112 122 146 130" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <circle cx="158" cy="128" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Arms reaching calmly toward feet/shins */}
            <path d="M 134 132 L 166 154" stroke={strokeAccent} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case 'half-split':
        return (
          <g>
            {/* Kneeling back leg */}
            <path d="M 68 162 L 96 162 L 96 124" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Extended front leg */}
            <path d="M 96 124 L 174 162" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 174 162 L 176 150" stroke={strokeAccent} strokeWidth="3.5" strokeLinecap="round" />
            {/* Long hinged spine */}
            <path d="M 96 124 L 142 104" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="156" cy="98" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Hands framing front shin */}
            <path d="M 130 109 L 138 158" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case 'calf-wall':
        return (
          <g>
            {/* Inverted V alignment */}
            <path d="M 56 162 L 116 86 L 176 162" stroke={strokePrimary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Highlighted calf/heel pressing down */}
            <path d="M 146 124 L 176 162" stroke={strokeAccent} strokeWidth="5.5" strokeLinecap="round" />
            {/* Head between arms */}
            <circle cx="88" cy="120" r="10.5" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            <path d="M 176 152 L 176 162" stroke={strokeAccent} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'childs-pose':
        return (
          <g>
            {/* Folded knees & shins */}
            <path d="M 64 162 L 106 162 L 88 134" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Rounded resting back */}
            <path d="M 88 134 Q 118 124 148 148" stroke={strokeAccent} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            {/* Head resting */}
            <circle cx="154" cy="151" r="10" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Arms extended overhead on mat */}
            <path d="M 142 146 L 194 160" stroke={strokeAccent} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'chest-opener':
        return (
          <g>
            {/* Kneeling base */}
            <path d="M 94 162 L 122 162 L 122 122" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Broad upright chest */}
            <path d="M 122 122 L 124 78" stroke={strokePrimary} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="126" cy="60" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Arms clasped behind back opening chest */}
            <path d="M 123 86 L 94 108 L 114 126" stroke={strokeAccent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 136 86 Q 148 92 144 104" stroke={strokeAccent} strokeWidth="2" strokeDasharray="3 3" fill="none" />
          </g>
        );
      case 'overhead-lat':
        return (
          <g>
            {/* Seated cross-legged base */}
            <path d="M 86 162 Q 120 150 154 162" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Curved side-bending spine */}
            <path d="M 120 160 Q 116 126 132 98" stroke={strokeAccent} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <circle cx="136" cy="80" r="11" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Supporting hand on mat */}
            <path d="M 126 108 L 154 134 L 164 162" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Overhead reaching arm */}
            <path d="M 126 106 Q 134 62 164 68" stroke={strokeAccent} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'supine-twist':
        return (
          <g>
            {/* Reclined torso & extended leg */}
            <path d="M 52 158 L 138 158" stroke={strokePrimary} strokeWidth="5" strokeLinecap="round" />
            <circle cx="156" cy="154" r="10.5" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Bent knee rotating across */}
            <path d="M 110 158 L 106 118 L 80 126" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Extended stabilizing arm */}
            <path d="M 136 154 L 166 130" stroke={strokePrimary} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case 'figure-four':
        return (
          <g>
            {/* Reclined torso & head */}
            <path d="M 102 158 L 166 158" stroke={strokePrimary} strokeWidth="5" strokeLinecap="round" />
            <circle cx="180" cy="152" r="10" stroke={strokePrimary} strokeWidth="3.5" fill="#F8FAFB" />
            {/* Supporting bent leg */}
            <path d="M 102 158 L 76 116 L 54 148" stroke={strokePrimary} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Crossed figure-four leg */}
            <path d="M 102 158 L 96 122 L 76 116" stroke={strokeAccent} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hands behind thigh */}
            <path d="M 148 154 L 116 136 L 86 128" stroke={strokePrimary} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 240 190"
      className={`w-full h-auto ${className}`}
      aria-hidden="true"
    >
      {/* Subtle breath halo behind posture */}
      <circle
        cx="120"
        cy="108"
        r={breathPhase === 'inhale' ? 68 : 54}
        fill="#1B4D3E"
        fillOpacity={breathPhase === 'inhale' ? 0.06 : 0.03}
        className="transition-all duration-[3500ms] ease-in-out"
      />
      {/* Clean yoga mat baseline */}
      <line x1="28" y1="164" x2="212" y2="164" stroke={matColor} strokeWidth="4" strokeLinecap="round" />
      {renderPoseGeometry()}
    </svg>
  );
}
