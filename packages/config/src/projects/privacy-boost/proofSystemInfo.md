Privacy Boost uses **Groth16 over BN254**, with circuits written in Go against the [gnark](https://github.com/Consensys/gnark) R1CS frontend. There is no recursive proof aggregation; batching happens inside each circuit.

There are five verifier families:

- **Epoch**: private transfers, withdrawals and gateway withdrawals; 13 reviewed configurations.
- **Deposit epoch**: standard deposit batches of 1, 4 or 14.
- **Portal deposit epoch**: hidden-recipient portal deposit batches of 1 or 6.
- **Forced withdrawal**: a permissionless delayed exit spending up to 13 notes, using a live auth key or spend approval checked at request time.
- **Gift claim**: private gift claims/refunds and public gift exits, with registered batch sizes 1 and 3.

For each of the verifier contracts, different configurations can be allowed with the according verifier keys. There are 21 verifier keys currently registered (13 epoch + 3 deposit + 2 portal + 1 forced withdrawal + 2 gift).
