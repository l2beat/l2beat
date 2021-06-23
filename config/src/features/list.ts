import { feature, needs, risk } from './utils'

export const Features = {
  Withdrawal: {
    Proved: feature(
      'Withdrawal requires proof of funds',
      'In order to withdraw funds back to the Ethereum blockchain the user needs to submit a merkle proof that they have the funds. The proof is verified against the state root published on chain.',
      needs('Data'),
      needs('State')
    ),
    WithBlock: feature(
      'Withdrawal occurs when block is proved',
      'Withdrawal is made at the same time the block validity proof is submitted.'
    ),
    Signed: feature(
      'Withdrawal requires validator signatures',
      'In order to withdraw funds back to the Ethereum blockchain the user needs their request signed by an authority.',
      risk(
        'Funds can be frozen',
        'The signature might not be granted. The authority can censor the user.'
      )
    ),
  },
  State: {
    FraudProofs: feature(
      'State correctness relies on fraud proofs',
      'The state root published on chain is assumed to be correct. For a certain time period, usually one week anyone can submit a fraud proof that shows that the state was incorrect.',
      risk(
        'Funds can be stolen',
        'If there is no one that checks the published state an invalid state can get finalized. Fraud proofs assume at least one honest and able validator.'
      ),
      needs('Settlement')
    ),
    ValidityProofs: feature(
      'State correctness relies on validity proofs',
      'The state root published on chain is accompanied by a validity proof. This makes it impossible to publish an invalid state and steal funds in this way.',
      needs('Settlement'),
      needs('Cryptography')
    ),
    Unchecked: feature(
      'State correctness is not checked on main chain',
      'There is no mechanism on the Ethereum blockchain that ensures correctness of the state.',
      risk(
        'Funds can be stolen',
        'The operators decide what the system state is.'
      )
    ),
  },
  Settlement: {
    AfterProof: feature(
      'Settlement occurs when the block is proved',
      'Once the transactions have been published on chain with the accompanying proof they can be considered final. This assumption relies on the blocks included in the Ethereum blockchain also being final.'
    ),
    Delayed: feature(
      'Settlement occurs after a waiting period has passed',
      'The transactions are only considered final if after a certain period of time no one challenged the state. This means that in order for the user to move funds back to the Ethereum blockchain they are subject to a delay of usually 1 week.'
    ),
  },
  Cryptography: {
    SNARKS: feature(
      'zk-SNARKs are used for proofs.',
      'Cryptography has made a lot of advancements in the recent years but all cryptographic solutions rely on time to prove their security. zk-SNARKS also require a trusted setup for correct operation.',
      risk(
        'Funds can be stolen',
        'If the cryptography is broken or implemented incorrectly the system can no longer behave according to its assumptions.'
      ),
      risk(
        'Funds can be stolen',
        'If someone is able to compromise the trusted setup, they can create false proofs that will be accepted by verifiers.'
      )
    ),
    STARKS: feature(
      'zk-STARKs are used for proofs.',
      'Cryptography has made a lot of advancements in the recent years but all cryptographic solutions rely on time to prove their security.',
      risk(
        'Funds can be stolen',
        'If the cryptography is broken or implemented incorrectly the system can no longer behave according to its assumptions.'
      )
    ),
  },
  Data: {
    OnChain: feature(
      'Data availability is solved with on-chain data',
      'All data required to construct a merkle proof is published on-chain. Some data can still be off-chain, but it cannot be required for merkle proofs.'
    ),
    External: feature(
      'Data availability requires off-chain data',
      'In order to construct a merkle proof the user needs to obtain off-chain data.',
      risk(
        'Funds can be frozen',
        'If the data is withheld from the user they might not be able to access their funds.'
      ),
      risk(
        'Funds can be lost',
        'If the data is lost the funds can become permanently inaccessible.'
      )
    ),
    Flexible: feature(
      'Data availability depends on user choice',
      'Users can choose their data availability assumptions. Two types of data locations are available: on-chain or off-chain.',
      risk(
        'Funds can be frozen',
        'If the user uses off-chain data and the data is withheld from them they might not be able to access their funds.'
      ),
      risk(
        'Funds can be lost',
        'If the user uses off-chain data and the data is lost the funds can become permanently inaccessible.'
      )
    ),
  },
  MassExit: {
    Unsolved: feature(
      "The mass exit problem isn't addressed.",
      'In the event of the operators going rogue most users would like to exit to the main chain. However because of the limitations of the Ethereum blockchain congestion can occur and some people may not be able to exit successfully.',
      risk(
        'Funds can be stolen',
        'If the chain becomes congested and challenging withdrawals becomes impossible anyone can submit a malicious withdrawal that steals funds.'
      ),
      risk(
        'Funds can be stolen',
        'If the withdrawal does not get processed in time due to chain congestion the operators can steal funds.'
      )
    ),
    Remedied: feature(
      'The mass exit problem is remedied.',
      'In the event of the operators going rogue most users would like to exit to the main chain. However because of the limitations of the Ethereum blockchain congestion can occur and some people may not be able to exit successfully. There are some remedies in place to help in this situation.'
    ),
  },
  SourceCode: {
    Public: feature(
      'The source code is publicly available',
      'The full source code of all components of the projects is public and can be read by anyone. This reduces the risk of hidden vulnerabilities and backdoors.'
    ),
    PartiallyClosed: feature(
      'The smart contract code is public',
      'The code of the smarts contracts is publicly available but some elements of the system are closed-source.'
    ),
    Closed: feature(
      'Source code is private',
      'No public source code for the smart contracts exists. The project has to be treaded as a black box and the operators need to be fully trusted.',
      risk(
        'Funds can be stolen',
        'By making the source private operators are free to hide backdoors in the code.'
      )
    ),
  },
  Upgradeability: {
    Immutable: feature(
      'The smart contract code cannot change',
      'The smart contracts are set in stone. The owners cannot modify the code and steal funds in this way, but all vulnerabilities will remain there forever.'
    ),
    Upgradeable: feature(
      'The smart contract code can change any time',
      'The owners can make any change to the code any time they want.',
      risk(
        'Funds can be stolen',
        'The owners can make a change that assigns user funds to them.'
      )
    ),
    Timelock: feature(
      'The code can change, but users have time to react',
      'The owners can make any change to the code, but the change takes a set amount of time to come into effect. In that time the users need to review the change and exit if they find something they do not agree with. ',
      risk(
        'Funds can be stolen',
        'If the withdrawal does not get processed in time due to chain congestion the operators can steal funds.'
      )
    ),
  },
  Ownership: {
    Unowned: feature(
      'The smart contracts are fully autonomous',
      'The code does not include an owner. Ownership of the funds is decided fully by the smart contract.'
    ),
    Multisig: feature(
      'The contracts are owned by a multisig',
      'The code has an owner. The owner is set to a multisig address with many participants. In some systems those participants can to collude to steal the funds.',
      risk(
        'Funds can be stolen',
        'If multisig owners collude they can steal the funds'
      )
    ),
    EOA: feature(
      'The contracts are owned by a single account',
      'The code has an owner. The owner is set to an externally owned account. This concentrates power around this entity and requires great amounts of trust.',
      risk(
        'Funds can be stolen',
        'The owner can change the system parameters and steal the funds'
      )
    ),
  },
  SmartContracts: {
    EVM: feature(
      'Solidity smart contracts are supported',
      'The system can run turing complete EVM compatible code.'
    ),
    Custom: feature(
      'Smart contracts are supported',
      'The system can run turing complete code, but it is not EVM compatible.'
    ),
  },
  Privacy: {
    Full: feature(
      'Transactions are private',
      'All user and transaction data is encrypted. Only the parties involved in a transaction can tell what is going on.'
    ),
  },
  Sequencer: {
    Centralized: feature(
      'State publishing is restricted',
      'Only whitelisted addresses can publish new state on chain.',
      risk('Censorship', 'User activity can be censored by the operators'),
      needs('ForceTxs')
    ),
    Decentralized: feature(
      'State publishing is permissionless',
      'Anyone can participate in the process of publishing a new state on chain.'
    ),
  },
  ForceTxs: {
    Any: feature(
      'Users can force transactions',
      'In the event of the user being censored they can publish their layer two transaction on Ethereum and be sure that it gets included in the state.'
    ),
    WithdrawalsOnly: feature(
      'Users can force withdrawals',
      "In the event of the user being censored they can perform an exit without operator's involvement.",
      risk(
        'Censorship',
        'User activity other than withdrawals can be censored by the operators'
      )
    ),
  },
  Generality: {
    Any: feature(
      'Arbitrary use cases are supported',
      'The system can support any user activity without the need to preprogram code that facilitates it. This includes the ability to run user supplied code.',
      needs('SmartContracts')
    ),
    Specific: feature(
      'Only specific use cases are supported',
      'The system only allows for a predetermined set of actions to be performed and any other activity would require changes to the system.'
    ),
  },
}
