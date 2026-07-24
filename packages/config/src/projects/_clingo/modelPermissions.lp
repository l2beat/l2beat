% condition is nil if not defined
defaultedPermissionCondition(G, P, R, Delay, Description, Role, nil) :-
  permission(G, P, R, Delay, Description, Role),
  not permissionCondition(G, P, R, Delay, Description, Role, _).

defaultedPermissionCondition(G, P, R, Delay, Description, Role, Cond) :-
  permission(G, P, R, Delay, Description, Role),
  permissionCondition(G, P, R, Delay, Description, Role, Cond).

% multisig adds "act" permission if threshold is 1
permission(Receiver, "act", Msig, 0, nil, "member") :-
  member(Msig, Receiver),
  msig(Msig, Threshold),
  Threshold == 1.

% multisig can act independently if threshold is greater than 1 (even if it passes act permission to e.g. module)
canActIndependently(Msig) :-
  msig(Msig, Threshold),
  not preventActingIndependently(Msig),
  Threshold > 1.

% anyone that doesn't pass act permission to someone else can act independently
canActIndependently(Actor) :-
  address(Actor, _, _),
  not permission(_, "act", Actor, _, _, _),
  not preventActingIndependently(Actor).

% 1. Building permissions with "Via" cons list and details such as descriptions and delays

transitivePermission(Receiver, Permission, Giver, Delay, Description, Role, Condition, Delay, nil) :-
  permission(Receiver, Permission, Giver, Delay, Description, Role),
  defaultedPermissionCondition(Receiver, Permission, Giver, Delay, Description, Role, Condition).

transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, TotalDelay, (cons(tuple(Via, ViaPermission, ViaDelay, ViaDescription, ViaRole, ViaCondition), IndirectVia))) :-
  Receiver != Via, % deal with self-loops (e.g. timelock can act on timelock)
  transitivePermission(Via, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, PreviousTotalDelay, IndirectVia),
  permission(Receiver, ViaPermission, Via, ViaDelay, ViaDescription, ViaRole),
  defaultedPermissionCondition(Receiver, ViaPermission, Via, ViaDelay, ViaDescription, ViaRole, ViaCondition),
  ViaPermission == "act",
  TotalDelay = PreviousTotalDelay + ViaDelay.
  % OriginalPermission != "act". % we're only interested in the "final" permission, not intermediate "act".

% 2. Narrowing down to isFinal or directNonFinal 
ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, TotalDelay, Via, isFinal) :-
  transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, TotalDelay, Via),
  OriginalPermission != "act",
  canActIndependently(Receiver).

ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, TotalDelay, Via, directNonFinal) :-
  transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, TotalDelay, Via),
  not ultimatePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, OriginalRole, OriginalCondition, TotalDelay, Via, isFinal),
  Via == nil, % we only want to show direct permissions
  not member(Giver, Receiver). % for backwards compatibility, we didn't show direct "act" permission for multisig members

% ------------------------------------------------------------------------------------------------
% BEGIN: Flag EOAs that have upgrade permissions

eoaWithUpgradePermissions(Eoa) :-
  addressType(Eoa, eoa),
  ultimatePermission(Eoa, "upgrade", _, _, _, _, _, _, _, isFinal).

% END
% ------------------------------------------------------------------------------------------------

#show address/3.
% #show addressName/2.
% #show addressType/2.
% #show canActIndependently/1.
% #show transitivePermission/9.
#show ultimatePermission/10.
#show permissionGroup/11.

#show eoaWithUpgradePermissions/1.
