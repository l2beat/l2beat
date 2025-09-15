/* 
Mayan Forwarder
- chooses one of the Mayan protocol
- emits Event that will allow further matching
*/

import {
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
} from './types'

const parseForwadedEth = createEventParser(
  'event ForwardedEth(address mayanProtocol, bytes protocolData)',
)

const parseForwardedERC20 = createEventParser(
  'event ForwardedERC20(address token, uint256 amount, address mayanProtocol, bytes protocolData)',
)

const swapAndForwardedEth = createEventParser(
  'event SwapAndForwardedEth(uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)',
)

const swapAndForwardedERC20 = createEventParser(
  'event SwapAndForwardedERC20(address tokenIn, uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)',
)

export const ForwadedEth = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
  txHash: string
}>('mayanForwarder.ForwadedEth')

export const ForwadedERC20 = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
  txHash: string
}>('mayanForwarder.ForwadedERC20')

export const SwapAndForwardedEth = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
  txHash: string
}>('mayanForwarder.SwapAndForwardedEth')

export const SwapAndForwardedERC20 = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
  txHash: string
}>('mayanForwarder.SwapAndForwardedERC20')

export class MayanForwarderPlugin implements BridgePlugin {
  name = 'mayanforwarder'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(event: LogToCapture) {
    const forwardedEth = parseForwadedEth(event.log, null)
    if (forwardedEth) {
      return ForwadedEth.create(event.ctx, {
        mayanProtocol: forwardedEth.mayanProtocol,
        protocolData: forwardedEth.protocolData,
        txHash: event.ctx.txHash,
      })
    }

    const forwardedERC20 = parseForwardedERC20(event.log, null)
    if (forwardedERC20) {
      return ForwadedERC20.create(event.ctx, {
        mayanProtocol: forwardedERC20.mayanProtocol,
        protocolData: forwardedERC20.protocolData,
        txHash: event.ctx.txHash,
      })
    }

    const swapAndForwardedEthEvent = swapAndForwardedEth(event.log, null)
    if (swapAndForwardedEthEvent) {
      return SwapAndForwardedEth.create(event.ctx, {
        mayanProtocol: swapAndForwardedEthEvent.mayanProtocol,
        protocolData: swapAndForwardedEthEvent.mayanData,
        txHash: event.ctx.txHash,
      })
    }

    const swapAndForwardedERC20Event = swapAndForwardedERC20(event.log, null)
    if (swapAndForwardedERC20Event) {
      return SwapAndForwardedERC20.create(event.ctx, {
        mayanProtocol: swapAndForwardedERC20Event.mayanProtocol,
        protocolData: swapAndForwardedERC20Event.mayanData,
        txHash: event.ctx.txHash,
      })
    }
  }
}
