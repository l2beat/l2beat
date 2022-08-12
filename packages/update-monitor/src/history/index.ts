import { TokenFlowClient } from '../services/TokenFlowClient'

export async function getHistory(tokenFlowClient: TokenFlowClient) {
  const blocks = await tokenFlowClient.getLastBlock()
  console.log(blocks)
}
