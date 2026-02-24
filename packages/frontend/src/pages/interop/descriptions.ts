export const interopDescriptions = {
  burnAndMint:
    'The bridge risk is present at all times, as it can mint tokens on all chains. Flow limits might be applied.',
  nonMinting:
    'In-flight risk only. Tokens are therefore first bridged using a different minting bridge that needs to be separately assessed.',
  lockAndMint:
    'One-sided risk. If user bridges back, the original tokens are unlocked and the bridge risk is removed.',
} as const
