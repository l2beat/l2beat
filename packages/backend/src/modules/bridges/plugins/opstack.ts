import { EthereumAddress } from "@l2beat/shared-pure";
import { BridgePlugin, createEventParser, LogToCapture } from "./types";
import { Logger } from "@l2beat/backend-tools";
import { BinaryReader } from "../BinaryReader";

const parseL2MessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)'
)

const parseAnchorUpdated = createEventParser(
  'event AnchorUpdated(address indexed game)'
)

const NETWORKS = [
  {
    chainId: 8453,
    chain: 'base',
    l2ToL1MessagePasser: EthereumAddress('0x4200000000000000000000000000000000000016'),
    anchorStateRegistry: EthereumAddress('0x496286e5eE7758de84Dd17e6d2d97afC2ACE4cc7')
  }
]

export class OpStackPlugin implements BridgePlugin {
  name = 'opstack'
  chains = ['ethereum', 'base']

  constructor(private logger: Logger) {}
  
  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      const network = NETWORKS.find((n) => n.anchorStateRegistry === input.ctx.txTo)
      if (!network) {
        this.logger.warn('Network not configured', {
          chain: input.ctx.chain,
          txTo: input.ctx.txTo,
        })
        return
      }

      const anchorUpdated = parseAnchorUpdated(input.log, [network.anchorStateRegistry])
      if (anchorUpdated) {
        return
      }
    }
  }
}

function decodeAnchor(encodedAnchor: string) {
  try {
    const reader = new BinaryReader(encodedAnchor)
    const game = EthereumAddress(`0x${reader.readBytes(32).slice(-40)}`)


  } catch (error) {
    console.error('Failed to decode anchor', { encodedAnchor, error } )
    return null
  }
}
