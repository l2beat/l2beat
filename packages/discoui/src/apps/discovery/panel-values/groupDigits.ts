const DIGIT_GROUP_SIZE = 3

export function groupDigits(integer: string): string[] {
  const sign = integer.startsWith('-') ? '-' : ''
  const digits = integer.slice(sign.length)
  if (digits.length <= DIGIT_GROUP_SIZE + 1) {
    return [integer]
  }
  const headLength = digits.length % DIGIT_GROUP_SIZE || DIGIT_GROUP_SIZE
  const groups = [sign + digits.slice(0, headLength)]
  for (let i = headLength; i < digits.length; i += DIGIT_GROUP_SIZE) {
    groups.push(digits.slice(i, i + DIGIT_GROUP_SIZE))
  }
  return groups
}
