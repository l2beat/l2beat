import { asNumber } from '../../common/asNumber'
import { ProjectStats } from './getProjectStats'

export function getProjectTVL(projectStats: ProjectStats[]) {
  return Object.fromEntries(
    projectStats.map(({ project, usdBalance, ethBalance, tokenTVL }) => [
      project.name,
      {
        TVL: {
          usd: asNumber(usdBalance, 18, 2),
          eth: asNumber(ethBalance, 18, 6),
        },
        tokens: tokenTVL,
      },
    ]),
  )
}
