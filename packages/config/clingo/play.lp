#include "../discovery/optimism/ethereum/relations.lp".

% filteredPermission(Receiver, Permission, Giver, SumDelay, Via) :-
%   permission(Receiver, Permission, Giver, SumDelay, Via),
%   Receiver == superchainProxyAdminOwner.
% 
% #show filteredPermission/5.

malicious(Msig) :-
  msig(Msig, Threshold),
  Threshold <= #count{ X : member(Msig, X), malicious(X) }.

canMaliciouslyUpgrade(Who, What, Delay, Via) :-
  permission(Who, upgrade, What, Delay, Via),
  malicious(Who),
  not permission(_, act, Who, _, _).

{ malicious(X) } :- eoa(X).

:- not canMaliciouslyUpgrade(_, optimismPortal, _, _).

maliciousEoa(X) :-
  eoa(X),
  malicious(X).

% #show canMaliciouslyUpgrade/4.
% #show malicious/1.
#show maliciousEoa/1.
#minimize { 1,X : maliciousEoa(X) }.
