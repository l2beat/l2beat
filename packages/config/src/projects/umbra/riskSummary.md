## Funds can be lost if
1. an unsupported ERC-20, such as a fee-on-transfer or rebasing token, causes the Umbra contract's internal accounting to diverge from its token balance.
<br>
## Privacy can be lost if
1. the hosted app sends the operator the user's wallet and withdrawal address in one session, linking their stealth addresses (see privileged insider).
2. Alchemy, the hosted app's RPC, receives the payee's address seconds before each payment, so timing ties the payee to it (see network observer).
3. elliptic-curve cryptography is broken, which matches every past payment to its registered recipient (see future adversary).
<br>
## New payments can be stopped if
1. the Umbra owner raises the toll on payments through the contract, which has no cap.
