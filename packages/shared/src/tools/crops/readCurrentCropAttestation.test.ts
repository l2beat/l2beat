import { Bytes } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import type { EVMLog } from '../../clients/rpc/types'
import type { LogsTopicFilter } from '../../clients/types'
import {
  type CropAttestationCandidate,
  type CropAttestationRpc,
  pickCurrentCropAttestation,
  readCurrentCropAttestation,
} from './readCurrentCropAttestation'
import fixture from './sepolia.fixture.json'

const SOURCE = {
  eas: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
  schema: 'string[] projectIds,uint64 reviewedAt,uint32 revision',
  schemaUid:
    '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb',
  attester: '0x19BEC50A4e61B0e1540C37cEB3F62f56AAfb74DB',
  startBlock: 11920203,
}
const EAS = new utils.Interface([
  'function getAttestation(bytes32 uid) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data))',
])

const toLog = (raw: typeof fixture.log): EVMLog => ({
  ...raw,
  blockNumber: Number(raw.blockNumber),
  logIndex: Number(raw.logIndex),
})

/** Serves the given logs, and each uid's getAttestation result. */
function fakeRpc(logs: EVMLog[], records: Record<string, string>) {
  const getLogsCalls: [number, number, string[]?, LogsTopicFilter?][] = []
  const rpc: CropAttestationRpc = {
    getLatestBlockNumber: async () => fixture.latestBlock,
    getLogs: async (from, to, addresses, topics) => {
      getLogsCalls.push([from, to, addresses, topics])
      return logs
    },
    call: async ({ input }) => {
      const [uid] = EAS.decodeFunctionData('getAttestation', input.toString())
      return Bytes.fromHex(records[uid.toLowerCase()])
    },
  }
  return { rpc, getLogsCalls }
}

/** A getAttestation result for a synthetic attestation by `attester`. */
function record(
  uid: string,
  payload: [string[], number, number] | string,
  overrides: { attester?: string; revocationTime?: number } = {},
): string {
  const data =
    typeof payload === 'string'
      ? payload
      : utils.defaultAbiCoder.encode(['string[]', 'uint64', 'uint32'], payload)
  return EAS.encodeFunctionResult('getAttestation', [
    [
      uid,
      SOURCE.schemaUid,
      1792022400,
      0,
      overrides.revocationTime ?? 0,
      utils.hexZeroPad('0x', 32),
      utils.hexZeroPad('0x', 20),
      overrides.attester ?? SOURCE.attester,
      true,
      data,
    ],
  ])
}

const uid = (n: number) => utils.hexZeroPad(utils.hexlify(n), 32)
const logFor = (id: string, blockNumber: number): EVMLog => ({
  ...toLog(fixture.log),
  data: id,
  blockNumber,
})

describe(readCurrentCropAttestation.name, () => {
  it('reads the attester Safe revision 1 from Sepolia responses', async () => {
    const log = toLog(fixture.log)
    const { rpc, getLogsCalls } = fakeRpc([log], {
      [log.data.toLowerCase()]: fixture.record,
    })

    const current = await readCurrentCropAttestation(rpc, SOURCE)

    expect(current).toEqual({
      uid: '0x2f31d8c9018e2718ea82f4df9612ff7f95534cd0f41d44337f5d75e92adad112',
      revision: 1,
      reviewedAt: 1792022400,
      projectIds: ['aztecnetwork'],
      txHash:
        '0x4eb819ead5f0b61142f0b567214eddd83ba653b9735592a6485d982ce7361116',
      blockNumber: 11921020,
    })
    expect(getLogsCalls).toEqual([
      [
        SOURCE.startBlock,
        fixture.latestBlock,
        [SOURCE.eas],
        [
          utils.id('Attested(address,address,bytes32,bytes32)'),
          null,
          `0x${'0'.repeat(24)}${SOURCE.attester.slice(2).toLowerCase()}`,
          SOURCE.schemaUid,
        ],
      ],
    ])
  })

  it('ignores a record made by another attester, whatever the log says', async () => {
    const other = fixture.otherAttester
    const { rpc } = fakeRpc([logFor(other.uid, 1)], {
      [other.uid]: other.raw,
    })
    expect(await readCurrentCropAttestation(rpc, SOURCE)).toEqual(undefined)
  })

  it('takes the highest revision, skipping revoked and undecodable ones', async () => {
    const { rpc } = fakeRpc(
      [
        logFor(uid(1), 10),
        logFor(uid(2), 20),
        logFor(uid(3), 30),
        logFor(uid(4), 40),
      ],
      {
        [uid(1)]: record(uid(1), [['umbra'], 1, 1]),
        [uid(2)]: record(uid(2), [['umbra', 'safe'], 2, 2]),
        [uid(3)]: record(uid(3), [['safe'], 3, 3], { revocationTime: 5 }),
        [uid(4)]: record(uid(4), '0x1234'),
      },
    )
    const current = await readCurrentCropAttestation(rpc, SOURCE)
    expect(current?.uid).toEqual(uid(2))
    expect(current?.projectIds).toEqual(['umbra', 'safe'])
  })

  it('returns undefined when the attester has not attested', async () => {
    const { rpc } = fakeRpc([], {})
    expect(await readCurrentCropAttestation(rpc, SOURCE)).toEqual(undefined)
  })
})

describe(pickCurrentCropAttestation.name, () => {
  const at = (
    revision: number,
    blockNumber: number,
    logIndex = 0,
  ): CropAttestationCandidate => ({
    uid: uid(revision * 100 + blockNumber * 10 + logIndex),
    revision,
    reviewedAt: 0,
    projectIds: [],
    txHash: '0x',
    blockNumber,
    logIndex,
  })

  it('picks the highest revision, and the later one on a tie', () => {
    expect(pickCurrentCropAttestation([at(1, 5), at(3, 6), at(2, 9)])).toEqual(
      at(3, 6),
    )
    expect(pickCurrentCropAttestation([at(2, 9), at(2, 4)])).toEqual(at(2, 9))
    expect(pickCurrentCropAttestation([at(2, 9, 3), at(2, 9, 7)])).toEqual(
      at(2, 9, 7),
    )
    expect(pickCurrentCropAttestation([])).toEqual(undefined)
  })
})
