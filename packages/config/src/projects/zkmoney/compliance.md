### Enforcement

The wallet sends Ethereum addresses to Predicate, through zk.money, for screening. Funding a deposit address directly sends none. The relayer screens every address a withdrawal or sweep touches against OFAC's list and, where set, Predicate. A sweep or withdrawal the user submits skips the relayer's check. The name resolver screens a deposit address and its funders against OFAC's list before it notifies the recipient. A payment it blocks stays at a deposit address the wallet does not know. The contracts check no list.

### Access to private data

An attested enclave reads the payments, withdrawals and deposit claims it handles. The wallet's check names the screened addresses to zk.money and Predicate.
