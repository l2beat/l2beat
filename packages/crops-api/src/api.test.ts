import { expect } from 'earl'
import { resolveCropsProject } from './api'
import { ATTESTATIONS, FIXTURE_INPUT, gardenOf, UNISWAP } from './test/fixtures'

describe(resolveCropsProject.name, () => {
  // Listed only in the top band, so `inGarden` shows which band was read.
  const { good } = UNISWAP.garden.verdicts
  const unlisted = gardenOf(null, { ...good, listing: 'noOssificationScore' })
  const project = {
    ...UNISWAP,
    garden: { ...unlisted, verdicts: { ...unlisted.verdicts, good } },
  }
  const resolve = (source: typeof project) =>
    resolveCropsProject(source, ATTESTATIONS, FIXTURE_INPUT.generatedAt)

  it('serves the verdict for the band the score is in at generatedAt', () => {
    expect(resolve(project).inGarden).toEqual(true)
  })

  it('serves the unscored verdict without an ossification history', () => {
    const { ossificationHistory: _, ...unmeasured } = project
    expect(resolve(unmeasured).inGarden).toEqual(false)
  })
})
