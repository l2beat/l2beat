permission(&challenger, "interact", @self).
permission(&proposer, "interact", @self).

permissionDescription(&challenger, "interact", @self, "challenge").
permissionDescription(&proposer, "interact", @self, "propose").

isPermissionedDisputeGame(@self).