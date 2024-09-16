export function getPercentageChange(now: number, then: number) {
  if (now === then || then === 0) {
    return 0
  }
  return now / then - 1
}

export function formatPercent(value: number, addPlus = false) {
  const result = (value * 100).toFixed(2) + '%'
  if (addPlus && !result.startsWith('-')) {
    return '+' + result
  }
  return result
}
