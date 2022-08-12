import { getHistory } from '../history'
import { SnowflakeClient } from '../services/SnowflakeClient'
import { TokenFlowClient } from '../services/TokenFlowClient'
import { getEnv } from './getEnv'
import { exitWithUsage } from './usage'

export async function history(args: string[]) {
  if (args.length > 0) {
    exitWithUsage('Too many arguments!')
  }

  const snowflakeClient = new SnowflakeClient({
    account: getEnv('SNOWFLAKE_ACCOUNT'),
    username: getEnv('SNOWFLAKE_USERNAME'),
    password: getEnv('SNOWFLAKE_PASSWORD'),
    warehouse: getEnv('SNOWFLAKE_WAREHOUSE', 'COMPUTE_WH'),
  })

  const tokenFlowClient = new TokenFlowClient(snowflakeClient)

  await getHistory(tokenFlowClient)
}
