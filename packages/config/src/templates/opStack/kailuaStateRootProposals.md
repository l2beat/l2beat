Proposers submit state roots as children of any (possibly unresolved) previous state root proposal, by calling the `propose()` function in the KailuaTreasury. A parent state root can have multiple conflicting children, composing a tournament. Each proposer requires to lock a bond, currently set to {{kailuaBond}} ETH, that can be slashed if any proposal made by them is proven incorrect via a fault proof or a conflicting validity proof. The bond can be withdrawn once the proposer has no more pending proposals that need to be resolved and was not eliminated.

Proposals consist of a state root and a reference to their parent and implicitly challenge any sibling proposals who have the same parent. A proposal asserts that the proposed state root constitutes a valid state transition from the parent's state root. To offer efficient zk fault proofs, each proposal must include {{proposalOutputCount}} intermediate state commitments, each spanning {{outputBlockSpan}} L2 blocks. 

Proposals target sequential tournament epochs of currently {{proposalOutputCount}} * {{outputBlockSpan}} L2 blocks. A tournament with a resolved parent tournament, a single child- and no conflicting sibling proposals can be resolved after {{maxClockDuration}}. 

{{vanguardDescription}}
