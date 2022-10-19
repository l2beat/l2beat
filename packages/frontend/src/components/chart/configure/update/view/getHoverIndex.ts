export function getHoverIndex(
  mouseX: number | undefined,
  points: number | undefined,
) {
  if (mouseX !== undefined && points) {
    // This only works if the points are evenly distributed
    return Math.round(mouseX * (points - 1))
  }
}
