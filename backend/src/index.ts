import { projects } from '@l2beat/config'
import { utils } from 'ethers'
import { setup } from './services'
import { SimpleDate } from './utils/SimpleDate'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { dailyBlocks, multicallApi } = setup()

  const endDate = SimpleDate.today()
  const blocks = await dailyBlocks.getDailyBlocks(projects, endDate)

  const lastBlock = blocks[blocks.length - 1].block

  const abi = new utils.Interface([
    'function balanceOf(address owner) returns (uint balance)',
  ])
  const dai = '0x6b175474e89094c44da98b954eedeac495271d0f'
  const holder = '0x8688a84fcFD84d8F78020d0fc0b35987cC58911f'
  const result = await multicallApi.multicall(
    {
      selfBalance: {
        address: dai,
        data: abi.encodeFunctionData('balanceOf', [dai]),
      },
      holderBalance: {
        address: dai,
        data: abi.encodeFunctionData('balanceOf', [holder]),
      },
    },
    lastBlock
  )
  console.log(result)
}
