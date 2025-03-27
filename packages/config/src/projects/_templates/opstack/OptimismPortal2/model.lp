isOptimismPortal(@self).

value(@self, "respectedGameType", &respectedGameType).
value(@self, "disputeGameFactory", &disputeGameFactory).

canSetRespectedGameType(@self, &guardian).

permission(&guardian, "interact", @self).
permissionDescription(&guardian, "interact", @self, "setRespectedGameType").

