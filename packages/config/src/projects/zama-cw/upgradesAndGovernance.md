Zama governance is implemented through an Aragon 'DAO' deployment controlled by two multisigs: ZamaGovMultisigA with a {{multisigAStats}} threshold and ZamaGovMultisigB with a {{multisigBStats}} threshold. The multisigs can upgrade contracts or change critical configuration without a timelock.

Confidential token owners and underlying token owners can freeze users. The ACL owner can manage ACL-level account blocking and unpause the ACL, while pausers from the PauserSet can pause the ACL. The exact roles and accounts are listed in the permissions section.

Offchain components like the coprocessor and KMS are trusted for liveness, privacy and security and are currently not decentralized. 
