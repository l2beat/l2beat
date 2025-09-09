export function getProjectMetadataDescription<
  T extends {
    name: string
    display: {
      description: string
    }
  },
>(project: T) {
  return `Explore ${project.name} metrics and in-depth research. ${project.display.description}`
}
