% disable current permission when safe has enough members
permissionIsInactive(&fallbackOwner, "act", @self) :-
  MemberCount = #count{ X: member(&safe, X) },
  MemberCount >= &minOwners .

% if current permission is active, disable all other act permissions
permissionIsInactive(Receiver, "act", &safe) :-
  permission(Receiver, "act", &safe),
  Receiver != @self,
  not permissionIsInactive(&fallbackOwner, "act", @self).


% if current permission is active, disable canActIndependently on safe
canActIndependently(&safe, no) :-
  not permissionIsInactive(&fallbackOwner, "act", @self).
