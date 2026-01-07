export const PRIZE_SEGMENTS = [
  "Better Luck Next Time",
  "Wireless Earbuds",
  "Gaming Mouse",
  "Smartwatch",
  "Power Bank",
  "Gaming Keyboard",
  "Tablet",
  "iPhone 17 Pro",
] as const;

// ✅ UPDATED: Shining Gold & Dark Red theme (matches your request)
export const SEGMENT_COLORS = [
  "#8B0000", // Dark Red (maroon)
  "#ffca1ed2", // Shining Gold 1
  "#8B0000", // Dark Red (maroon)
  "#ffca1ed2", // Shining Gold 1
  "#8B0000", // Dark Red (maroon)
  "#ffca1ed2", // Shining Gold 1
  "#8B0000", // Dark Red (maroon)
  "#ffac07ff", // Shining Gold 2 (Slightly darker for variety)
] as const;

export type Prize = typeof PRIZE_SEGMENTS[number];
