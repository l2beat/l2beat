Shield Swap moves USDC from Ethereum into private USDCx on Aleo and back. The Shield wallet holds the USDCx as private records, and transfers between them hide sender, recipient and amount. The Ethereum deposit and withdrawal are public, and so is each amount minted or burned on Aleo.

Users trust Circle, which holds the backing USDC, signs every mint and can block addresses. A compliance key reads every private action, and a 2/3 multisig can upgrade the Aleo programs at once. Leaving needs Circle's attesters to sign each withdrawal.

### Flow

1. **Deposit.** You connect an Ethereum wallet and the Shield wallet to Shield Swap. Your deposit to xReserve names a wrapper program and a commitment to your Aleo address. Ethereum shows your address, the amount and the time.
2. **Private mint.** Once Circle has attested the deposit, the Shield wallet calls the wrapper's `private_mint`. It checks the commitment and turns the minted USDCx into a private record for you. Aleo shows the amount and the deposit it claims.
3. **Inside Aleo.** Private transfers hide sender, recipient and amount.
4. **Private burn.** The wallet spends a record through the wrapper's `private_burn`, which burns USDCx for an Ethereum address. Aleo shows the amount and that address.
5. **Withdrawal.** The attesters of the Aleo depositor contract sign the burn, and Circle's Gateway pays the USDC on Ethereum.

### App

Shield Swap is a hosted page at swap.shield.fi that builds the deposit, the mint and the burn. The Shield wallet 1.47.0 is a Chrome extension that holds the keys and proves. Provable makes both, and both are closed source.

Provable's record scanner gets the wallet's view key sealed to a public key the server hands out, with no proof that an enclave holds it. By default the wallet proves on Provable's servers, which see each transaction's sender, recipient and amount. The Local proving mode keeps those on the device and turns off the fee sponsor.

### Aleo

Aleo is a proof-of-stake chain whose validators and clients verify every proof. On November 17, 2026, 23 validators held the stake, and the largest 3 held over a third. Those 3 can halt the chain, which stops withdrawals. Provable ships Aleo's hard forks, 21 since its 2024 launch, and validators adopt each at a set block height. Each transaction shows its program and function, so the chain marks every private mint, transfer and burn as such.

### Compliance

The token program encrypts every compliance record to one address fixed in the program. A freeze list blocks listed Aleo addresses, and private spends prove their sender is not on it. It held no address on November 16, 2026. Circle can also block addresses in xReserve and its Gateway contracts.

### Fees

Provable's fee sponsor pays the Aleo fees of private actions while proving runs on its servers. On November 16, 2026, Shield Swap let Circle take up to 0.1 USDC per deposit and quoted 2 USDC per withdrawal.
