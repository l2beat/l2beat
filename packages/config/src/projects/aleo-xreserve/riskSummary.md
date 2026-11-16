## Funds can be stolen if
1. the 2/3 multisig deploys a malicious [upgrade](#upgrades-and-governance) of the USDCx programs, with no delay.
2. the address that can upgrade the multisig program replaces it and approves any upgrade, with no delay.
3. the role manager of the USDCx programs grants itself the mint role and mints unbacked USDCx.
4. the owners of xReserve or Circle's Gateway contracts deploy a malicious [upgrade](#upgrades-and-governance), with no delay.
5. Circle's attester key signs a mint without a deposit, or two of the Aleo depositor's attesters sign a withdrawal without a burn.
6. the zk proof system is broken, allowing invalid spends or withdrawals.
<br>
## Funds can be frozen if
1. Circle pauses or blocks the user's address in xReserve or its Gateway contracts.
2. the freeze list manager adds the user's Aleo address, which stops its private spends.
3. the pausers stop the USDCx token or bridge on Aleo.
4. the Aleo depositor's attesters stop signing withdrawals.
<br>
## Privacy can be lost if
1. the holder of the compliance key reads the records, which name sender, recipient and amount of every private action (see privileged insider).
2. Provable reads the records of every account whose view key its scanner holds (see privileged insider).
3. Provable serves a changed Shield Swap page or wallet release that sends keys or records elsewhere (see privileged insider).
4. Mixpanel ties both legs to one browser, unless the user sends Do Not Track and turns the wallet's analytics off (see network observer).
5. a withdrawal's amount and time match one of few deposits (see chain analyst).
6. elliptic-curve cryptography is broken, which recovers the compliance view key from its address (see future adversary).
