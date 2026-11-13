import heroStudioImg from '../assets/images/hero_mobility_studio_1794567572863.jpg';
import morningSpineImg from '../assets/images/routine_morning_spine_1794567574166.jpg';
import hipOpenerImg from '../assets/images/routine_hip_opener_1794567573807.jpg';
import hamstringFlowImg from '../assets/images/routine_hamstring_flow_1794567574295.jpg';
import eveningReleaseImg from '../assets/images/routine_evening_release_1794567575016.jpg';
import type {
  FlexibilityBenchmark,
  HoldPace,
  PracticeState,
  SessionLog,
  StretchPose,
  StretchRoutine,
} from '../types/mobility';

export const HERO_STUDIO_IMAGE = heroStudioImg;

export const POSE_CATALOG: Record<string, StretchPose> = {
  'neck-release': {
    id: 'neck-release',
    name: 'Seated Lateral Neck Release',
    zone: 'Spine & Neck',
    targetMuscles: 'Upper Trapezius · Levator Scapulae',
    defaultSeconds: 35,
    bilateral: true,
    poseKey: 'neck-release',
    cues: [
      'Sit tall with your collarbone broad and ribs stacked over your pelvis.',
      'Let the opposite shoulder melt gently down away from your ear.',
      'Rest fingertips lightly on your temple without pulling forcefully.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Keep both hands resting on your lap if the neck feels sensitive today.',
  },
  'cat-cow': {
    id: 'cat-cow',
    name: 'Segmental Cat-Cow Flow',
    zone: 'Spine & Neck',
    targetMuscles: 'Thoracic Spine · Lumbar Erectors',
    defaultSeconds: 50,
    bilateral: false,
    poseKey: 'cat-cow',
    cues: [
      'Stack wrists directly beneath shoulders and knees under hips.',
      'Initiate each wave from the tailbone, moving one vertebra at a time.',
      'Press the floor away smoothly as you round toward the ceiling.',
    ],
    breathPattern: 'Inhale arch · Exhale round',
    modification: 'Place a folded blanket or towel under your knees for extra cushion.',
  },
  'thread-needle': {
    id: 'thread-needle',
    name: 'Thread the Needle Twist',
    zone: 'Shoulders & Chest',
    targetMuscles: 'Rear Deltoid · Thoracic Rotators',
    defaultSeconds: 40,
    bilateral: true,
    poseKey: 'thread-needle',
    cues: [
      'Slide your reaching arm smoothly beneath your chest until shoulder and ear rest.',
      'Keep your hips square and centered directly over your knees.',
      'Use light pressure through the supporting palm to deepen upper-back rotation.',
    ],
    breathPattern: 'Inhale 4s into upper back · Exhale 6s',
    modification: 'Rest your temple on a cushion or folded towel if your shoulder stays lifted.',
  },
  'seated-twist': {
    id: 'seated-twist',
    name: 'Seated Cross-Legged Spinal Twist',
    zone: 'Spine & Neck',
    targetMuscles: 'Obliques · Spinal Paraspinals · Glute Medius',
    defaultSeconds: 40,
    bilateral: true,
    poseKey: 'seated-twist',
    cues: [
      'Ground both sitting bones evenly before rotating your ribcage.',
      'Lengthen upward through the crown of your head on every inhale.',
      'Rotate from your mid-back rather than forcing with your neck.',
    ],
    breathPattern: 'Inhale lengthen · Exhale soften twist',
    modification: 'Keep the bottom leg extended straight in front of you for easier hip comfort.',
  },
  'low-lunge': {
    id: 'low-lunge',
    name: 'Crescent Low Lunge Hip Opener',
    zone: 'Hips & Pelvis',
    targetMuscles: 'Iliopsoas · Rectus Femoris · Hip Flexors',
    defaultSeconds: 45,
    bilateral: true,
    poseKey: 'low-lunge',
    cues: [
      'Tuck your tailbone slightly under before gliding your hips forward.',
      'Keep your front knee stacked calmly above your ankle.',
      'Lift your chest tall without compressing your lower back.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Keep hands resting on your front thigh or blocks for steady balance.',
  },
  'hip-90-90': {
    id: 'hip-90-90',
    name: '90/90 Hip Capsule Switch',
    zone: 'Hips & Pelvis',
    targetMuscles: 'Hip Internal & External Rotators · Piriformis',
    defaultSeconds: 45,
    bilateral: true,
    poseKey: 'hip-90-90',
    cues: [
      'Form 90-degree bends at both front and back knees.',
      'Hinge forward with a long spine over your front shin rather than rounding.',
      'Keep your back hip grounded as deeply as comfort allows.',
    ],
    breathPattern: 'Inhale 4s · Exhale hinge 6s',
    modification: 'Sit on a folded cushion to elevate your pelvis if hips feel tight.',
  },
  'pigeon-prep': {
    id: 'pigeon-prep',
    name: 'Supported Pigeon Glute Release',
    zone: 'Hips & Pelvis',
    targetMuscles: 'Gluteus Maximus · Piriformis · Outer Hip',
    defaultSeconds: 50,
    bilateral: true,
    poseKey: 'pigeon-prep',
    cues: [
      'Bring your front heel closer to your pelvis to protect the knee joint.',
      'Square both hip bones downward toward the mat.',
      'Walk forearms down only as far as your breath stays slow and effortless.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Substitute Figure-Four on your back anytime your front knee feels pressure.',
  },
  butterfly: {
    id: 'butterfly',
    name: 'Seated Bound Angle Butterfly',
    zone: 'Hips & Pelvis',
    targetMuscles: 'Adductors · Inner Thighs · Pelvic Floor',
    defaultSeconds: 55,
    bilateral: false,
    poseKey: 'butterfly',
    cues: [
      'Draw soles of feet together and slide them slightly forward into a diamond.',
      'Press sit bones down and tilt pelvis gently forward before folding.',
      'Allow gravity to soften your outer thighs without bouncing.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Slide heels further away from your body to reduce inner-knee tension.',
  },
  'forward-fold': {
    id: 'forward-fold',
    name: 'Seated Hamstring Forward Fold',
    zone: 'Hamstrings & Legs',
    targetMuscles: 'Hamstrings · Gastrocnemius · Lower Back',
    defaultSeconds: 55,
    bilateral: false,
    poseKey: 'forward-fold',
    cues: [
      'Flex your ankles softly and hinge from the hip crease, not the waist.',
      'Keep a subtle micro-bend in the knees so the stretch stays in the belly of the muscle.',
      'Rest hands along shins, ankles, or feet without straining your shoulders.',
    ],
    breathPattern: 'Inhale lengthen spine · Exhale soften forward',
    modification: 'Sit on the edge of a folded towel or bend your knees generously.',
  },
  'half-split': {
    id: 'half-split',
    name: 'Half-Split Hamstring Glide',
    zone: 'Hamstrings & Legs',
    targetMuscles: 'Proximal Hamstrings · Calves',
    defaultSeconds: 45,
    bilateral: true,
    poseKey: 'half-split',
    cues: [
      'Shift hips directly back over your kneeling knee.',
      'Draw your extended foot toes softly back toward your shin.',
      'Keep your collarbones broad and spine long as you hinge.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Maintain a generous bend in the front knee to keep your pelvis level.',
  },
  'calf-wall': {
    id: 'calf-wall',
    name: 'Downward Heel Pedal & Calf Stretch',
    zone: 'Hamstrings & Legs',
    targetMuscles: 'Soleus · Gastrocnemius · Achilles Tendon',
    defaultSeconds: 50,
    bilateral: false,
    poseKey: 'calf-wall',
    cues: [
      'Spread palms evenly and lengthen your tailbone diagonally upward.',
      'Press one heel slowly toward the mat for 3 breaths before alternating.',
      'Keep your head relaxed naturally between your upper arms.',
    ],
    breathPattern: 'Inhale lift heels · Exhale press one heel',
    modification: 'Perform standing with hands against a wall and one foot stepped back.',
  },
  'childs-pose': {
    id: 'childs-pose',
    name: 'Extended Child’s Pose Side Reach',
    zone: 'Full Body',
    targetMuscles: 'Latissimus Dorsi · Lumbar Spine · Shoulders',
    defaultSeconds: 60,
    bilateral: false,
    poseKey: 'childs-pose',
    cues: [
      'Widen your knees comfortably and let your hips settle toward your heels.',
      'Walk fingertips forward until you feel a gentle lengthening under your arms.',
      'Soften your forehead onto the mat and relax your jaw.',
    ],
    breathPattern: 'Inhale 4s into back ribs · Exhale 6s',
    modification: 'Place a pillow between thighs and calves if deep knee flexion is tight.',
  },
  'chest-opener': {
    id: 'chest-opener',
    name: 'Kneeling Thoracic & Chest Opener',
    zone: 'Shoulders & Chest',
    targetMuscles: 'Pectoralis Major · Anterior Deltoid · Thoracic Spine',
    defaultSeconds: 45,
    bilateral: false,
    poseKey: 'chest-opener',
    cues: [
      'Clasp hands softly behind your lower back or hold a towel shoulder-width.',
      'Roll shoulder blades down and back to broaden the collarbone.',
      'Keep your lower ribs knitted softly inward so you do not over-arch.',
    ],
    breathPattern: 'Inhale 4s expand chest · Exhale 6s',
    modification: 'Hold a strap or rolled shirt behind your back if fingers do not meet.',
  },
  'overhead-lat': {
    id: 'overhead-lat',
    name: 'Seated Overhead Side & Lat Reach',
    zone: 'Shoulders & Chest',
    targetMuscles: 'Latissimus Dorsi · Intercostals · Serratus',
    defaultSeconds: 35,
    bilateral: true,
    poseKey: 'overhead-lat',
    cues: [
      'Anchor the opposite hip firmly into the floor as you reach overhead.',
      'Spin your chest slightly open toward the ceiling rather than collapsing forward.',
      'Breathe into the side ribs to create space between each rib.',
    ],
    breathPattern: 'Inhale 4s into side body · Exhale 6s',
    modification: 'Bend the top elbow and rest hand behind your head if shoulder feels pinched.',
  },
  'supine-twist': {
    id: 'supine-twist',
    name: 'Supine Knee-Drop Spinal Decompression',
    zone: 'Full Body',
    targetMuscles: 'Lumbar Paraspinals · Glutes · Chest',
    defaultSeconds: 45,
    bilateral: true,
    poseKey: 'supine-twist',
    cues: [
      'Draw one knee toward your chest and guide it calmly across your midline.',
      'Extend your opposite arm wide and keep that shoulder heavy on the mat.',
      'Let gravity do the work—release any gripping through your abdomen.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Place a pillow under the crossed knee so your lower back stays calm.',
  },
  'figure-four': {
    id: 'figure-four',
    name: 'Supine Figure-Four Piriformis Release',
    zone: 'Hips & Pelvis',
    targetMuscles: 'Piriformis · Deep External Hip Rotators',
    defaultSeconds: 45,
    bilateral: true,
    poseKey: 'figure-four',
    cues: [
      'Cross one ankle gently above the opposite knee with foot softly flexed.',
      'Thread hands behind the supporting thigh and keep shoulders relaxed on the mat.',
      'Press the crossed knee gently forward to deepen the outer-hip stretch.',
    ],
    breathPattern: 'Inhale 4s · Exhale 6s',
    modification: 'Keep the supporting foot planted on the floor or against a wall.',
  },
};

export const BUILTIN_ROUTINES: StretchRoutine[] = [
  {
    id: 'morning-spinal-wakeup',
    title: 'Morning Spinal Wakeup',
    subtitle: 'Unwind overnight stiffness through your neck, thoracic spine, and ribs before the day starts.',
    zone: 'Spine & Neck',
    level: 'Gentle',
    recommendedTime: 'Morning',
    image: morningSpineImg,
    poses: [
      POSE_CATALOG['neck-release'],
      POSE_CATALOG['cat-cow'],
      POSE_CATALOG['thread-needle'],
      POSE_CATALOG['overhead-lat'],
      POSE_CATALOG['seated-twist'],
      POSE_CATALOG['childs-pose'],
    ],
  },
  {
    id: 'desk-hip-opener',
    title: 'Desk & Hip Opener',
    subtitle: 'Counteract hours of sitting by restoring hip flexor length, glute glide, and upright posture.',
    zone: 'Hips & Pelvis',
    level: 'Moderate',
    recommendedTime: 'Midday',
    image: hipOpenerImg,
    poses: [
      POSE_CATALOG['low-lunge'],
      POSE_CATALOG['hip-90-90'],
      POSE_CATALOG['chest-opener'],
      POSE_CATALOG['figure-four'],
      POSE_CATALOG['butterfly'],
    ],
  },
  {
    id: 'deep-hamstring-flow',
    title: 'Posterior Chain & Hamstring Flow',
    subtitle: 'Patient, breath-led progressions to lengthen tight hamstrings, calves, and lower back.',
    zone: 'Hamstrings & Legs',
    level: 'Focused',
    recommendedTime: 'Anytime',
    image: hamstringFlowImg,
    poses: [
      POSE_CATALOG['calf-wall'],
      POSE_CATALOG['half-split'],
      POSE_CATALOG['forward-fold'],
      POSE_CATALOG['low-lunge'],
      POSE_CATALOG['supine-twist'],
    ],
  },
  {
    id: 'evening-downshift',
    title: 'Evening Downshift & Release',
    subtitle: 'Slow restorative holds with extended exhales to quiet your nervous system before sleep.',
    zone: 'Full Body',
    level: 'Gentle',
    recommendedTime: 'Evening',
    image: eveningReleaseImg,
    poses: [
      POSE_CATALOG['childs-pose'],
      POSE_CATALOG['figure-four'],
      POSE_CATALOG['butterfly'],
      POSE_CATALOG['supine-twist'],
      POSE_CATALOG['neck-release'],
    ],
  },
  {
    id: 'shoulder-overhead-mobility',
    title: 'Shoulder & Overhead Mobility',
    subtitle: 'Open tight pectorals, lats, and mid-back rotation for pain-free overhead reach.',
    zone: 'Shoulders & Chest',
    level: 'Moderate',
    recommendedTime: 'Midday',
    image: morningSpineImg,
    poses: [
      POSE_CATALOG['neck-release'],
      POSE_CATALOG['thread-needle'],
      POSE_CATALOG['chest-opener'],
      POSE_CATALOG['overhead-lat'],
      POSE_CATALOG['childs-pose'],
    ],
  },
  {
    id: 'runners-lower-flush',
    title: "Runner's Lower Body Flush",
    subtitle: 'Restore stride symmetry across hip flexors, calves, hamstrings, and outer glutes.',
    zone: 'Hips & Pelvis',
    level: 'Focused',
    recommendedTime: 'Anytime',
    image: hipOpenerImg,
    poses: [
      POSE_CATALOG['calf-wall'],
      POSE_CATALOG['low-lunge'],
      POSE_CATALOG['half-split'],
      POSE_CATALOG['pigeon-prep'],
      POSE_CATALOG['forward-fold'],
    ],
  },
];

export function getPaceMultiplier(pace: HoldPace): number {
  if (pace === 'gentle') return 0.75;
  if (pace === 'deep') return 1.3;
  return 1;
}

export function getPoseHoldSeconds(pose: StretchPose, pace: HoldPace): number {
  const raw = Math.round(pose.defaultSeconds * getPaceMultiplier(pace));
  return Math.max(20, Math.round(raw / 5) * 5);
}

export function getRoutineDurationMinutes(routine: StretchRoutine, pace: HoldPace): number {
  const totalSeconds = routine.poses.reduce((sum, pose) => {
    const hold = getPoseHoldSeconds(pose, pace);
    const sides = pose.bilateral ? 2 : 1;
    const transition = pose.bilateral ? 10 : 5;
    return sum + hold * sides + transition;
  }, 0);
  return Math.max(3, Math.round(totalSeconds / 60));
}

export function toLocalDateISO(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftLocalDays(base: Date, offsetDays: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + offsetDays);
  return next;
}

export function createSeededPracticeState(): PracticeState {
  const today = new Date();
  const day = (offset: number) => toLocalDateISO(shiftLocalDays(today, offset));

  const sessions: SessionLog[] = [
    {
      id: 'seed-1',
      routineId: 'morning-spinal-wakeup',
      routineTitle: 'Morning Spinal Wakeup',
      zone: 'Spine & Neck',
      dateISO: day(-19),
      completedAtISO: `${day(-19)}T07:40:00`,
      durationMinutes: 9,
      posesCompleted: 6,
      comfortRating: 1,
      note: 'Neck felt stiff waking up, eased by the third breath.',
    },
    {
      id: 'seed-2',
      routineId: 'desk-hip-opener',
      routineTitle: 'Desk & Hip Opener',
      zone: 'Hips & Pelvis',
      dateISO: day(-17),
      completedAtISO: `${day(-17)}T17:15:00`,
      durationMinutes: 11,
      posesCompleted: 5,
      comfortRating: 2,
      note: '90/90 switches felt noticeably smoother on the left side.',
    },
    {
      id: 'seed-3',
      routineId: 'evening-downshift',
      routineTitle: 'Evening Downshift & Release',
      zone: 'Full Body',
      dateISO: day(-15),
      completedAtISO: `${day(-15)}T21:20:00`,
      durationMinutes: 10,
      posesCompleted: 5,
      comfortRating: 2,
      note: 'Long exhales helped my lower back settle.',
    },
    {
      id: 'seed-4',
      routineId: 'deep-hamstring-flow',
      routineTitle: 'Posterior Chain & Hamstring Flow',
      zone: 'Hamstrings & Legs',
      dateISO: day(-12),
      completedAtISO: `${day(-12)}T08:05:00`,
      durationMinutes: 12,
      posesCompleted: 5,
      comfortRating: 2,
      note: 'Bent knees slightly in forward fold—zero strain.',
    },
    {
      id: 'seed-5',
      routineId: 'shoulder-overhead-mobility',
      routineTitle: 'Shoulder & Overhead Mobility',
      zone: 'Shoulders & Chest',
      dateISO: day(-10),
      completedAtISO: `${day(-10)}T12:45:00`,
      durationMinutes: 9,
      posesCompleted: 5,
      comfortRating: 2,
      note: 'Midday desk reset made overhead reach feel lighter.',
    },
    {
      id: 'seed-6',
      routineId: 'morning-spinal-wakeup',
      routineTitle: 'Morning Spinal Wakeup',
      zone: 'Spine & Neck',
      dateISO: day(-5),
      completedAtISO: `${day(-5)}T07:30:00`,
      durationMinutes: 9,
      posesCompleted: 6,
      comfortRating: 2,
      note: 'Consistent morning start—cat-cow felt fluid.',
    },
    {
      id: 'seed-7',
      routineId: 'desk-hip-opener',
      routineTitle: 'Desk & Hip Opener',
      zone: 'Hips & Pelvis',
      dateISO: day(-4),
      completedAtISO: `${day(-4)}T18:10:00`,
      durationMinutes: 11,
      posesCompleted: 5,
      comfortRating: 2,
      note: 'Low lunge opened up after 30 seconds.',
    },
    {
      id: 'seed-8',
      routineId: 'deep-hamstring-flow',
      routineTitle: 'Posterior Chain & Hamstring Flow',
      zone: 'Hamstrings & Legs',
      dateISO: day(-3),
      completedAtISO: `${day(-3)}T08:15:00`,
      durationMinutes: 12,
      posesCompleted: 5,
      comfortRating: 3,
      note: 'Fingertips comfortably reached mid-arch of foot.',
    },
    {
      id: 'seed-9',
      routineId: 'shoulder-overhead-mobility',
      routineTitle: 'Shoulder & Overhead Mobility',
      zone: 'Shoulders & Chest',
      dateISO: day(-2),
      completedAtISO: `${day(-2)}T13:05:00`,
      durationMinutes: 9,
      posesCompleted: 5,
      comfortRating: 3,
      note: 'Thread the needle felt wonderfully open.',
    },
    {
      id: 'seed-10',
      routineId: 'evening-downshift',
      routineTitle: 'Evening Downshift & Release',
      zone: 'Full Body',
      dateISO: day(-1),
      completedAtISO: `${day(-1)}T21:10:00`,
      durationMinutes: 10,
      posesCompleted: 5,
      comfortRating: 3,
      note: 'Five days in a row—shoulders dropped effortlessly.',
    },
  ];

  const benchmarks: FlexibilityBenchmark[] = [
    {
      id: 'forward-fold-reach',
      metricName: 'Seated Forward Fold Reach',
      description: 'Distance past (+) or short of (-) your toes with soft knees and a long spine.',
      unit: 'cm',
      higherIsBetter: true,
      entries: [
        { id: 'bf-1', dateISO: day(-21), value: -8, note: 'Mid-shin baseline' },
        { id: 'bf-2', dateISO: day(-14), value: -5, note: 'Ankles with warm-up' },
        { id: 'bf-3', dateISO: day(-7), value: -2, note: 'Almost touching toes' },
        { id: 'bf-4', dateISO: day(-2), value: 1, note: 'Fingertips past toes cleanly' },
      ],
    },
    {
      id: 'hip-90-90-ease',
      metricName: '90/90 Upright Sit Comfort',
      description: 'Self-rated comfort sitting tall without hands supporting on the floor (1–10).',
      unit: '/10',
      higherIsBetter: true,
      entries: [
        { id: 'bh-1', dateISO: day(-21), value: 4.5, note: 'Needed lean back' },
        { id: 'bh-2', dateISO: day(-14), value: 5.5 },
        { id: 'bh-3', dateISO: day(-7), value: 6.5, note: 'Brief hands-free balance' },
        { id: 'bh-4', dateISO: day(-1), value: 7.5, note: 'Steady upright torso' },
      ],
    },
    {
      id: 'overhead-shoulder-angle',
      metricName: 'Wall Overhead Arm Reach',
      description: 'Ease keeping ribs down while thumbs touch wall overhead (1–10).',
      unit: '/10',
      higherIsBetter: true,
      entries: [
        { id: 'bs-1', dateISO: day(-18), value: 5.0 },
        { id: 'bs-2', dateISO: day(-10), value: 6.5, note: 'Left side catching up' },
        { id: 'bs-3', dateISO: day(-2), value: 7.5, note: 'Clean contact without rib flare' },
      ],
    },
    {
      id: 'ankle-knee-to-wall',
      metricName: 'Ankle Dorsiflexion (Knee-to-Wall)',
      description: 'Toe distance from wall while knee lightly touches with heel planted.',
      unit: 'cm',
      higherIsBetter: true,
      entries: [
        { id: 'ba-1', dateISO: day(-20), value: 6.5 },
        { id: 'ba-2', dateISO: day(-12), value: 7.5 },
        { id: 'ba-3', dateISO: day(-3), value: 9.0 },
      ],
    },
  ];

  return {
    sessions,
    benchmarks,
    customRoutines: [],
    appreciationNotes: [
      {
        id: 'note-1',
        dateISO: day(-5),
        text: 'Ten calm minutes right after waking up changes how my back feels all afternoon.',
      },
      {
        id: 'note-2',
        dateISO: day(-1),
        text: 'Noticing less tension between my shoulder blades after keeping a steady 5-day rhythm.',
      },
    ],
    weeklyGoal: 5,
    holdPace: 'standard',
    soundEnabled: true,
  };
}
