% When EXECUTOR_ROLE is held by the zero address, anyone can execute a
% scheduled operation, so the proposers effectively act through the
% timelock after the minimum delay.
timelockProposer(@self, &Proposer|orNil).
timelockExecutorRaw(@self, &Executor:raw|quote|orNil).

openExecutorTimelock(@self) :-
  timelockExecutorRaw(@self, "&$.chain:0x0000000000000000000000000000000000000000").

permission(Proposer, "act", @self, &getMinDelay, nil, ".Proposer") :-
  openExecutorTimelock(@self),
  timelockProposer(@self, Proposer),
  Proposer != nil.
