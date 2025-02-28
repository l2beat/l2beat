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

transitivePermission(Receiver, Permission, Giver, Delay, Description, nil) :-
  permission(Receiver, Permission, Giver),
  defaultedPermissionDelay(Receiver, Permission, Giver, Delay),
  defaultedPermissionDescription(Receiver, Permission, Giver, Description).

transitivePermission(Receiver, Permission, Giver, OriginalDelay, OriginalDescription, (cons(tuple(Via, "act", Delay), IndirectVia))) :-
  transitivePermission(Via, Permission, Giver, OriginalDelay, OriginalDescription, IndirectVia),
  permission(Receiver, "act", Via),
  defaultedPermissionDelay(Receiver, "act", Via, Delay),
  Permission != "act". % we're only interested in the "final" permission, not intermediate "act".

#show eoa/4.
#show contract/4.
#show transitivePermission/6.
