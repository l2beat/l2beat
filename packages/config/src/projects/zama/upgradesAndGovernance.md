Zama governance is implemented through an Aragon DAO controlled by two multisig plugins: ZamaGovMultisigA with a {{multisigAStats}} threshold and ZamaGovMultisigB with a {{multisigBStats}} threshold. The DAO is the owner/admin for the confidential wrappers and related FHEVM system contracts, so successful governance actions can upgrade contracts or change critical configuration without a timelock.

Wrapper owners can block and unblock users. The ACL owner can manage ACL-level account blocking and unpause the ACL, while pausers from the PauserSet can pause the ACL. The KMSVerifier accepts public decryptions signed by {{kmsThreshold}}/{{kmsSignerCount}} KMS signers, and the InputVerifier accepts encrypted inputs signed by {{coprocessorThreshold}}/{{coprocessorSignerCount}} coprocessor signers. The exact roles and accounts are listed in the permissions section.

## Governance flow

Changes are proposed and executed through the DAO/multisig setup. There is no onchain delay between a proposal reaching the required multisig approvals and execution, so users do not have a guaranteed exit period before upgrades or permission changes take effect.
