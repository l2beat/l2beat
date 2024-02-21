import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const nil: Layer2 = upcoming({
    id: '=nil;',
    display: {
        name: '=nil;',
        slug: 'nil',
        description:
            "=nil; is a zkRollup that securely scales Ethereum through zkSharding, empowering web3 developers to build scalable and composable applications.",
        purposes: ['Universal'],
        category: 'ZK Rollup',
        links: {
            websites: ['https://nil.foundation/'],
            apps: [],
            documentation: ['https://docs.nil.foundation/nil/'],
            explorers: [],
            repositories: [],
            socialMedia: [
                'https://twitter.com/nil_foundation',
            ],
        },
    },
})
