import { ProjectId, TokenId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { ProjectTvsConfigSchema } from '../types'

describe('tvs', () => {
  const projects = getProjects().filter((p) => p.tvsConfig)

  it(`throws when token config has wrong schema`, () => {
    const mockTvsConfig = {
      projectId: ProjectId('project'),
      tokens: [
        {
          mode: 'auto',
          id: TokenId('token-1'),
          priceId: 'price-id',
          symbol: 'TKN',
          name: 'Token',
          amount: {
            type: 'totalSupply',
            address: 'wrong-address',
            chain: 'chain',
            decimals: 18,
            sinceTimestamp: 1729881083,
          },
          category: 'wrong-category',
          source: 'canonical',
          isAssociated: false,
        },
      ],
    }

    const expectedErrors = [
      {
        code: 'custom',
        message: 'Failed to transform to EthereumAddress type',
        path: ['tokens', 0, 'amount', 'address'],
      },
      {
        received: 'wrong-category',
        code: 'invalid_enum_value',
        options: ['ether', 'stablecoin', 'other'],
        path: ['tokens', 0, 'category'],
        message:
          "Invalid enum value. Expected 'ether' | 'stablecoin' | 'other', received 'wrong-category'",
      },
    ]

    expect(() => ProjectTvsConfigSchema.parse(mockTvsConfig)).toThrow(
      JSON.stringify(expectedErrors, null, 2),
    )
  })

  for (const project of projects) {
    it(`project ${project.id} has correct tvs config`, () => {
      const tokenIds = new Set<string>()
      for (const token of project.tvsConfig!) {
        // token has unique id within the project
        expect(tokenIds.has(token.id)).toEqual(false)
        tokenIds.add(token.id)
      }
    })
  }
})
