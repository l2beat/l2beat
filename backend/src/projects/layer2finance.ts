import { Project } from './Project'

export const layer2finance: Project = {
  name: 'Layer2.Finance',
  bridges: [
    {
      address: '0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05',
      sinceBlock: 12283778,
      tokens: ['BUSD', 'DAI', 'USDC', 'USDT', 'WETH'],
    },
  ],
}
