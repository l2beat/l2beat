export function remove0x(str: string): string {
  if (str === undefined) {
    return str
  }
  return str.startsWith('0x') ? str.slice(2) : str
}

export function add0x(str: string): string {
  if (str === undefined) {
    return str
  }
  return str.startsWith('0x') ? str : '0x' + str
}

export function trimLong(str: string): string {
  if (str.length < 20) {
    return str
  }
  return str.slice(0, 10) + '...' + str.slice(str.length - 10, str.length - 1)
}
