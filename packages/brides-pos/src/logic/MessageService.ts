import type { Logger } from '@l2beat/backend-tools'
import { formatUnits } from 'viem'
import { getToken } from '../config/tokens'
import { type Listener, Listeners } from '../services/Listeners'
import type {
  CrossChainMessage,
  CrossChainTransfer,
  GnosisBridgeReceive,
  GnosisBridgeSend,
  Hash256,
} from './types'

export interface CrossChainEvent {
  timestamp: string
  protocol: string
  source: string
  destination: string
  token: string
  amount: string
}

export class MessageService {
  constructor(private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  private listeners = new Listeners<CrossChainEvent>()

  private gnosisSend = new Map<Hash256, GnosisBridgeSend>()
  private gnosisReceive = new Map<Hash256, GnosisBridgeReceive>()

  readonly transfers: CrossChainTransfer[] = []

  onMessage(message: CrossChainMessage) {
    this.broadcast(message)

    if (message.type === 'GnosisBridgeSend') {
      const receive = this.gnosisReceive.get(message.messageId)
      if (!receive) {
        this.gnosisSend.set(message.messageId, message)
      } else {
        this.onGnosisCompleted(message, receive)
      }
    }

    if (message.type === 'GnosisBridgeReceive') {
      const send = this.gnosisSend.get(message.messageId)
      if (!send) {
        this.gnosisReceive.set(message.messageId, message)
      } else {
        this.onGnosisCompleted(send, message)
      }
    }
  }

  private onGnosisCompleted(
    send: GnosisBridgeSend,
    receive: GnosisBridgeReceive,
  ) {
    const transfer: CrossChainTransfer = {
      protocol: 'gnosis',
      source: {
        chain: send.sourceChain,
        txHash: send.txHash,
        timestamp: send.timestamp,
        sender: send.sender,
        token: send.token,
        amount: send.amount,
      },
      destination: {
        chain: receive.destinationChain,
        txHash: receive.txHash,
        timestamp: receive.timestamp,
        recipient: receive.recipient,
        token: receive.token,
        amount: receive.amount,
      },
    }
    this.transfers.push(transfer)

    this.logger.info('Gnosis transfer completed', {
      source: send.sourceChain,
      sourceTx: send.txHash,
      destination: receive.destinationChain,
      destinationTx: receive.txHash,
    })
  }

  private broadcast(message: CrossChainMessage) {
    const token = getToken(message.token)
    let amount = formatUnits(message.amount, token.decimals)
    const [a, b = ''] = amount.split('.')
    amount = `${a}.${b.slice(0, 3).padEnd(3, '0')}`

    this.listeners.broadcast({
      timestamp: new Date(message.timestamp * 1000).toISOString(),
      protocol: message.type,
      source: message.sourceChain,
      destination: message.destinationChain,
      token: token.name,
      amount,
    })
  }

  listen(listener: Listener<CrossChainEvent>) {
    this.listeners.add(listener)
    return () => this.listeners.remove(listener)
  }
}
