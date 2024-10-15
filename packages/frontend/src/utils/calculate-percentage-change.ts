export function calculatePercentageChange(now: number, then: number) {
  if (now === then || then === 0) {
    return 0
  }
  const change = now / then - 1
  if (change === Infinity || change === null || isNaN(change)) {
    return 0
  }
  return change
}

export function formatPercent(value: number) {
  if (value >= 10) {
    return '>1K%'
  }
  if (value >= 1) {
    return (value * 100).toFixed(0) + '%'
  }
  if (value >= 0.1) {
    return (value * 100).toFixed(1) + '%'
  }

  return (value * 100).toFixed(2) + '%'
}
