import { formatUnits } from 'viem'
import { getToken } from '../config/tokens'
import { type Listener, Listeners } from '../services/Listeners'
import type { CrossChainSend } from './types'

export interface CrossChainEvent {
  timestamp: string
  protocol: string
  source: string
  destination: string
  token: string
  amount: string
}

export class MessageService {
  private listeners = new Listeners<CrossChainEvent>()

  save(tx: CrossChainSend) {
    const token = getToken(tx.source.token)

    if (token.name.startsWith('???')) {
      // Spam token filtering
      return
    }

    let amount = formatUnits(tx.source.amount, token.decimals)
    const [a, b = ''] = amount.split('.')
    amount = `${a}.${b.slice(0, 3).padEnd(3, '0')}`

    this.listeners.broadcast({
      timestamp: new Date(tx.timestamp * 1000).toISOString(),
      protocol: tx.protocol,
      source: tx.source.chain,
      destination: tx.destination.chain,
      token: token.name,
      amount,
    })
  }

  listen(listener: Listener<CrossChainEvent>) {
    this.listeners.add(listener)
    return () => this.listeners.remove(listener)
  }
}
