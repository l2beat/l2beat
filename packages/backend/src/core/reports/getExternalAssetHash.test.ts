import { AssetId, ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getExternalAssetsHash } from './getExternalAssetHash'

describe(getExternalAssetsHash.name, () => {
  it('hash changes if asset added', () => {
    const assetsBefore = {
      chainId: ChainId.ETHEREUM,
      assets: [],
    }
    const assetsAfter = {
      ...assetsBefore,
      assets: [
        ...assetsBefore.assets,
        fakeAsset('nice-token', 'fafafefe', 737459345),
      ],
    }
    const hashBefore = getExternalAssetsHash(assetsBefore)
    const hashAfter = getExternalAssetsHash(assetsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if asset is removed', () => {
    const assetsBefore = {
      chainId: ChainId.ETHEREUM,
      assets: [
        fakeAsset('nice-token', 'fafafefe', 737459345),
        fakeAsset('good-token', 'fefefafa', 23978532475),
      ],
    }
    const assetsAfter = {
      ...assetsBefore,
      assets: [assetsBefore.assets[0]],
    }
    const hashBefore = getExternalAssetsHash(assetsBefore)
    const hashAfter = getExternalAssetsHash(assetsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if asset name changes', () => {
    const assetsBefore = {
      chainId: ChainId.ETHEREUM,
      assets: [
        fakeAsset('nice-token', 'fafafefe', 737459345),
        fakeAsset('good-token', 'fefefafa', 23978532475),
      ],
    }
    const assetsAfter = {
      ...assetsBefore,
      assets: [
        assetsBefore.assets[0],
        fakeAsset('good2-token', 'fefefafa', 23978532475),
      ],
    }
    const hashBefore = getExternalAssetsHash(assetsBefore)
    const hashAfter = getExternalAssetsHash(assetsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if chainId changes', () => {
    const assetsBefore = {
      chainId: ChainId.ETHEREUM,
      assets: [
        fakeAsset('nice-token', 'fafafefe', 737459345),
        fakeAsset('good-token', 'fefefafa', 23978532475),
      ],
    }
    const assetsAfter = {
      ...assetsBefore,
      chainId: ChainId.ARBITRUM,
    }
    const hashBefore = getExternalAssetsHash(assetsBefore)
    const hashAfter = getExternalAssetsHash(assetsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if the assets order changes', () => {
    const assetsBefore = {
      chainId: ChainId.ETHEREUM,
      assets: [
        fakeAsset('nice-token', 'fafafefe', 737459345),
        fakeAsset('good-token', 'fefefafa', 23978532475),
      ],
    }
    const assetsAfter = {
      ...assetsBefore,
      assets: [assetsBefore.assets[1], assetsBefore.assets[0]],
    }
    const hashBefore = getExternalAssetsHash(assetsBefore)
    const hashAfter = getExternalAssetsHash(assetsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})

function fakeAsset(id: string, address: string, timestamp: number) {
  return {
    assetId: AssetId(id),
    tokenAddress: '0x' + address + '0'.repeat(40 - address.length),
    sinceTimestamp: new UnixTime(timestamp),
    decimals: 18,
    premintHolderAddresses: [],
  }
}
