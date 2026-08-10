Circuit-specific Phase 2 trusted setup for Railgun's 54 Groth16 circuits (parameterised by
transaction input/output counts) over the BN254 curve. It [builds on the
Polygon zkEVM ceremony](https://github.com/Railgun-Privacy/circuits-v2/blob/d0ec02dea0cbc8cd02a3b727b28de16e51f9a741/prepare_for_ceremony.sh#L13)  <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file> as phase 1, which contains 55 participants.

A separate Phase 2 ceremony was publicly announced,
open to anonymous and identified participants, and wrapped up in late December 2022.

Verified against the ceremony artifact IPFS hash
`QmWAySHYhaZqioKi1ufrPJC1n1ZVtHP2w4hLA9XqqJCFne`: the
`/contributors` directory contains 328 sequentially-numbered attestation files with
GitHub or Twitter handles, and the `/zkeys` directory contains 54 final zkey files (one
per circuit). Parsing the final zkey binary for the 1x1 circuit shows 304 Phase 2
contributions on that circuit.

- Phase 1 ceremony: <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file>.
- Ceremony artifacts on IPFS: [https://ipfs.io/ipfs/QmWAySHYhaZqioKi1ufrPJC1n1ZVtHP2w4hLA9XqqJCFne](https://ipfs.io/ipfs/QmWAySHYhaZqioKi1ufrPJC1n1ZVtHP2w4hLA9XqqJCFne)
- Ceremony announcement: [https://medium.com/@Railgun_Project/railgun-project-begins-setup-ceremony-with-an-emphasis-on-security-d1c63117c312](https://medium.com/@Railgun_Project/railgun-project-begins-setup-ceremony-with-an-emphasis-on-security-d1c63117c312)
- Advanced Circuit ceremony user guide: [https://medium.com/@Railgun_Project/railgun-advanced-circuit-setup-ceremony-user-guide-32361c54242](https://medium.com/@Railgun_Project/railgun-advanced-circuit-setup-ceremony-user-guide-32361c54242)
- Docs overview of the trusted setup: [https://docs.railgun.org/wiki/learn/privacy-system/trusted-setup-ceremony](https://docs.railgun.org/wiki/learn/privacy-system/trusted-setup-ceremony)
- Railgun circuits repository with ceremony scripts: [https://github.com/Railgun-Privacy/circuits-v2](https://github.com/Railgun-Privacy/circuits-v2)
