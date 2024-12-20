export function RollupsInfo() {
  return (
    <Info>
      Rollups are L2s that periodically post state commitments to Ethereum.
      These commitments are validated by either Validity Proofs or are accepted
      optimistically and can be challenged via Fraud Proof mechanism within a
      certain fraud proof window. Additionally L2 data is also posted to
      Ethereum, hence there are no additional trust assumptions introduced
    </Info>
  )
}

export function ValidiumsAndOptimiumsInfo() {
  return (
    <Info>
      Alt-DAs are L2s that, similarly to Rollups, periodically post state
      commitments to Ethereum that are validated by it, however data is not
      posted to Ethereum. This means that additional trust assumptions, external
      to Ethereum, are introduced to prevent data withholding attacks
    </Info>
  )
}

export function OthersInfo() {
  return (
    <Info>
      OTHERS are L2s that either do not have a working proof system or they
      don&apos;t have an external DA sufficiently decentralised (ie at least 5
      independent attesters)
    </Info>
  )
}

function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex flex-row">
      <span className="text-[11px] leading-snug text-zinc-500 dark:text-secondary md:text-[13px] md:leading-tight">
        {children}
      </span>
    </div>
  )
}
