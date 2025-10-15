export function minNumberCheck(minNumber: number) {
  return (value: number) =>
    value >= minNumber ? true : `Minimum number is ${minNumber}`
}

export function minLengthCheck(minLength: number) {
  return (value: string) =>
    value.length >= minLength ? true : `Minimum length is ${minLength}`
}

export function urlCheck(value: string) {
  return /^https?:\/\/.+/.test(value) ? true : 'Invalid URL'
}
