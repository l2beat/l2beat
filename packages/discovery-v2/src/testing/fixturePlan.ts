/**
 * A plan that is fully valid against the fixture contract.
 *
 * It uses every fetch kind and every recipe input kind so the validator test
 * can mutate one field at a time and know that the finding it sees is the
 * one it caused, and so the executor test runs the same steps end to end.
 */
import type { Plan } from '../plan/Plan'
import { OPERATOR_ROLE } from './fixture'

export function fixturePlan(): Plan {
  return {
    version: 1,
    contract: 'Fixture',
    shapeHash: `0x${'22'.repeat(32)}`,
    steps: [
      {
        id: 'accessControl',
        covers: ['hasRole(bytes32,address)', 'getRoleAdmin(bytes32)'],
        fetch: {
          kind: 'logs',
          events: ['RoleGranted', 'RoleRevoked', 'RoleAdminChanged'],
        },
        use: 'accessControl@1',
        args: { roleNames: { [OPERATOR_ROLE]: 'OPERATOR_ROLE' } },
        reason:
          'OpenZeppelin AccessControl; hasRole and getRoleAdmin are answered by the role table',
      },
      {
        id: 'validators',
        covers: ['validators(address)'],
        fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
        use: 'set@1',
        args: {
          key: 'validatorAddress',
          add: [
            {
              event: 'ValidatorStatusUpdate',
              when: { arg: 'isActive', equals: true },
            },
          ],
          remove: [
            {
              event: 'ValidatorStatusUpdate',
              when: { arg: 'isActive', equals: true, negate: true },
            },
          ],
        },
        reason:
          'validators is written only in setValidator, which emits ValidatorStatusUpdate',
      },
      {
        id: 'committeeThresholds',
        covers: ['committeeThresholds(uint8,uint256)'],
        fetch: {
          kind: 'callEach',
          method: 'committeeThresholds(uint8,uint256)',
          keys: {
            literal: [
              [1, 0],
              [1, 1],
              [2, 0],
            ],
          },
        },
        use: 'map@1',
        reason: 'keys are the enum values used in setThresholds',
      },
      {
        id: 'validatorAt',
        covers: ['validatorAt(uint256)'],
        fetch: {
          kind: 'callEach',
          method: 'validatorAt(uint256)',
          keys: { range: { length: '$baseline.validatorCount' } },
        },
        use: 'array@1',
        reason:
          'validatorAt indexes _validatorList whose length is validatorCount',
      },
      {
        id: 'guardian',
        fetch: {
          kind: 'call',
          method: 'function guardian() view returns (address)',
          at: '$baseline.registry',
        },
        reason: 'the registry guardian can pause this contract',
      },
      {
        id: 'constructorArgs',
        fetch: { kind: 'constructorArgs' },
        reason:
          'the proxy constructor fixes the initial implementation and admin',
      },
      {
        id: '_totalWeight',
        fetch: { kind: 'storage', slot: 3, as: 'uint' },
        reason: '_totalWeight is private and has no getter',
      },
    ],
    skips: [
      { item: 'balanceOf(address)', reason: 'user-activity' },
      { item: 'quote(uint256)', reason: 'computation' },
      { item: 'supportsInterface(bytes4)', reason: 'not-state' },
    ],
  }
}
