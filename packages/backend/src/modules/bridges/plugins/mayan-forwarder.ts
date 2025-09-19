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

const parseForwardedEth = createEventParser(
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

export const ForwardedEth = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
}>('mayan-forwarder.ForwardedEth')

export const ForwardedERC20 = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
}>('mayan-forwarder.ForwardedERC20')

export const SwapAndForwardedEth = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
}>('mayan-forwarder.SwapAndForwardedEth')

export const SwapAndForwardedERC20 = createBridgeEventType<{
  mayanProtocol: string
  protocolData: `0x${string}`
}>('mayan-forwarder.SwapAndForwardedERC20')

export class MayanForwarderPlugin implements BridgePlugin {
  name = 'mayan-forwarder'

  capture(event: LogToCapture) {
    const forwardedEth = parseForwardedEth(event.log, null)
    if (forwardedEth) {
      return ForwardedEth.create(event.ctx, {
        mayanProtocol: forwardedEth.mayanProtocol,
        protocolData: forwardedEth.protocolData,
      })
    }

    const forwardedERC20 = parseForwardedERC20(event.log, null)
    if (forwardedERC20) {
      return ForwardedERC20.create(event.ctx, {
        mayanProtocol: forwardedERC20.mayanProtocol,
        protocolData: forwardedERC20.protocolData,
      })
    }

    const swapAndForwardedEthEvent = swapAndForwardedEth(event.log, null)
    if (swapAndForwardedEthEvent) {
      return SwapAndForwardedEth.create(event.ctx, {
        mayanProtocol: swapAndForwardedEthEvent.mayanProtocol,
        protocolData: swapAndForwardedEthEvent.mayanData,
      })
    }

    const swapAndForwardedERC20Event = swapAndForwardedERC20(event.log, null)
    if (swapAndForwardedERC20Event) {
      return SwapAndForwardedERC20.create(event.ctx, {
        mayanProtocol: swapAndForwardedERC20Event.mayanProtocol,
        protocolData: swapAndForwardedERC20Event.mayanData,
      })
    }
  }
}
