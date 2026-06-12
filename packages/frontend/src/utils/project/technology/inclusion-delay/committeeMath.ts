export function getLogFactorials(max: number) {
  const result = new Array<number>(max + 1)
  result[0] = 0

  for (let i = 1; i <= max; i++) {
    result[i] = (result[i - 1] ?? 0) + Math.log(i)
  }

  return result
}

export function logChoose(n: number, k: number, logFactorials: number[]) {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY

  const nFactorial = logFactorials[n]
  const kFactorial = logFactorials[k]
  const nMinusKFactorial = logFactorials[n - k]
  if (
    nFactorial === undefined ||
    kFactorial === undefined ||
    nMinusKFactorial === undefined
  ) {
    return Number.NEGATIVE_INFINITY
  }

  return nFactorial - kFactorial - nMinusKFactorial
}

export function getCommitteeCensorProbabilities(
  validatorCount: number,
  committeeSize: number,
  censorCount: number,
  logFactorials: number[],
) {
  const denominator = logChoose(validatorCount, committeeSize, logFactorials)
  const minCensors = Math.max(0, committeeSize - (validatorCount - censorCount))
  const maxCensors = Math.min(committeeSize, censorCount)

  return Array.from(
    { length: maxCensors - minCensors + 1 },
    (_, i) => minCensors + i,
  ).map((censoringCommitteeMembers) => {
    const p = Math.exp(
      logChoose(censorCount, censoringCommitteeMembers, logFactorials) +
        logChoose(
          validatorCount - censorCount,
          committeeSize - censoringCommitteeMembers,
          logFactorials,
        ) -
        denominator,
    )

    return { censoringCommitteeMembers, p }
  })
}
