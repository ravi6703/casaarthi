/**
 * SM-2 Spaced Repetition Algorithm
 * Maps practice accuracy to quality scores and calculates next review intervals.
 */

export interface SM2Input {
  quality: number; // 0-5 (0=complete blackout, 5=perfect)
  easinessFactor: number;
  interval: number; // days
  repetitions: number;
}

export interface SM2Output {
  easinessFactor: number;
  interval: number;
  repetitions: number;
}

/**
 * Calculate next review parameters using SM-2 algorithm.
 */
export function calculateNextReview(input: SM2Input): SM2Output {
  const { quality, easinessFactor: prevEF, interval: prevInterval, repetitions: prevReps } = input;

  let newEF = prevEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF); // EF never goes below 1.3

  if (quality < 3) {
    // Failed — reset repetitions, short interval
    return {
      easinessFactor: newEF,
      interval: 1,
      repetitions: 0,
    };
  }

  let newInterval: number;
  let newReps = prevReps + 1;

  if (prevReps === 0) {
    newInterval = 1;
  } else if (prevReps === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(prevInterval * newEF);
  }

  // Cap at 180 days
  newInterval = Math.min(newInterval, 180);

  return {
    easinessFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newReps,
  };
}

/**
 * Map practice accuracy (0-100%) to SM-2 quality score (0-5).
 */
export function accuracyToQuality(accuracy: number): number {
  if (accuracy >= 95) return 5;
  if (accuracy >= 80) return 4;
  if (accuracy >= 65) return 3;
  if (accuracy >= 50) return 2;
  if (accuracy >= 30) return 1;
  return 0;
}
