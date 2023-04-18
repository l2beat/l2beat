export function getDerivedName(names: string[]) {
  names = names.map((x) => (x === '' ? 'Unknown' : x))
  if (names.length === 0) {
    return 'Unknown'
  } else if (names.length === 1) {
    return names[0]
  } else if (names.length === 2) {
    return `${names[1]} (${names[0]})`
  } else {
    return `${names[0]} (Diamond ${names.length - 1})`
  }
}
