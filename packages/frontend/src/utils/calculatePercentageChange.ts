export function calculatePercentageChange(now: number, then: number) {
  if (now === then || then === 0 || now < 0.01) {
    return 0
  }
  const change = now / then - 1
  if (change === Number.POSITIVE_INFINITY || change === null || isNaN(change)) {
    return 0
  }
  return change
}

export function formatPercent(value: number) {
  const percent = value * 100

  if (percent >= 1000) {
    return '>1K%'
  }
  if (percent >= 100) {
    return fixedPercent(percent, 0) + '%'
  }
  if (percent >= 10) {
    return fixedPercent(percent, 1) + '%'
  }

  return fixedPercent(percent, 2) + '%'
}

function fixedPercent(value: number, digits: number) {
  return (Math.floor(value * 10 ** digits) / 10 ** digits)
    .toFixed(digits)
    .slice(0, 4)
}
