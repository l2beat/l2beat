export function getHoverIndex(mouseX: number | undefined, points: number) {
  if (mouseX && points > 0) {
    // This only works if the points are evenly distributed
    return Math.round(mouseX * (points - 1))
  }
}
