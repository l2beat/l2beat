## Funds can be stolen if
1. the proof system is broken and a malicious validator is registered, allowing forged spends or withdrawals.
2. the PayyMultisig upgrades the Rollup contract or directly overwrites the state root to a malicious version.
<br>
## Funds can be lost if
1. a user loses the note data or the keys required to spend their notes.
2. the offchain transaction data becomes unavailable, as data availability is not verified on Ethereum.
3. the operators stop including withdrawals in proven state updates, as there is no forced exit mechanism.
<br>
## Privacy can be lost if
1. the Payy-operated note registry, note lookup or wallet backup services are compromised or their records are disclosed, revealing which addresses receive and hold which notes and who transacted with whom.

