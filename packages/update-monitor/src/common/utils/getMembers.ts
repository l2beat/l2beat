export function getMembers(granted: string[], revoked: string[]): string[] {
  const members: string[] = [...granted]

  revoked.forEach((revokedAddress) => {
    const index = members.indexOf(revokedAddress)
    if (index !== -1) {
      members.splice(index, 1)
    }
  })

  return members
}
