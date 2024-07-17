Payy is a mobile wallet focusing on UX and stablecoins. It makes use of the UTXO model for transactions. The protocol is made up of three main circuits: the Mint circuit, which allows users to create new "notes", the Burn circuit, which allows for withdrawals, and the Aggregate circuit which allows to aggregate multiple proofs into one, which also include transfers.

To generate the onchain verifiers, the following code is used:
- [Mint](https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/mint/tests.rs)
- [Burn](https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/burn/tests.rs)
- [Aggregate](https://github.com/polybase/payy/blob/main/pkg/zk-circuits/src/aggregate_agg/tests.rs)