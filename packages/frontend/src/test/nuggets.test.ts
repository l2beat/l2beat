import { KnowledgeNugget, layer2s } from '@l2beat/config'
import { expect } from 'earljs'

const knowledgeNuggets = layer2s.reduce<KnowledgeNugget[]>((nuggets, l2) => {
    nuggets.push(...(l2.knowledgeNuggets || []));
    return nuggets;
}, []);

describe('knowledgeNuggets', () => {
    describe('title fits character limit', () => {
        knowledgeNuggets.forEach(nugget => {
            it(nugget.title, () => {
                expect(nugget.title.length).toBeLessThanOrEqualTo(40);
            })
        });
    });
})
