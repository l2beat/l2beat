% disable current permission when safe has enough members
isInactive(&fallbackOwner, "act", @self) :-
  MemberCount = #count{ X: member(&safe, X) },
  MemberCount >= &minOwners .