export function getData(url: string) {
  return {
    url,
    city: pick(['Warsaw', 'Cracow', 'Poznan']),
    letter: pick(['A', 'B', 'C', 'D']),
  }
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}
