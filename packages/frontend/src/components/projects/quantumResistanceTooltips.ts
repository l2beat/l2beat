export const QUANTUM_RESISTANCE_TOOLTIPS = {
  prover:
    "The prover is plausibly quantum resistant. There is no publicly known quantum algorithm that efficiently breaks prover's cryptography.",
  privacy:
    'This privacy protocol is plausibly quantum resistant: it does not introduce additional quantum attack scenarios to steal user funds or break user privacy. Quantum attack vectors on the underlying chain still apply.',
} as const

export type QuantumResistanceType = keyof typeof QUANTUM_RESISTANCE_TOOLTIPS
