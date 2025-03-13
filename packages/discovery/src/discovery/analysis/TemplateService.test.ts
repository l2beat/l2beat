import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { getDiscoveryPaths } from '../config/getDiscoveryPaths'
import { type Shape, TemplateService } from './TemplateService'

const CORRECT_SUPERCHAIN_CONFIG_ADDR = EthereumAddress(
  '0x95703e0982140D16f8ebA6d158FccEde42f04a4C',
)
const FAKE_SUPERCHAIN_CONFIG_ADDR = EthereumAddress(
  '0x26C7bFB430d68Bf74d2d52497836d4336b555dE7',
)
const CORRECT_SUPERCHAIN_CONFIG_IMPLEMENATION_HASH = Hash256(
  '0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d',
)

const CORRECT_SUPERCHAIN_SOURCES_HASH = Hash256(
  '0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d',
)

describe(TemplateService.prototype.findMatchingTemplatesByHash.name, () => {
  const paths = getDiscoveryPaths()

  it("doesn't match opstack/SuperchainConfig because address is not in validAddresses", () => {
    const templateService = new TemplateService(paths.discovery)
    templateService.getAllShapes = mockFn().returns(templateShapes)
    const result = templateService.findMatchingTemplatesByHash(
      CORRECT_SUPERCHAIN_SOURCES_HASH,
      FAKE_SUPERCHAIN_CONFIG_ADDR,
    )
    expect(result).toEqual(['opstack/SuperchainConfigFake'])
  })

  it('matches ONLY opstack/SuperchainConfig because address is in validAddresses and is more specific', () => {
    const templateService = new TemplateService(paths.discovery)
    templateService.getAllShapes = mockFn().returns(templateShapes)
    const result = templateService.findMatchingTemplatesByHash(
      CORRECT_SUPERCHAIN_SOURCES_HASH,
      CORRECT_SUPERCHAIN_CONFIG_ADDR,
    )
    // The opstack/SuperchainConfigFake template is not returned
    // even though there is an implementation match. That's because
    // the more specific match (criteria+hash) is found.
    expect(result).toEqual(['opstack/SuperchainConfig'])
  })
})

const templateShapes: Record<string, Shape> = {
  'opstack/SuperchainConfig': {
    criteria: {
      validAddresses: [CORRECT_SUPERCHAIN_CONFIG_ADDR.toString()],
    },
    hashes: [CORRECT_SUPERCHAIN_CONFIG_IMPLEMENATION_HASH],
  },
  'opstack/SuperchainConfigFake': {
    hashes: [
      Hash256(
        '0x65dcaf0bdde7cc90f916020b1615321a4b086bfd802f2c27f6ed226fc486b65d',
      ),
      CORRECT_SUPERCHAIN_CONFIG_IMPLEMENATION_HASH,
    ],
  },
  'opstack/SystemConfig': {
    hashes: [
      Hash256(
        '0x5c566f7b9bd649708500a4ea89e4031d2dad1273ce56f6cb5e67d0193f136eb1',
      ),
      Hash256(
        '0x8594410431f0c8cc86d641b9954c3ad91e81fecc79f25ec8d62b294c44201533',
      ),
    ],
  },
}
