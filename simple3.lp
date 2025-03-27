#include "relations.lp".
#include "model.lp".
#include "forProjectPage.lp".

% Setup:
% isSecurityCouncil(superchainProxyAdminOwner_ethereum_0x5a0aae59d09fccbddb6c6cceb07b7279367c3d2a).
% isSecurityCouncil(optimism_Security_Council_ethereum_0xc2819dc788505aac350142a7a707bf9d03e3bd03).

currentGame(Game) :-
  isOptimismPortal(OptimismPortal),
  value(OptimismPortal, "disputeGameFactory", DisputeGameFactory),
  value(OptimismPortal, "respectedGameType", GameIndex),
  value(DisputeGameFactory, "gameImpls", (GameIndex, Game)).

thereArePermissionedGamesAvailable :-
  isOptimismPortal(OptimismPortal),
  value(OptimismPortal, "disputeGameFactory", DisputeGameFactory),
  value(DisputeGameFactory, "gameImpls", (_, Game)),
  isPermissionedDisputeGame(Game).

thereArePermissionlessGamesAvailable :-
  isOptimismPortal(OptimismPortal),
  value(OptimismPortal, "disputeGameFactory", DisputeGameFactory),
  value(DisputeGameFactory, "gameImpls", (_, Game)),
  not isPermissionedDisputeGame(Game).

proofSystemFails :-
  canFinalizeInvalidStateRoot.

proofSystemIsOrCanBeMadePermissioned :-
  proofSystemIsPermissioned.

proofSystemIsOrCanBeMadePermissioned :-
  proofSystemCanBeMadePermissioned.

proofSystemCanBeMadePermissionless(Actor) :-
  thereArePermissionlessGamesAvailable,
  isOptimismPortal(OptimismPortal),
  canSetRespectedGameType(OptimismPortal, Actor),
  not compromised(Actor).

canFinalizeInvalidStateRoot :-
  proofSystemIsOrCanBeMadePermissioned,
  isPermissionedDisputeGame(PermissionedDisputeGame),
  ultimatePermission(Challenger, "interact", PermissionedDisputeGame, _, "challenge", _, _),
  ultimatePermission(Proposer, "interact", PermissionedDisputeGame, _, "propose", _, _),
  compromised(Challenger),
  compromised(Proposer).

proofSystemIsPermissioned :- 
  currentGame(Game),
  isPermissionedDisputeGame(Game).

proofSystemCanBeMadePermissioned :-
  thereArePermissionedGamesAvailable,
  isOptimismPortal(OptimismPortal),
  canSetRespectedGameType(OptimismPortal, Actor),
  compromised(Actor).

% proofSystemIsPermissioned :- 
%   isOptimismPortal(OptimismPortal),
%   canSetRespectedGameType(OptimismPortal, Actor),
%   compromised(Actor).
  
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
% #show compromisedContract/1.
% #show isStage1/0.
% #show isNotStage1/0.
#show canSetRespectedGameType/2.
% #show proofSystemIsPermissioned/0.
% #show proofSystemCanBeMadePermissioned/0.
% #show proofSystemIsOrCanBeMadePermissioned/0.
% #show canFinalizeInvalidStateRoot/0.
% #show currentGame/1.
% #show thereArePermissionedGamesAvailable/0.
% #show thereArePermissionlessGamesAvailable/0.
% #show proofSystemCanBeMadePermissionless/1.


% canActAsGuardianMsg(X) :-
%   permission(X, "act", optimism_Guardian_Multisig_ethereum_0x09f7150d8c019bef34450d6920f6b3608cefdaf2).

% % #show canActAsGuardianMsg/1.

% ultimateInteracts(X, Y) :-
%   ultimatePermission(X, "interact", Y, _, _, _, _).

% #show ultimateInteracts/2.
