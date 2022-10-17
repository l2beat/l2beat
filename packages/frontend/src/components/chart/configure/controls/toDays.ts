export function toDays(value: string) {
  if (value.endsWith('D')) {
    return parseInt(value.slice(0, -1))
  } else if (value.endsWith('Y')) {
    return parseInt(value.slice(0, -1)) * 365
  } else {
    return Infinity
  }
}
