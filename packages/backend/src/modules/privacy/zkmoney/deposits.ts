import type { ZkMoneyDepositParams } from '@l2beat/config'
import type { IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress, type Log } from '@l2beat/shared-pure'
import type { PrivacyRpcContext } from '../types'
import { zkMoneyInterface } from './abi'
import { type LocatedDeposit, locateDeposit } from './operation'

/**
 * - direct: funded by any address other than a SIPA clone
 * - deposit / registration: funded by a factory-authenticated SIPA clone
 * - invalid: a clone of a known implementation the factory does not vouch for
 */
export type DepositSenderKind =
  | 'direct'
  | 'deposit'
  | 'registration'
  | 'invalid'

export interface ZkMoneyDeposit extends LocatedDeposit {
  senderKind: DepositSenderKind
}

export async function resolveDeposit(
  portalEvent: Log,
  params: ZkMoneyDepositParams,
  context: PrivacyRpcContext,
): Promise<ZkMoneyDeposit | undefined> {
  const receipt = await context.receipts.get(portalEvent.transactionHash)
  const located = locateDeposit(receipt, portalEvent, params)
  if (located === undefined) return undefined

  const senderKind = await classifyDepositSender(
    context.rpc,
    params,
    located.sender,
    portalEvent.blockNumber,
  )
  return { ...located, senderKind }
}

const SIPA_INTENT_KINDS: Record<number, DepositSenderKind | undefined> = {
  1: 'deposit',
  2: 'registration',
}

/** The factory checks the clone's code, immutable arguments and deterministic address. */
async function classifyDepositSender(
  rpc: IRpcClient,
  params: ZkMoneyDepositParams,
  sender: EthereumAddress,
  blockNumber: number,
): Promise<DepositSenderKind> {
  const implementation = EthereumAddress(
    String(
      await callFactory(
        rpc,
        params,
        'cloneImplementation',
        sender,
        blockNumber,
      ),
    ),
  )
  const isKnownClone =
    implementation === params.depositImplementation ||
    implementation === params.registrationImplementation
  if (!isKnownClone) return 'direct'

  const intent = Number(
    await callFactory(rpc, params, 'sipaIntentOf', sender, blockNumber),
  )
  return SIPA_INTENT_KINDS[intent] ?? 'invalid'
}

async function callFactory(
  rpc: IRpcClient,
  params: ZkMoneyDepositParams,
  method: 'cloneImplementation' | 'sipaIntentOf',
  sender: EthereumAddress,
  blockNumber: number,
): Promise<unknown> {
  const input = Bytes.fromHex(
    zkMoneyInterface.encodeFunctionData(method, [sender]),
  )
  const result = await rpc.call(
    { to: params.factoryAddress, input },
    blockNumber,
  )
  return zkMoneyInterface.decodeFunctionResult(method, result.toString())[0]
}
