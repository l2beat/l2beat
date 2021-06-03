import { Project } from './Project'

export const zksync: Project = {
  name: 'zkSync',
  bridges: [
    {
      address: '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF',
      sinceBlock: 10269890,
      tokens: ['ETH', 'DAI', 'USDC', 'USDT', 'GLM', 'WBTC'],
    },
  ],
}
