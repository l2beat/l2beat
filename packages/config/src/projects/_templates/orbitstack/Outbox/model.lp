permission(L2Entrypoint, "act", @self, DelaySeconds, nil, nil) :-
  challengePeriodSeconds(DelaySeconds),
  l2Entrypoint(L2Entrypoint).
