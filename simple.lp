#include "relations.lp".
#include "model.lp".
#include "forProjectPage.lp".

% Setup:
% isSecurityCouncil(optimism_Security_Council_ethereum_0xc2819dc788505aac350142a7a707bf9d03e3bd03).
isSecurityCouncil(superchainProxyAdminOwner_ethereum_0x5a0aae59d09fccbddb6c6cceb07b7279367c3d2a).


% compromised(Contract) :-
%   ultimatePermission(From, "upgrade", Contract, _, _, _, _),
%   not isSecurityCouncil(From).

compromised(Contract) :-
  ultimatePermission(From, "upgrade", Contract, _, _, _, _),
  compromised(From).

compromised(Actor) :-
  ultimatePermission(Actor, "upgrade", _, _, _, _, _),
  not isSecurityCouncil(Actor).

% nonSCUpgradePermissionExists(From) :- 
%   ultimatePermission(From, "upgrade", _, _, _, _, _),
%   not isSecurityCouncil(From).

% :- not nonSCUpgradePermissionExists(_).

isStage1 :-
  not compromised(_).

isNotStage1 :-
  not isStage1.

% #show nonSCUpgradePermissionExists/1.
% #show compromised/1.
#show isStage1/0.
#show isNotStage1/0.



