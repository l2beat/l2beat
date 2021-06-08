import { projects } from './projects'
import { toDataPipeline } from './utils/toDataPipeline'
import { toProjectsData } from './utils/toProjectsData'

export { Project, projects } from './projects'
export { getTokenBySymbol, TokenInfo, tokenList } from './tokens'

export const dataPipeline = toDataPipeline(projects)
export const projectsData = toProjectsData(projects)
