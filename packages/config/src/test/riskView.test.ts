import type { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { MochaTestContext } from 'earl/dist/cjs/validators/snapshots/TestContext'
import { layer2s } from '../processing/layer2s'
import { layer3s } from '../processing/layer3s'

describe('riskView', () => {
  for (const l2 of layer2s) {
    if (l2.isUpcoming) {
      continue
    }
    const title = `${l2.id.toString()} riskView didn't change`
    const context = getContext(title, l2.id)
    it(title, () => {
      expect(l2.riskView).toMatchSnapshot(context)
    })
  }

  for (const l3 of layer3s) {
    if (l3.isUpcoming) {
      continue
    }
    const title = `${l3.id.toString()} riskView didn't change`
    const context = getContext(title, l3.id)
    it(title, () => {
      expect(l3.riskView).toMatchSnapshot(context)
    })
  }

  for (const l3 of layer3s) {
    if (l3.isUpcoming) {
      continue
    }
    const title = `${l3.id.toString()} stackedRiskView didn't change`
    const context = getContext(title, l3.id)
    it(title, () => {
      expect(l3.stackedRiskView).toMatchSnapshot(context)
    })
  }
})

function getContext(title: string, projectId: ProjectId): MochaTestContext {
  return {
    test: {
      fullTitle: () => title,
      file: `${__dirname}/snapshots/${projectId.toString()}.riskView`,
    },
  }
}
