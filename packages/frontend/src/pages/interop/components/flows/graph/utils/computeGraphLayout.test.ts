import { expect } from 'earl'
import { getChainLabel } from './chainLabel'
import {
  type ChainNodeLayout,
  computeGraphLayout,
  type FlowsGraphLayout,
} from './computeGraphLayout'

// Interop summary on a 375px phone: a 343px graph
const SUMMARY_CHAINS: [name: string, volume: number, netFlow: number][] = [
  ['Ethereum', 1, -8.26e6],
  ['Arbitrum One', 0.6, 8.32e6],
  ['Base', 0.39, 70.28e6],
  ['Hyperliquid', 0.3, -106.68e6],
  ['HyperEVM', 0.2, 102.92e6],
  ['Solana', 0.14, -6.59e6],
  ['BNB Smart Chain', 0.13, -67.55e6],
  ['Monad', 0.115, -5.03e6],
  ['Avalanche', 0.095, 9.32e6],
  ['Polygon PoS', 0.088, 1.94e6],
  ['OP Mainnet', 0.04, 6.99e6],
  ['Lighter', 0.035, -11.31e6],
  ['Ink', 0.03, 3.52e6],
  ['Unichain', 0.02, 1.52e6],
  ['Tempo', 0.01, 594.01e3],
]

describe(computeGraphLayout.name, () => {
  it('keeps every bubble and label clear of other chains and the logo', () => {
    const layout = layoutFor(SUMMARY_CHAINS, 343, true)

    expect(findOverlaps(layout, 343, true)).toEqual([])
  })

  it('leaves chains on the ring when their labels already fit', () => {
    const chains = SUMMARY_CHAINS.slice(0, 9)
    const withLabels = layoutFor(chains, 680, false)
    const ring = computeGraphLayout(
      chains.map(([name]) => name),
      chains.map(([name, volume]) => ({ chainId: name, totalVolume: volume })),
      680,
      false,
    )

    for (const [name, node] of withLabels) {
      const ringNode = ring.get(name) as ChainNodeLayout
      expect([node.x, node.y, node.showNetFlow]).toEqual([
        ringNode.x,
        ringNode.y,
        true,
      ])
    }
  })

  it('drops net flows only under small bubbles, and never a name', () => {
    // More chains than a phone-sized graph can label in full
    const crowded = [
      ...SUMMARY_CHAINS,
      ...SUMMARY_CHAINS.slice(4).map(
        ([name, volume, netFlow]): [string, number, number] => [
          `${name} Testnet`,
          volume / 2,
          netFlow,
        ],
      ),
    ]
    const layout = layoutFor(crowded, 343, true)
    const dropped = [...layout.values()].filter((node) => !node.showNetFlow)

    expect(dropped.length).toBeGreaterThan(0)
    for (const node of dropped) expect(node.radius).toBeLessThanOrEqual(12)
    for (const node of layout.values()) {
      expect(node.labelBoxes.length).toEqual(node.showNetFlow ? 2 : 1)
    }
  })
})

function layoutFor(
  chains: [name: string, volume: number, netFlow: number][],
  size: number,
  isSmallScreen: boolean,
) {
  return computeGraphLayout(
    chains.map(([name]) => name),
    chains.map(([name, volume]) => ({ chainId: name, totalVolume: volume })),
    size,
    isSmallScreen,
    undefined,
    new Map(
      chains.map(([name, , netFlow]) => [
        name,
        getChainLabel(name, netFlow, isSmallScreen),
      ]),
    ),
  )
}

interface Box {
  x0: number
  y0: number
  x1: number
  y1: number
}

function findOverlaps(
  layout: FlowsGraphLayout,
  size: number,
  isSmallScreen: boolean,
) {
  // FlowsLogo: 88×36, scaled 1.5× on small screens and 2× otherwise
  const scale = isSmallScreen ? 1.5 : 2
  const logo: Box = {
    x0: size / 2 - 44 * scale,
    y0: size / 2 - 18 * scale,
    x1: size / 2 + 44 * scale,
    y1: size / 2 + 18 * scale,
  }
  const nodes = [...layout.entries()]
  const overlaps: string[] = []
  for (const [name, node] of nodes) {
    // A label box sits centred under its own bubble
    for (const box of node.labelBoxes) {
      expect(box.y0).toBeGreaterThan(node.y + node.radius)
      expect((box.x0 + box.x1) / 2).toBeCloseTo(node.x, 6)
    }
    if (node.labelBoxes.some((box) => boxesOverlap(box, logo))) {
      overlaps.push(`${name} × logo`)
    }
    for (const [otherName, other] of nodes) {
      if (otherName <= name) continue
      const circlesOverlap =
        Math.hypot(node.x - other.x, node.y - other.y) <
        node.radius + other.radius
      const labelOverCircle =
        node.labelBoxes.some((box) => circleOverlapsBox(other, box)) ||
        other.labelBoxes.some((box) => circleOverlapsBox(node, box))
      const labelsOverlap = node.labelBoxes.some((a) =>
        other.labelBoxes.some((b) => boxesOverlap(a, b)),
      )
      if (circlesOverlap || labelOverCircle || labelsOverlap) {
        overlaps.push(`${name} × ${otherName}`)
      }
    }
  }
  return overlaps
}

function boxesOverlap(a: Box, b: Box) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1
}

function circleOverlapsBox(c: ChainNodeLayout, box: Box) {
  const nearestX = Math.min(Math.max(c.x, box.x0), box.x1)
  const nearestY = Math.min(Math.max(c.y, box.y0), box.y1)
  return Math.hypot(c.x - nearestX, c.y - nearestY) < c.radius
}
