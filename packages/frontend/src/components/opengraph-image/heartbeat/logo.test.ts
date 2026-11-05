import { expect } from 'earl'
import { logoTreatment, onDarkGround } from './logo'

// Each logo is drawn as SVG, so a case shows the colours it tests. The cases
// stand in for real ones: Shape's black disc, Arbitrum's blue, HashKey's
// white mark on a black square, and a pink logo like Taiko's.
const logo = (body: string) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">${body}</svg>`,
  ).toString('base64')}`

const blackDisc = logo('<circle cx="64" cy="64" r="60" fill="#000000"/>')
const blueSquare = logo('<rect width="128" height="128" fill="#1B4ADD"/>')
const whiteMarkOnBlack = logo(
  '<rect width="128" height="128" fill="#000000"/><rect x="54" y="34" width="20" height="60" fill="#FFFFFF"/>',
)
const pinkDisc = logo('<circle cx="64" cy="64" r="60" fill="#FF3776"/>')

describe(logoTreatment.name, () => {
  it('inverts a near-black logo with nothing light in it', () => {
    expect(logoTreatment(blackDisc)).toEqual('invert')
  })

  it('brightens a logo too dim to read on the dark ground', () => {
    expect(logoTreatment(blueSquare)).toEqual('brighten')
  })

  it('keeps a dark logo whose light mark already reads', () => {
    expect(logoTreatment(whiteMarkOnBlack)).toEqual('keep')
  })

  it('keeps a logo that reads on dark as it is', () => {
    expect(logoTreatment(pinkDisc)).toEqual('keep')
  })
})

describe(onDarkGround.name, () => {
  it('returns a logo that reads on dark untouched, without a glow', () => {
    const { src, glow } = onDarkGround(pinkDisc)

    expect(src).toEqual(pinkDisc)
    expect(glow).toEqual(false)
  })

  it('finds where a logo is drawn inside its file', () => {
    const dotLeftOfCentre = logo(
      '<circle cx="32" cy="64" r="16" fill="#FF3776"/>',
    )

    expect(onDarkGround(dotLeftOfCentre).ink).toEqual({
      x0: 0.125,
      y0: 0.375,
      x1: 0.375,
      y1: 0.625,
    })
  })

  it('redraws a black logo as one that reads on dark without a glow', () => {
    const { src, glow } = onDarkGround(blackDisc)

    expect(logoTreatment(src)).toEqual('keep')
    expect(glow).toEqual(false)
  })

  it('puts a glow behind a dark logo kept for its light mark', () => {
    expect(onDarkGround(whiteMarkOnBlack).glow).toEqual(true)
  })
})
