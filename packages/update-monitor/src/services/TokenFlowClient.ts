import { SnowflakeClient } from './SnowflakeClient'
import { BlockRow } from './types'

export class TokenFlowClient {
  constructor(private snowflakeClient: SnowflakeClient) {}

  getLastBlock() {
    return this.snowflakeClient.query<BlockRow>(
      `
        select * from blocks
        where canonical
        and block = (
          select max(block) from blocks
        )
      `,
    )
  }
}
