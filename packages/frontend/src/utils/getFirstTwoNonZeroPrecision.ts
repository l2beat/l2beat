export function getFirstTwoNonZeroPrecision(value: number) {
  if (value >= 1) {
    throw new Error('Value must be less than 1')
  }

  return Math.min(30, 1 - Math.floor(Math.log(Math.abs(value)) / Math.log(10)))
}
