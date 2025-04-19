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

% multisig can act independently if threshold is greater than 1 (even if it passes act permission to e.g. module)
canActIndependently(Msig) :-
  msig(Msig, Threshold),
  Threshold > 1.

% anyone that doesn't pass act permission to someone else can act independently
canActIndependently(Actor) :-
  address(Actor, _, _),
  not permission(_, "act", Actor).

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

% 2. Narrowing down to isFinal or directNonFinal 
ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via, isFinal) :-
  transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via),
  OriginalPermission != "act",
  canActIndependently(Receiver).

ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via, directNonFinal) :-
  transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via),
  not ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalCondition, TotalDelay, Via, isFinal),
  Via == nil, % we only want to show direct permissions
  not member(Giver, Receiver). % for backwards compatibility, we didn't show direct "act" permission for multisig members

#show address/3.
% #show addressName/2.
% #show addressType/2.
% #show addressDescription/2.
% #show canActIndependently/1.
#show transitivePermission/8.
#show ultimatePermission/9.