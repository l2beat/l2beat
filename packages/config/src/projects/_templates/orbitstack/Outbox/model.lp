permission(L2Entrypoint, "act", @self) :-
  l2Entrypoint(L2Entrypoint).

permissionDelay(L2Entrypoint, "act", @self, Seconds) :-
  challengePeriodSeconds(Seconds),
  permission(L2Entrypoint, "act", @self).
