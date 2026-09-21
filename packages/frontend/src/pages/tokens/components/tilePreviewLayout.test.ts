import { expect } from 'earl'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { buildPreview, VIEW_HEIGHT, VIEW_WIDTH } from './tilePreviewLayout'

describe(buildPreview.name, () => {
  it('keeps a wide star inside the viewport', () => {
    const targets = Array.from({ length: 30 }, (_, i) => `t${i}`)
    const preview = buildPreview(
      graph(
        ['src', ...targets],
        targets.map((to) => ({ backer: 'src', backed: to })),
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
        ids.slice(1).map((to, i) => ({ backer: ids[i] as string, backed: to })),
      ),
    )

    expect(preview.marks.length).toEqual(13)
    expectInsideViewport(preview)
  })

  it('draws small graphs larger than the base size', () => {
    const preview = buildPreview(
      graph(['a', 'b'], [{ backer: 'a', backed: 'b' }]),
    )

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
      volume: null,
    })),
    edges,
  }
}

function expectInsideViewport(preview: ReturnType<typeof buildPreview>) {
  for (const mark of preview.marks) {
    expect(mark.x - mark.halfWidth).toBeGreaterThanOrEqual(0)
    expect(mark.x + mark.halfWidth).toBeLessThanOrEqual(VIEW_WIDTH)
    expect(mark.y - mark.radius).toBeGreaterThanOrEqual(0)
    expect(mark.y + mark.radius).toBeLessThanOrEqual(VIEW_HEIGHT)
  }
}
