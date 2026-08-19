import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { ChainRecord } from './ChainRepository'
import type {
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
} from './DeployedTokenRepository'
import {
  type JsonValue,
  normalizeTokenRelation,
  type TokenRelationLockedToken,
  type TokenRelationRecord,
  TokenRelationRepository,
} from './TokenRelationRepository'

describeTokenDatabase(TokenRelationRepository.name, (db) => {
  const repository = db.tokenRelation
  const deployedTokens = db.deployedToken
  const chains = db.chain

  const ethereumToken: DeployedTokenPrimaryKey = {
    chain: 'ethereum',
    address: '0x' + '1'.repeat(40),
  }
  const arbitrumToken: DeployedTokenPrimaryKey = {
    chain: 'arbitrum',
    address: '0x' + '2'.repeat(40),
  }
  const optimismToken: DeployedTokenPrimaryKey = {
    chain: 'optimism',
    address: '0x' + '3'.repeat(40),
  }

  beforeEach(async () => {
    await chains.insert(mockChain({ name: 'ethereum', chainId: 1 }))
    await chains.insert(mockChain({ name: 'arbitrum', chainId: 42161 }))
    await chains.insert(mockChain({ name: 'optimism', chainId: 10 }))

    await deployedTokens.insert(deployedToken(ethereumToken))
    await deployedTokens.insert(deployedToken(arbitrumToken))
    await deployedTokens.insert(deployedToken(optimismToken))
  })

  afterEach(async () => {
    await repository.deleteAll()
    await deployedTokens.deleteAll()
    await chains.deleteAll()
  })

  describe(TokenRelationRepository.prototype.insert.name, () => {
    it('inserts new records', async () => {
      const relations = [
        tokenRelation({
          endpoints: [ethereumToken, arbitrumToken],
          plugin: 'superbridge',
          bridgeType: 'burnAndMint',
        }),
        tokenRelation({
          endpoints: [arbitrumToken, optimismToken],
          plugin: 'otherbridge',
          bridgeType: 'lockAndMint',
        }),
      ]

      for (const relation of relations) {
        await repository.insert(relation)
      }

      expect(await repository.getAll()).toEqualUnsorted(relations)
    })

    it('inserts a relation whose endpoints are not catalogued as deployed tokens', async () => {
      // Load-bearing: relations are observations of on-chain transfers and
      // must be recordable before either endpoint exists in DeployedToken.
      // See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
      const relation = tokenRelation({
        endpoints: [
          { chain: 'ethereum', address: '0x' + '9'.repeat(40) },
          { chain: 'arbitrum', address: '0x' + '8'.repeat(40) },
        ],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })

      await repository.insert(relation)

      expect(await repository.getAll()).toEqual([relation])
    })

    it('keeps two relations for the same pair with different bridge types', async () => {
      const lockAndMint = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'lockAndMint',
      })
      const burnAndMint = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })

      await repository.insert(lockAndMint)
      await repository.insert(burnAndMint)

      expect(await repository.getAll()).toEqualUnsorted([
        lockAndMint,
        burnAndMint,
      ])
    })

    it('stores one row per pair regardless of the order the endpoints arrive in', async () => {
      // Load-bearing: a relation is a fact about an unordered pair. The two
      // observed transfer directions of one bridge route must not become two
      // rows. See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
      const forward = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'lockAndMint',
        lockedToken: 'A',
        transfer: { transferId: 'deposit' },
      })
      const reversed = tokenRelation({
        endpoints: [arbitrumToken, ethereumToken],
        plugin: 'superbridge',
        bridgeType: 'lockAndMint',
        lockedToken: 'B',
        transfer: { transferId: 'deposit' },
      })

      // Both observations describe the same pair with the same locked endpoint.
      expect(forward).toEqual(reversed)

      await repository.insert(forward)
      await expect(repository.insert(reversed)).toBeRejected()
    })
  })

  describe(normalizeTokenRelation.name, () => {
    it('orders the endpoints and moves the locked token with them', () => {
      // arbitrum sorts before ethereum, so the endpoints have to be swapped.
      expect(
        normalizeTokenRelation({
          tokenAChain: ethereumToken.chain,
          tokenAAddress: ethereumToken.address.toUpperCase(),
          tokenBChain: arbitrumToken.chain,
          tokenBAddress: arbitrumToken.address,
          plugin: 'superbridge',
          bridgeType: 'lockAndMint',
          lockedToken: 'A',
        }),
      ).toEqual({
        tokenAChain: arbitrumToken.chain,
        tokenAAddress: arbitrumToken.address,
        tokenBChain: ethereumToken.chain,
        tokenBAddress: ethereumToken.address,
        plugin: 'superbridge',
        bridgeType: 'lockAndMint',
        lockedToken: 'B',
      })
    })

    it('leaves already ordered endpoints alone', () => {
      const ordered = {
        tokenAChain: arbitrumToken.chain,
        tokenAAddress: arbitrumToken.address,
        tokenBChain: optimismToken.chain,
        tokenBAddress: optimismToken.address,
        plugin: 'superbridge',
        bridgeType: 'burnAndMint' as const,
        lockedToken: null,
      }

      expect(normalizeTokenRelation(ordered)).toEqual(ordered)
    })
  })

  describe(TokenRelationRepository.prototype.findByPrimaryKey.name, () => {
    it('returns a relation by its full identity', async () => {
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      await repository.insert(relation)

      expect(await repository.findByPrimaryKey(relation)).toEqual(relation)
    })
  })

  describe(TokenRelationRepository.prototype.getByPrimaryKeys.name, () => {
    it('returns only the relations matching the requested identities', async () => {
      const relationA = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      const relationB = tokenRelation({
        endpoints: [arbitrumToken, optimismToken],
        plugin: 'otherbridge',
        bridgeType: 'lockAndMint',
      })
      await repository.insert(relationA)
      await repository.insert(relationB)

      expect(await repository.getByPrimaryKeys([relationB])).toEqual([
        relationB,
      ])
    })

    it('handles more identities than fit in a single query batch', async () => {
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      await repository.insert(relation)

      const missingRelations = Array.from({ length: 2_000 }, (_, index) => ({
        ...relation,
        tokenAAddress: `0x${index.toString(16).padStart(40, '0')}`,
      }))

      expect(
        await repository.getByPrimaryKeys([...missingRelations, relation]),
      ).toEqual([relation])
    })
  })

  describe(TokenRelationRepository.prototype.getAllRoutes.name, () => {
    it('returns relation identities without transfer evidence', async () => {
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
        transfer: { large: 'evidence' },
      })
      await repository.insert(relation)

      expect(await repository.getAllRoutes()).toEqual([
        {
          tokenAChain: relation.tokenAChain,
          tokenAAddress: relation.tokenAAddress,
          tokenBChain: relation.tokenBChain,
          tokenBAddress: relation.tokenBAddress,
          plugin: relation.plugin,
          bridgeType: relation.bridgeType,
          lockedToken: relation.lockedToken,
        },
      ])
    })
  })

  describe(TokenRelationRepository.prototype.updateByPrimaryKey.name, () => {
    it('updates the evidence transfer without changing identity columns', async () => {
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      await repository.insert(relation)

      const updatedTransfer = {
        transferId: 'transfer-updated',
        plugin: 'superbridge',
      }
      const updatedRows = await repository.updateByPrimaryKey(relation, {
        transfer: updatedTransfer,
      })

      expect(updatedRows).toEqual(1)
      expect(await repository.findByPrimaryKey(relation)).toEqual({
        ...relation,
        transfer: updatedTransfer,
      })
    })

    it('fills in a locked token that no observation had identified yet', async () => {
      // `lockedToken` is outside the primary key precisely so that a later
      // observation can resolve an unknown role without recreating the row.
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'lockAndMint',
        lockedToken: null,
      })
      await repository.insert(relation)

      expect(
        await repository.updateByPrimaryKey(relation, {
          lockedToken: 'A',
        }),
      ).toEqual(1)
      expect(await repository.findByPrimaryKey(relation)).toEqual({
        ...relation,
        lockedToken: 'A',
      })
    })
  })

  describe(TokenRelationRepository.prototype.getRelationsFor.name, () => {
    it('returns relations mentioning the token on either endpoint', async () => {
      const onFirstEndpoint = tokenRelation({
        endpoints: [arbitrumToken, optimismToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      const onSecondEndpoint = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'otherbridge',
        bridgeType: 'lockAndMint',
      })
      const unrelated = tokenRelation({
        endpoints: [ethereumToken, optimismToken],
        plugin: 'thirdbridge',
        bridgeType: 'lockAndMint',
      })
      await repository.insert(onFirstEndpoint)
      await repository.insert(onSecondEndpoint)
      await repository.insert(unrelated)

      expect(await repository.getRelationsFor(arbitrumToken)).toEqualUnsorted([
        onFirstEndpoint,
        onSecondEndpoint,
      ])
    })
  })

  describe(TokenRelationRepository.prototype.getMintingPluginsFor.name, () => {
    it('returns plugins of relations where the token is minted or the pair is symmetric', async () => {
      const mintedHere = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'canonicalbridge',
        bridgeType: 'lockAndMint',
        // The ethereum endpoint is locked, so the arbitrum token is minted.
        lockedToken: 'A',
      })
      const symmetric = tokenRelation({
        endpoints: [arbitrumToken, optimismToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      const lockedHere = tokenRelation({
        endpoints: [arbitrumToken, ethereumToken],
        plugin: 'escrowbridge',
        bridgeType: 'lockAndMint',
        // The arbitrum token itself is locked — the plugin mints the other one.
        lockedToken: 'A',
      })
      const unknownRole = tokenRelation({
        endpoints: [arbitrumToken, optimismToken],
        plugin: 'mysterybridge',
        bridgeType: 'lockAndMint',
        // One of the endpoints is minted, but nothing says it is this one.
        lockedToken: null,
      })
      const nonMintingPair = tokenRelation({
        endpoints: [arbitrumToken, optimismToken],
        plugin: 'poolbridge',
        // Only a burnAndMint pair is symmetric; a nonMinting one (possible via
        // a human-added relation) mints nothing.
        bridgeType: 'nonMinting',
      })
      const otherPair = tokenRelation({
        endpoints: [ethereumToken, optimismToken],
        plugin: 'unrelatedbridge',
        bridgeType: 'burnAndMint',
      })
      const relations = [
        mintedHere,
        symmetric,
        lockedHere,
        unknownRole,
        nonMintingPair,
        otherPair,
      ]
      for (const relation of relations) {
        await repository.insert(relation)
      }

      expect(await repository.getMintingPluginsFor(arbitrumToken)).toEqual([
        'canonicalbridge',
        'superbridge',
      ])
    })

    it('finds the minted token on either endpoint slot', async () => {
      // Normalizes to arbitrum in slot A, with ethereum (slot B) locked.
      const mintedAtA = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'slot-a-bridge',
        bridgeType: 'lockAndMint',
        lockedToken: 'A',
      })
      // An uncatalogued arbitrum token sorting first stays in slot A and is
      // locked, leaving the queried token minted in slot B.
      const mintedAtB = tokenRelation({
        endpoints: [
          { chain: 'arbitrum', address: '0x' + '0'.repeat(40) },
          arbitrumToken,
        ],
        plugin: 'slot-b-bridge',
        bridgeType: 'lockAndMint',
        lockedToken: 'A',
      })
      await repository.insert(mintedAtA)
      await repository.insert(mintedAtB)

      expect(await repository.getMintingPluginsFor(arbitrumToken)).toEqual([
        'slot-a-bridge',
        'slot-b-bridge',
      ])
    })

    it('returns each plugin once even when several of its relations qualify', async () => {
      const viaEthereum = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      const viaOptimism = tokenRelation({
        endpoints: [arbitrumToken, optimismToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      await repository.insert(viaEthereum)
      await repository.insert(viaOptimism)

      expect(await repository.getMintingPluginsFor(arbitrumToken)).toEqual([
        'superbridge',
      ])
    })

    it('normalizes the queried address', async () => {
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      await repository.insert(relation)

      expect(
        await repository.getMintingPluginsFor({
          chain: arbitrumToken.chain,
          address: arbitrumToken.address.toUpperCase(),
        }),
      ).toEqual(['superbridge'])
    })
  })

  describe(TokenRelationRepository.prototype.deleteByPrimaryKey.name, () => {
    it('deletes a single relation by its identity', async () => {
      const relation = tokenRelation({
        endpoints: [ethereumToken, arbitrumToken],
        plugin: 'superbridge',
        bridgeType: 'burnAndMint',
      })
      await repository.insert(relation)

      expect(await repository.deleteByPrimaryKey(relation)).toEqual(1)
      expect(await repository.getAll()).toEqual([])
    })
  })
})

interface TokenRelationInput {
  // Deliberately not named A and B: the pair is given in whatever order a write
  // path happens to see it, and `normalizeTokenRelation` decides which endpoint
  // ends up in which slot.
  endpoints: [DeployedTokenPrimaryKey, DeployedTokenPrimaryKey]
  plugin: string
  bridgeType: TokenRelationRecord['bridgeType']
  lockedToken?: TokenRelationLockedToken
  transfer?: JsonValue
}

function tokenRelation(input: TokenRelationInput): TokenRelationRecord {
  const [first, second] = input.endpoints
  return normalizeTokenRelation({
    tokenAChain: first.chain,
    tokenAAddress: first.address,
    tokenBChain: second.chain,
    tokenBAddress: second.address,
    plugin: input.plugin,
    bridgeType: input.bridgeType,
    lockedToken: input.lockedToken ?? null,
    transfer:
      input.transfer ??
      ({
        transferId: `${input.plugin}:${first.chain}:${second.chain}`,
        plugin: input.plugin,
      } satisfies Record<string, unknown>),
  })
}

function deployedToken(pk: DeployedTokenPrimaryKey): DeployedTokenRecord {
  return {
    chain: pk.chain,
    address: pk.address.toLowerCase(),
    abstractTokenId: null,
    symbol: 'TOKEN',
    decimals: 18,
    deploymentTimestamp: UnixTime(1),
    comment: null,
    ignored: false,
    metadata: null,
    abstractTokenAssignmentProof: null,
  }
}

function mockChain(props: Partial<ChainRecord>): ChainRecord {
  return {
    name: 'ethereum',
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
    aliases: null,
    apis: null,
    ...props,
  }
}
