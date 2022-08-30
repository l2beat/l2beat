import { bridges } from './bridges'
import { bridge } from './bridges/types/bridge'
import { projects as scalingProjects } from './projects'

export * from './tokens'

export const projects = [...scalingProjects, ...bridges.map(bridge)]
