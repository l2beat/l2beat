/**
 * One realistic contract shared by the validator, executor and output tests.
 *
 * An access-controlled contract with a validator set kept in a mapping and
 * announced by events, a two-key mapping of thresholds, an indexed array, a
 * user balance and a pure quote: together they exercise every fetch kind,
 * every skip reason and every recipe input kind, so a rule tested against
 * this fixture is tested against the shapes V1 configs actually contain.
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'
import { buildWorklist, type Worklist } from '../types/Worklist'

export const CHAIN = 'ethereum'

export const SELF = address('1111111111111111111111111111111111111111')
export const IMPLEMENTATION = address(
  '2222222222222222222222222222222222222222',
)
export const ADMIN = address('3333333333333333333333333333333333333333')
export const OWNER = address('4444444444444444444444444444444444444444')
export const REGISTRY = address('5555555555555555555555555555555555555555')
export const DEPLOYER = address('6666666666666666666666666666666666666666')
export const VALIDATOR_A = address('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
export const VALIDATOR_B = address('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

export const ZERO_HASH = `0x${'0'.repeat(64)}`
export const OPERATOR_ROLE = utils.id('OPERATOR_ROLE')

export const FIXTURE_ABI: string[] = [
  'constructor(address _owner, uint256 _threshold)',
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
  'event ValidatorStatusUpdate(address validatorAddress, bool isActive)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
  'function OPERATOR_ROLE() view returns (bytes32)',
  'function owner() view returns (address)',
  'function registry() view returns (address)',
  'function paused() view returns (bool)',
  'function validatorCount() view returns (uint256)',
  'function getConfig() view returns (tuple(address admin, uint256 delay) config)',
  'function validators(address) view returns (bool)',
  'function committeeThresholds(uint8, uint256) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  'function quote(uint256 amount) pure returns (uint256)',
  'function validatorAt(uint256 index) view returns (address)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
  'function setValidator(address validator, bool active)',
]

export const FIXTURE_SOURCE = `
contract Fixture is AccessControl {
  mapping(address => bool) public validators;
  mapping(uint8 => mapping(uint256 => uint256)) public committeeThresholds;
  address[] private _validatorList;
  uint256 private _totalWeight;
  address public registry;

  function setValidator(address validator, bool active) external onlyOwner {
    validators[validator] = active;
    emit ValidatorStatusUpdate(validator, active);
  }
}
`

export function fixturePrepared(overrides: Partial<Prepared> = {}): Prepared {
  return {
    chain: CHAIN,
    address: SELF,
    blockNumber: 1_000,
    timestamp: 1_700_000_000,
    isEOA: false,
    name: 'Fixture',
    isVerified: true,
    proxy: {
      type: 'EIP1967 proxy',
      values: { $implementation: IMPLEMENTATION, $admin: ADMIN },
      addresses: [SELF, IMPLEMENTATION],
    },
    deployment: {
      deployer: DEPLOYER,
      transactionHash: `0x${'ab'.repeat(32)}`,
      blockNumber: 500,
      timestamp: 1_600_000_000,
    },
    abi: FIXTURE_ABI,
    abis: {
      [SELF.toString()]: [
        'constructor(address _logic, address _admin, bytes _data)',
        'event Upgraded(address indexed implementation)',
      ],
      [IMPLEMENTATION.toString()]: FIXTURE_ABI,
    },
    sources: [
      {
        address: SELF,
        name: 'TransparentUpgradeableProxy',
        hash: `0x${'11'.repeat(32)}`,
        solidityVersion: 'v0.8.20',
        constructorArguments: utils.defaultAbiCoder
          .encode(
            ['address', 'address', 'bytes'],
            [IMPLEMENTATION.slice(4), ADMIN.slice(4), '0x'],
          )
          .slice(2),
        flattened: 'contract TransparentUpgradeableProxy {}',
      },
      {
        address: IMPLEMENTATION,
        name: 'Fixture',
        hash: `0x${'22'.repeat(32)}`,
        solidityVersion: 'v0.8.20',
        constructorArguments: '',
        flattened: FIXTURE_SOURCE,
      },
    ],
    shapeHash: `0x${'22'.repeat(32)}`,
    warnings: [],
    ...overrides,
  }
}

export function fixtureBaseline(overrides: Baseline['fields'] = {}): Baseline {
  return {
    fields: {
      DEFAULT_ADMIN_ROLE: {
        fragment: 'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
        value: ZERO_HASH,
      },
      OPERATOR_ROLE: {
        fragment: 'function OPERATOR_ROLE() view returns (bytes32)',
        value: OPERATOR_ROLE,
      },
      owner: {
        fragment: 'function owner() view returns (address)',
        value: OWNER,
      },
      registry: {
        fragment: 'function registry() view returns (address)',
        value: REGISTRY,
      },
      paused: {
        fragment: 'function paused() view returns (bool)',
        error: 'Execution reverted',
      },
      validatorCount: {
        fragment: 'function validatorCount() view returns (uint256)',
        value: 2,
      },
      getConfig: {
        fragment:
          'function getConfig() view returns (tuple(address admin, uint256 delay) config)',
        value: { admin: ADMIN, delay: 86400 },
      },
      ...overrides,
    },
  }
}

export function fixtureWorklist(): Worklist {
  return buildWorklist(FIXTURE_ABI)
}

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.fromLong(CHAIN, `0x${hex}`)
}
