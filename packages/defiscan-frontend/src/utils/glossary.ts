/** Glossary of DeFi terms surfaced via <GlossaryTooltip>. */
export const GLOSSARY: Record<string, string> = {
  EOA: 'Externally Owned Account — a blockchain address controlled by a single private key, representing one person or entity.',
  Multisig:
    'Multi-signature wallet — requires multiple parties to approve a transaction (e.g., 3-of-5 means 3 out of 5 keyholders must sign).',
  Timelock:
    'A smart contract mechanism that enforces a mandatory waiting period before changes take effect, giving users time to react.',
  Proxy:
    'A contract pattern that allows upgrading the underlying logic while keeping the same address. Users interact with the proxy, which delegates to an implementation.',
  'Permissioned Function':
    'A smart contract function that can only be called by specific addresses (admins), not by the general public.',
  TVL: 'Total Value Locked — the total USD value of funds in the protocol that could be affected if an admin key is compromised or misused.',
  Immutable:
    'A contract that cannot be changed after deployment — its code and behavior are permanently fixed on the blockchain.',
  CDP: 'Collateralized Debt Position — a mechanism where users lock collateral to borrow assets, commonly used in stablecoin protocols.',
  Oracle:
    'A service that brings external data (like asset prices) onto the blockchain for smart contracts to use.',
  Governance:
    'A contract or system that manages decision-making for a protocol, typically through token voting or delegated authority.',
}
