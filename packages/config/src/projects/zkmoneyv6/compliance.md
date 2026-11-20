### Enforcement

The wallet [asks Predicate](https://github.com/aztec-labs-eng/zkmoney-public/blob/516d90660400aee97166376ba69c5b61ce82a7e4/packages/front-core/src/core/services/screening/PredicateScreeningService.ts#L28-L53), through zk.money, whether a withdrawal recipient passes Aztec Labs' policy. It stops when the answer is no or missing. The relayer [screens](https://github.com/aztec-labs-eng/zkmoney-public/blob/516d90660400aee97166376ba69c5b61ce82a7e4/vendor/oxide/yarn-project/oxide-relayer/src/l1_operations/l1_operation_screener.ts#L14-L35) every address a withdrawal or sweep touches against OFAC's list and, where set, Predicate. A sweep or withdrawal the user submits skips the relayer's check. The name resolver screens a deposit address and its funders against OFAC's list before it notifies the recipient. A payment it blocks stays at a deposit address the wallet does not know. The contracts check no list. The wallet's and the relayer's checks are public code, the resolver service is not.

### Access to private data

An attested enclave reads the payments, withdrawals and deposit claims it handles. The wallet's check names each withdrawal recipient to zk.money and Predicate before the withdrawal exists.
