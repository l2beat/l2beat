import { bridges, layer2s, layer3s } from "../projects"
import { Project } from "./chains"

export function getProjectsIn(projectType: Project['type']) {
    if(projectType === 'layer2') {
        return layer2s
    } else if(projectType === 'bridge') {
        return bridges
    } else if(projectType === 'layer3') {
        return layer3s
    } else {
        throw new Error('Invalid project type')
    }
}
