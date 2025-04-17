% description is nil if not defined
defaultedPermissionDescription(G, P, R, nil) :-
  permission(G, P, R),
  not permissionDescription(G, P, R, _).

defaultedPermissionDescription(G, P, R, Desc) :-
  permission(G, P, R),
  permissionDescription(G, P, R, Desc).

% delay is 0 if not defined
defaultedPermissionDelay(R, P, G, 0) :-
  permission(R, P, G),
  not permissionDelay(R, P, G, _).

defaultedPermissionDelay(R, P, G, Delay) :-
  permission(R, P, G),
  permissionDelay(R, P, G, Delay).

% condition is nil if not defined
defaultedPermissionCondition(G, P, R, nil) :-
  permission(G, P, R),
  not permissionCondition(G, P, R, _).

defaultedPermissionCondition(G, P, R, Cond) :-
  permission(G, P, R),
  permissionCondition(G, P, R, Cond).

% multisig adds "act" permission if threshold is 1
permission(Receiver, "act", Msig) :-
  member(Msig, Receiver),
  msig(Msig, Threshold),
  Threshold == 1.

% 1. Building permissions with "Via" cons list and details such as descriptions and delays

transitivePermission(Receiver, Permission, Giver, Delay, Description, Condition, Delay, nil) :-
  permission(Receiver, Permission, Giver),
  defaultedPermissionDelay(Receiver, Permission, Giver, Delay),
  defaultedPermissionDescription(Receiver, Permission, Giver, Description),
  defaultedPermissionCondition(Receiver, Permission, Giver, Condition).

transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, (cons(tuple(Via, ViaPermission, ViaDelay, ViaCondition), IndirectVia))) :-
  Receiver != Via, % deal with self-loops (e.g. timelock can act on timelock)
  transitivePermission(Via, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, PreviousTotalDelay, IndirectVia),
  permission(Receiver, ViaPermission, Via),
  defaultedPermissionDelay(Receiver, ViaPermission, Via, ViaDelay),
  defaultedPermissionCondition(Receiver, ViaPermission, Via, ViaCondition),
  ViaPermission == "act",
  TotalDelay = PreviousTotalDelay + ViaDelay.
  % OriginalPermission != "act". % we're only interested in the "final" permission, not intermediate "act".

ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via, isFinal) :-
  transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via),
  OriginalPermission != "act",
  canActIndependently(Receiver).

ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via, directNonFinal) :-
  transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via),
  not ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via, isFinal),
  Via == nil, % we only want to show direct permissions
  not member(Giver, Receiver). % for backwards compatibility, we didn't show direct "act" permission for multisig members

canActIndependently(Msig) :-
  msig(Msig, Threshold),
  Threshold > 1.

canActIndependently(Actor) :-
  address(Actor, _, _),
  not permission(_, "act", Actor).

% % 2. Filtering permission to only those we want to display
% % a) Show only final permissions (which don't give "act" to someone else)
% filteredTransitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via, isFinal) :-
%   transitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via),
%   not permission(_, "act", Receiver).

% % b) ...unless it's a direct permission (to say "can be used to")
% filteredTransitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via, nonFinal) :-
%   transitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via),
%   Via == nil,
%   permission(_, "act", Receiver).


#show address/3.
% #show addressName/2.
% #show addressType/2.
% #show addressDescription/2.
% #show filteredTransitivePermission/8.
% #show canActIndependently/1.
#show hasField/3.
#show transitivePermission/8.
#show ultimatePermission/9.