The vault code, verifier, signing keys and exit parameters are immutable.

The owner can change the treasury, pause deposits and new withdrawals, and transfer or renounce ownership without a notice period. Pending escape finalizations, challenges and expiry sweeps continue while paused. Pausing until expiry lets the owner redirect entire active deposits to its treasury. [Verified vault source](https://etherscan.io/address/0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe#code).

The offchain operator controls credential issuance, settlement signatures and cooperative withdrawal clearance. Its fixed signing keys have no publicly established mapping to the owner's Ethereum account. Missing keys or settlement evidence cannot be replaced in this vault.

Open Anonymity controls the hosted frontend, which can read local secrets and chats after an update. Inspected local builds still depend on operator signatures, credential issuance, verifier and inference availability. The public SDK and hosted app pin different verifier endpoints. [SDK profile](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/sdk/assets/config/mainnet.json), [production profile](https://chat.openanonymity.ai/zkapi/browser-config.json).
