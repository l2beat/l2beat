import { KnowledgeNugget, layer2s } from '@l2beat/config'
import { expect } from 'earljs'

const knowledgeNuggets = layer2s.flatMap<KnowledgeNugget>(nugget => nugget.knowledgeNuggets ?? [])

describe('knowledgeNuggets', () => {
  describe('title fits character limit', () => {
    knowledgeNuggets.forEach((nugget) => {
      it(nugget.title, () => {
        expect(nugget.title.length).toBeLessThanOrEqualTo(40)
      })
    })
  })
})
