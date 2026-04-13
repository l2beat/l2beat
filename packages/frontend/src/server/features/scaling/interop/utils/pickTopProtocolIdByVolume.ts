export function pickTopProtocolIdByVolume(
  volumeByProtocolId: Iterable<readonly [string, number]>,
): string | undefined {
  return Array.from(volumeByProtocolId).toSorted((a, b) => b[1] - a[1])[0]?.[0]
}
