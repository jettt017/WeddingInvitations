export const RSVP_SUCCESS_DURATION_MS = 3_500;

export interface RsvpCelebrationPetal {
  id: string;
  startX: number;
  startY: number;
  apexX: number;
  apexY: number;
  landingX: number;
  landingY: number;
  rotation: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export interface RsvpFloralBrushBloom {
  id: string;
  x: number;
  y: number;
  size: number;
  petalColor: string;
  centerColor: string;
  rotation: number;
  delay: number;
  petalCount: 5 | 6;
}

export interface RsvpFloralBrushLeaf {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  delay: number;
}

type PetalSide = "left" | "right";
type PetalSeed = readonly [
  apexX: number,
  apexY: number,
  landingX: number,
  landingY: number,
  rotation: number,
  size: number,
];

const PETAL_COLORS = [
  "#E88F9B",
  "#F4C95D",
  "#F2B7C0",
  "#B94D62",
  "#F7D77A",
  "#D96B7C",
  "#F5A9B6",
] as const;

const LEFT_PETAL_SEEDS = [
  [84, 360, 16, 768, 330, 12],
  [112, 245, 48, 752, 265, 9],
  [150, 128, 80, 779, 430, 11],
  [198, 72, 112, 744, 510, 8],
  [238, 160, 144, 771, 385, 10],
  [276, 242, 176, 758, 455, 7],
  [324, 328, 208, 783, 290, 9],
  [354, 414, 240, 748, 360, 8],
  [178, 390, 272, 775, 480, 11],
  [216, 278, 304, 755, 315, 9],
  [260, 182, 336, 785, 405, 12],
  [306, 104, 368, 762, 535, 8],
  [104, 212, 96, 739, 345, 10],
  [336, 286, 288, 780, 460, 9],
  [60, 470, 24, 795, 390, 10],
  [130, 335, 64, 742, 500, 8],
  [190, 205, 128, 798, 420, 12],
  [250, 95, 196, 736, 560, 9],
  [310, 225, 260, 792, 350, 11],
  [365, 350, 344, 746, 475, 8],
] as const satisfies readonly PetalSeed[];

const RIGHT_PETAL_SEEDS = [
  [309, 350, 372, 772, -340, 12],
  [281, 232, 340, 747, -275, 9],
  [243, 118, 308, 781, -440, 11],
  [195, 78, 276, 742, -520, 8],
  [155, 168, 244, 774, -395, 10],
  [117, 250, 212, 756, -465, 7],
  [69, 338, 180, 786, -300, 9],
  [39, 422, 148, 750, -370, 8],
  [215, 382, 116, 777, -490, 11],
  [177, 270, 84, 753, -325, 9],
  [133, 176, 52, 788, -415, 12],
  [87, 110, 20, 765, -545, 8],
  [289, 204, 296, 737, -355, 10],
  [57, 294, 104, 782, -470, 9],
  [333, 462, 369, 797, -400, 10],
  [263, 327, 329, 744, -510, 8],
  [203, 197, 265, 800, -430, 12],
  [143, 103, 197, 738, -570, 9],
  [83, 217, 133, 794, -360, 11],
  [28, 342, 49, 748, -485, 8],
] as const satisfies readonly PetalSeed[];

function createPetals(
  side: PetalSide,
  seeds: readonly PetalSeed[]
): RsvpCelebrationPetal[] {
  const isLeft = side === "left";

  return seeds.map(
    ([apexX, apexY, landingX, landingY, rotation, size], index) => ({
      id: `petal-${side}-${String(index + 1).padStart(2, "0")}`,
      startX: isLeft ? 18 + (index % 3) * 13 : 375 - (index % 3) * 13,
      startY: 768 + (index % 4) * 8,
      apexX,
      apexY,
      landingX,
      landingY,
      rotation,
      size,
      color: PETAL_COLORS[(index + (isLeft ? 0 : 3)) % PETAL_COLORS.length],
      delay: (index % 5) * 0.035 + (isLeft ? 0 : 0.02),
      duration: 2.36 + (index % 4) * 0.08,
    })
  );
}

export const RSVP_CELEBRATION_PETALS = [
  ...createPetals("left", LEFT_PETAL_SEEDS),
  ...createPetals("right", RIGHT_PETAL_SEEDS),
] satisfies readonly RsvpCelebrationPetal[];

type BloomSeed = readonly [
  x: number,
  y: number,
  size: number,
  petalColor: string,
  centerColor: string,
  rotation: number,
];

const FLORAL_BRUSH_BLOOM_SEEDS = [
  [20, 490, 42, "#F2B7C0", "#B94D62", -12],
  [105, 515, 34, "#F8E6B5", "#E6B84F", 18],
  [196, 488, 48, "#E88F9B", "#7C5649", -4],
  [288, 522, 38, "#DF7A68", "#F4C95D", 15],
  [374, 495, 44, "#FFF4E3", "#B94D62", -20],
  [-6, 590, 52, "#F4C95D", "#7C5649", 9],
  [42, 565, 46, "#B94D62", "#F4C95D", -16],
  [88, 620, 58, "#F2B7C0", "#B94D62", 13],
  [140, 578, 44, "#F8E6B5", "#E6B84F", -7],
  [196, 630, 64, "#E88F9B", "#7C5649", 4],
  [248, 574, 48, "#DF7A68", "#F4C95D", -14],
  [300, 618, 58, "#FFF4E3", "#B94D62", 11],
  [350, 566, 44, "#F4C95D", "#7C5649", -5],
  [399, 610, 52, "#B94D62", "#F4C95D", 17],
  [10, 704, 62, "#F2B7C0", "#B94D62", -9],
  [52, 760, 50, "#F8E6B5", "#E6B84F", 12],
  [96, 690, 70, "#E88F9B", "#7C5649", -15],
  [148, 774, 54, "#DF7A68", "#F4C95D", 7],
  [196, 704, 76, "#FFF4E3", "#B94D62", -3],
  [244, 782, 58, "#F4C95D", "#7C5649", 14],
  [290, 694, 68, "#B94D62", "#F4C95D", -11],
  [336, 766, 52, "#F2B7C0", "#B94D62", 5],
  [382, 706, 64, "#F8E6B5", "#E6B84F", -18],
  [399, 790, 48, "#E88F9B", "#7C5649", 10],
] as const satisfies readonly BloomSeed[];

export const RSVP_FLORAL_BRUSH_BLOOMS = FLORAL_BRUSH_BLOOM_SEEDS.map(
  ([x, y, size, petalColor, centerColor, rotation], index) => ({
    id: `brush-bloom-${String(index + 1).padStart(2, "0")}`,
    x,
    y,
    size,
    petalColor,
    centerColor,
    rotation,
    delay: 0.12 + (index % 8) * 0.045,
    petalCount: (index % 3 === 0 ? 6 : 5) as 5 | 6,
  })
) satisfies readonly RsvpFloralBrushBloom[];

type LeafSeed = readonly [
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  rotation: number,
];

const FLORAL_BRUSH_LEAF_SEEDS = [
  [-18, 530, 58, 24, "#315E2B", -42],
  [8, 610, 44, 19, "#6FA844", 28],
  [25, 705, 62, 27, "#4F8739", -18],
  [44, 545, 36, 16, "#8FBB55", 52],
  [61, 650, 54, 23, "#315E2B", -63],
  [78, 785, 66, 29, "#6FA844", 15],
  [94, 575, 46, 19, "#4F8739", 38],
  [111, 710, 58, 25, "#8FBB55", -34],
  [127, 625, 40, 17, "#315E2B", 68],
  [143, 800, 70, 30, "#6FA844", -12],
  [159, 548, 52, 22, "#4F8739", -48],
  [174, 682, 44, 18, "#8FBB55", 31],
  [188, 748, 64, 28, "#315E2B", -25],
  [201, 585, 38, 16, "#6FA844", 57],
  [214, 806, 72, 30, "#4F8739", 8],
  [228, 642, 50, 21, "#8FBB55", -54],
  [242, 535, 42, 18, "#315E2B", 36],
  [256, 720, 60, 26, "#6FA844", -20],
  [270, 792, 68, 29, "#4F8739", 17],
  [284, 610, 46, 19, "#8FBB55", -38],
  [298, 548, 54, 23, "#315E2B", 49],
  [312, 690, 40, 17, "#6FA844", -67],
  [326, 778, 64, 27, "#4F8739", 22],
  [340, 628, 48, 20, "#8FBB55", -29],
  [354, 570, 56, 24, "#315E2B", 61],
  [368, 715, 42, 18, "#6FA844", -45],
  [382, 802, 70, 30, "#4F8739", 13],
  [395, 650, 52, 22, "#8FBB55", -58],
  [406, 548, 46, 20, "#315E2B", 33],
  [410, 755, 60, 26, "#6FA844", -24],
] as const satisfies readonly LeafSeed[];

export const RSVP_FLORAL_BRUSH_LEAVES = FLORAL_BRUSH_LEAF_SEEDS.map(
  ([x, y, width, height, color, rotation], index) => ({
    id: `brush-leaf-${String(index + 1).padStart(2, "0")}`,
    x,
    y,
    width,
    height,
    color,
    rotation,
    delay: 0.08 + (index % 10) * 0.035,
  })
) satisfies readonly RsvpFloralBrushLeaf[];
