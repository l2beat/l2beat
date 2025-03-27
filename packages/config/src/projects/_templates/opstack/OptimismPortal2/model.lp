isOptimismPortal(@self).

value(@self, "respectedGameType", &respectedGameType).
value(@self, "disputeGameFactory", &disputeGameFactory).

permission(&guardian, "interact", @self).
permissionDescription(&guardian, "interact", @self, "setRespectedGameType").

