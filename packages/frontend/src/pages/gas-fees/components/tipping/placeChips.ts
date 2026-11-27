interface ChipInput {
  key: string
  /** The dot's position, px from the track's left */
  x: number
  width: number
}

interface PlacedChip {
  key: string
  lane: 'above' | 'below'
  /** The chip's left edge, kept inside the track */
  left: number
}

const GAP = 4

/**
 * Chips centred on their dots, in two lanes: each goes above when it fits
 * there, else below, else where it covers least. In the given order, so the
 * first wins
 */
export function placeChips(
  chips: ChipInput[],
  trackWidth: number,
): PlacedChip[] {
  const taken: Record<PlacedChip['lane'], [number, number][]> = {
    above: [],
    below: [],
  }
  return chips.map((chip) => {
    const left = Math.min(
      Math.max(0, chip.x - chip.width / 2),
      Math.max(0, trackWidth - chip.width),
    )
    const span: [number, number] = [left - GAP, left + chip.width + GAP]
    // How much the chip would cover of those already in a lane
    const overlap = (lane: PlacedChip['lane']) =>
      taken[lane].reduce(
        (sum, [a, b]) =>
          sum + Math.max(0, Math.min(b, span[1]) - Math.max(a, span[0])),
        0,
      )
    const lane = overlap('above') <= overlap('below') ? 'above' : 'below'
    taken[lane].push(span)
    return { key: chip.key, lane, left }
  })
}
