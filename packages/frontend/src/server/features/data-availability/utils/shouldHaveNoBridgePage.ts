export function shouldHaveNoBridgePage(
  daLayer: { usedWithoutBridgeIn: unknown[] },
  bridgeCount: number,
): boolean {
  return daLayer.usedWithoutBridgeIn.length > 0 || bridgeCount === 0
}
