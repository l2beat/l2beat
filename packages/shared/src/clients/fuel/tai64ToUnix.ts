export function tai64ToUnix(num: string) {
  const bigNum = BigInt(num) - BigInt(Math.pow(2, 62)) - BigInt(10)
  return Number(bigNum)
}
