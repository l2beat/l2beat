import { type UnixTime, notUndefined } from '@l2beat/shared-pure';
import { RunningStatistics } from './RollingVariance';
import type { Interval } from './calculateIntervals';

export function calculate30DayRollingStats(
  entireScope: Interval[],
  windowStartIndex: number,
  windowEndIndex: number,
  upTo: UnixTime
): {
  means: Map<number, number>;
  stdDeviations: Map<number, number>;
} {
  const result = {
    means: new Map<number, number>(),
    stdDeviations: new Map<number, number>(),
  };

  let timeStart = upTo;

  const initialWindow = entireScope.slice(windowStartIndex, windowEndIndex);
  let sum = initialWindow.reduce((prev, curr) => prev + (curr.duration ?? 0), 0);

  // special handling for the first loop iteration
  const mean = sum / (windowEndIndex - windowStartIndex);
  const rollingStdDev = new RunningStatistics(
    initialWindow.map((r) => r.duration).filter(notUndefined)
  );

  result.means.set(timeStart.toNumber(), mean);
  result.stdDeviations.set(timeStart.toNumber(), rollingStdDev.getStandardDeviation());
  while (timeStart.gte(upTo.add(-1 * 30, 'days'))) {
    timeStart = timeStart.add(-1, 'minutes');
    const leftFence = timeStart;
    const rightFence = timeStart.add(-1 * 30, 'days');

    while (entireScope[windowStartIndex]!.timestamp.gte(leftFence)) {
      sum -= entireScope[windowStartIndex]!.duration ?? 0;
      rollingStdDev.removeValue(entireScope[windowStartIndex]!.duration ?? 0);
      windowStartIndex++;
    }
    while (
      windowEndIndex < entireScope.length &&
      entireScope[windowEndIndex]!.timestamp.gte(rightFence)
    ) {
      sum += entireScope[windowEndIndex]!.duration ?? 0;
      rollingStdDev.addValue(entireScope[windowEndIndex]!.duration ?? 0);
      windowEndIndex++;
    }

    const mean = sum / (windowEndIndex - windowStartIndex);
    result.means.set(timeStart.toNumber(), mean);
    result.stdDeviations.set(timeStart.toNumber(), rollingStdDev.getStandardDeviation());
  }

  return result;
}
