projectId(optimism).

isSecurityCouncil(optimism_Security_Council_eth_0xc2819dc788505aac350142a7a707bf9d03e3bd03).
isSecurityCouncil(superchainProxyAdminOwner_eth_0x5a0aae59d09fccbddb6c6cceb07b7279367c3d2a).

#show projectId/1.
#show isSecurityCouncil/1.

% two cases: a compromised actor can either indefinitely pause or push invalid state root
% first case: indefinite pause
canIndefPauseOrPushInvalid(P) :- projectId(P), canIndefPause(P)
% second case: push invalid transition
canIndefPauseOrPushInvalid(P) :- projectId(P), canPushInvalid(P).

% to push an invalid transition, there are again two cases: either the system settles an invalid state root, or the contracts are compromised
% first case: settled invalid state root
canPushInvalid(P) :- projectId(P), canFinalizeInvalidStateRoot(P).
% second case: compromised contracts
canPushInvalid(P) :- projectId(P), compromised(Contract), not ultimatePermission(Contract, _, _, _, _, _, _, _, _, isFinal).

% =====

% we assume that permissionless fraud proofs are safe, while permissioned ones are not
canFinalizeInvalidStateRoot(optimism) :- projectId(optimism), canDisableProofSystem(optimism).
canFinalizeInvalidStateRoot(optimism) :- projectId(optimism), isProofSystemDisabled(optimism).

canDisableProofSystem(A) :- ultimatePermission(A, "interact", @self, _, _, ".guardian", _, _, _, isFinal), malicious(A).

#show nonSCCanDisableProofSystem/1.
