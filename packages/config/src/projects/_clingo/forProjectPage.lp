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

% multisig adds "act" permission if threshold is 1
permission(Receiver, "act", Msig) :-
  member(Msig, Receiver),
  msig(Msig, Threshold),
  Threshold == 1.

% 1. Building permissions with "Via" cons list and details such as descriptions and delays

transitivePermission(Receiver, Permission, Giver, Delay, Description, Delay, nil) :-
  permission(Receiver, Permission, Giver),
  defaultedPermissionDelay(Receiver, Permission, Giver, Delay),
  defaultedPermissionDescription(Receiver, Permission, Giver, Description).

transitivePermission(Receiver, OriginalPermission, Giver, OriginalDelay, OriginalDescription, TotalDelay, (cons(tuple(Via, ViaPermission, ViaDelay), IndirectVia))) :-
  transitivePermission(Via, OriginalPermission, Giver, OriginalDelay, OriginalDescription, PreviousTotalDelay, IndirectVia),
  permission(Receiver, ViaPermission, Via),
  defaultedPermissionDelay(Receiver, ViaPermission, Via, ViaDelay),
  ViaPermission == "act",
  TotalDelay = PreviousTotalDelay + ViaDelay,
  OriginalPermission != "act". % we're only interested in the "final" permission, not intermediate "act".

% 2. Filtering permission to only those we want to display

% a) Show only final permissions (which don't give "act" to someone else)
filteredTransitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via, isFinal) :-
  transitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via),
  not permission(_, "act", Receiver).

% b) ...unless it's a direct permission (to say "can be used to")
filteredTransitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via, nonFinal) :-
  transitivePermission(Receiver, Permission, Giver, Delay, Description, TotalDelay, Via),
  Via == nil,
  permission(_, "act", Receiver).

% 3. In Permissions section, show only addresses that have some final permission
showInPermissionsSection(Address) :-
  filteredTransitivePermission(Address, Permission, _, _, _, _, _, isFinal).

% ...and always show multisigs
showInPermissionsSection(Address) :-
  msig(Address, _).

showContractInPermissionsSection(Address) :-
  showInPermissionsSection(Address),
  addressType(Address, contract).

showEoaInPermissionsSection(Address) :-
  showInPermissionsSection(Address),
  addressType(Address, eoa).

#show address/3.
#show addressName/2.
#show addressType/2.
#show addressDescription/2.
#show filteredTransitivePermission/8.
#show showContractInPermissionsSection/1.
#show showEoaInPermissionsSection/1.