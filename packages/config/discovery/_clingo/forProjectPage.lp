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


% 1. Building permissions with "Via" cons list and details like descriptions and delays

transitivePermission(Receiver, Permission, Giver, Delay, Description, nil) :-
  permission(Receiver, Permission, Giver),
  defaultedPermissionDelay(Receiver, Permission, Giver, Delay),
  defaultedPermissionDescription(Receiver, Permission, Giver, Description).

transitivePermission(Receiver, Permission, Giver, OriginalDelay, OriginalDescription, (cons(tuple(Via, "act", Delay), IndirectVia))) :-
  transitivePermission(Via, Permission, Giver, OriginalDelay, OriginalDescription, IndirectVia),
  permission(Receiver, "act", Via),
  defaultedPermissionDelay(Receiver, "act", Via, Delay),
  Permission != "act". % we're only interested in the "final" permission, not intermediate "act".

% 2. Filtering permission to only those we want to display

% a) Don't show permission which gives "act" to someone else
filteredTransitivePermission(Receiver, Permission, Giver, Delay, Description, Via) :-
  transitivePermission(Receiver, Permission, Giver, Delay, Description, Via),
  not permission(_, "act", Receiver).

% b) ...unless it's a direct permission (to say "can be used to")
filteredTransitivePermission(Receiver, Permission, Giver, Delay, Description, nil) :-
  transitivePermission(Receiver, Permission, Giver, Delay, Description, nil).

#show address/3.
#show addressName/2.
#show addressType/2.
#show addressDescription/2.
#show filteredTransitivePermission/6.
