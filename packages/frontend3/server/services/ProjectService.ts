/**
 * The purpose of this class is to make it easier to migrate away from the
 * config package in favor of a CMS
 */
export class ProjectService {
  async getScalingProjects() {
    const { layer2s, layer3s } = await import('@l2beat/config')
    const result = [...layer2s, ...layer3s].map((project) => ({
      id: project.id,
      name: project.display.name,
    }))
    return Promise.resolve(result)
  }
}
