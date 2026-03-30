export const TRANSFER_TYPE_DISPLAY = {
  lockAndMint: {
    label: 'Lock & Mint',
    description:
      'Includes protocols with transfers where tokens are permanently destroyed on the source chain and minted on the destination. The bridge risk is present at all times, as it can mint tokens on all chains. Flow limits might be applied.',
  },
  burnAndMint: {
    label: 'Burn & Mint',
    description:
      'Includes protocols with transfers that rely on existing liquidity on both sides. In-flight risk only. Tokens are therefore first created using a different minting mechanism that needs to be separately assessed.',
  },
  nonMinting: {
    label: 'Non-minting',
    description:
      'Includes protocols with transfers where the original assets are locked in a vault on one chain and a 1:1 representation is created on the other. One-sided risk. If user bridges back, the original tokens are unlocked and the bridge risk is removed.',
  },
}

export const INTEROP_TYPE_TO_BG_COLOR: Record<
  keyof typeof TRANSFER_TYPE_DISPLAY,
  string
> = {
  lockAndMint: 'bg-lock-and-mint',
  burnAndMint: 'bg-burn-and-mint',
  nonMinting: 'bg-non-minting',
}
