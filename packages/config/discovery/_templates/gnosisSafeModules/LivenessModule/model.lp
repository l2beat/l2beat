permissionIsInactive(&fallbackOwner, "act", @self) :-
  MemberCount = #count{ X: member(&safe, X) },
  MemberCount >= &minOwners .

permissionIsInactive(Receiver, "act", &safe) :-
  permission(Receiver, "act", &safe),
  Receiver != @self,
  not permissionIsInactive(&fallbackOwner, "act", @self).
