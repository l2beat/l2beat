import type { RpcMetricsRecorder } from '@l2beat/shared'
import { providers } from 'ethers'

export class MeteredJsonRpcProvider extends providers.StaticJsonRpcProvider {
  constructor(
    url: string,
    chainId: number | undefined,
    private readonly recorder: RpcMetricsRecorder,
  ) {
    super(url, chainId)
  }

  override send(method: string, params: Array<unknown>): Promise<unknown> {
    this.recorder.record({ method })
    return super.send(method, params)
  }
}
