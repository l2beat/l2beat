import { expect } from 'earl'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import {
  BASE_RADIUS,
  buildPreview,
  SOURCE_RING_GAP,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './tilePreviewLayout'

describe(buildPreview.name, () => {
  it('keeps a wide star inside the viewport', () => {
    const targets = Array.from({ length: 30 }, (_, i) => `t${i}`)
    const preview = buildPreview(
      graph(
        ['src', ...targets],
        targets.map((to) => ({ from: 'src', to })),
      ),
    )

    expect(preview.marks.length).toEqual(31)
    expect(new Set(preview.marks.map((mark) => mark.row)).size).toBeGreaterThan(
      2,
    )
    expectInsideViewport(preview)
  })

  it('keeps a long chain inside the viewport', () => {
    const ids = Array.from({ length: 13 }, (_, i) => `n${i}`)
    const preview = buildPreview(
      graph(
        ids,
        ids.slice(1).map((to, i) => ({ from: ids[i] as string, to })),
      ),
    )

    expect(preview.marks.length).toEqual(13)
    expectInsideViewport(preview)
  })

  it('draws small graphs larger than the base size', () => {
    const preview = buildPreview(graph(['a', 'b'], [{ from: 'a', to: 'b' }]))

    expect(preview.scale).toBeGreaterThan(1)
    expectInsideViewport(preview)
  })
})

function graph(
  ids: string[],
  edges: TokenGraphTile['graph']['edges'],
): TokenGraphTile['graph'] {
  return {
    nodes: ids.map((id) => ({
      id,
      chains: [{ id: 'ethereum', iconUrl: undefined }],
    })),
    edges,
  }
}

function expectInsideViewport(preview: ReturnType<typeof buildPreview>) {
  const ringGap = (SOURCE_RING_GAP / BASE_RADIUS) * preview.scale * BASE_RADIUS
  for (const mark of preview.marks) {
    const ring = mark.isSource ? ringGap : 0
    expect(mark.x - mark.halfWidth - ring).toBeGreaterThanOrEqual(0)
    expect(mark.x + mark.halfWidth + ring).toBeLessThanOrEqual(VIEW_WIDTH)
    expect(mark.y - mark.radius - ring).toBeGreaterThanOrEqual(0)
    expect(mark.y + mark.radius + ring).toBeLessThanOrEqual(VIEW_HEIGHT)
  }
}
