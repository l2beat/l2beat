import type { Message } from './Message'
import type { Transfer } from './Transfer'

export interface MatcherOutput {
  transfers: Transfer[]
  messages: Message[]
}
