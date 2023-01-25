// Finds first value in a sequence that doesn't satisfy the check function
// Will not work when all the values satisfy the function
export async function binSearch(
  start: number,
  end: number,
  check: (n: number) => Promise<boolean>,
): Promise<number> {
  if (start === end) {
    return start
  }
  const mid = Math.floor((start + end) / 2)
  if (await check(mid)) {
    return binSearch(mid + 1, end, check)
  }
  return binSearch(start, mid, check)
}
