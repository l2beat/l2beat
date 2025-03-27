#include "relations.lp".
#include "model.lp".
#include "forProjectPage.lp".

% Setup:
isSecurityCouncil(superchainProxyAdminOwner_ethereum_0x5a0aae59d09fccbddb6c6cceb07b7279367c3d2a).

proofSystemFails :-
  finalizesInvalidStateRoot.

finalizesInvalidStateRoot :-
  proofSystemIsPermissioned,
  isPermissionedDisputeGame(PermissionedDisputeGame),
  ultimatePermission(Challenger, "interact", PermissionedDisputeGame, _, "challenge", _, _),
  ultimatePermission(Proposer, "interact", PermissionedDisputeGame, _, "propose", _, _),
  compromised(Challenger),
  compromised(Proposer).

proofSystemIsPermissioned :- 
  isOptimismPortal(OptimismPortal),
  value(OptimismPortal, "respectedGameType", 1).

proofSystemIsPermissioned :- 
  isOptimismPortal(OptimismPortal),
  canSetRespectedGameType(OptimismPortal, Actor),
  compromised(Actor).
  
canSetRespectedGameType(OptimismPortal, Actor) :-
  isOptimismPortal(OptimismPortal),
  ultimatePermission(Actor, "interact", OptimismPortal, _, "setRespectedGameType", _, _).

compromised(OptimismPortal) :-
  isOptimismPortal(OptimismPortal),
  proofSystemFails.

compromised(Contract) :-
  ultimatePermission(From, "upgrade", Contract, _, _, _, _),
  compromised(From).

compromised(Actor) :-
  ultimatePermission(Actor, _, _, _, _, _, _),
  not isSecurityCouncil(Actor).

isStage1 :-
  not isNotStage1.
  % not compromised(X),
  % not ultimatePermission(X, _, _, _, _, _, _).

isNotStage1 :-
  % not isStage1.
  compromised(X),
  not ultimatePermission(X, _, _, _, _, _, _).

compromisedContract(X) :-
  compromised(X),
  not ultimatePermission(X, _, _, _, _, _, _).

% #show nonSCUpgradePermissionExists/1.
% #show compromised/1.
#show compromisedContract/1.
#show isStage1/0.
#show isNotStage1/0.
% #show canSetRespectedGameType/2.
#show proofSystemIsPermissioned/0.
#show finalizesInvalidStateRoot/0.