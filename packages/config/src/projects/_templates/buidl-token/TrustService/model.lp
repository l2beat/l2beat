% Exact role assignments emitted from TrustService events.
securitizeRole(@self, master, &masterRole).
securitizeRole(@self, issuer, &issuerRole).
securitizeRole(@self, transferAgent, &transferAgentRole).

% ServiceConsumer modifiers treat master as "above" issuer and transfer agent.
securitizeRoleOrAbove(TS, issuer, Actor) :-
  securitizeRole(TS, issuer, Actor).

securitizeRoleOrAbove(TS, issuer, Actor) :-
  securitizeRole(TS, master, Actor).

securitizeRoleOrAbove(TS, transferAgent, Actor) :-
  securitizeRole(TS, transferAgent, Actor).

securitizeRoleOrAbove(TS, transferAgent, Actor) :-
  securitizeRole(TS, master, Actor).

% roleScopedAct wrappers should only forward permissions within the same modifier scope.
roleScopeCompatible(".masterRole", ".masterRole").
roleScopeCompatible(".issuerRole", ".issuerRole").
roleScopeCompatible(".transferAgentRole", ".transferAgentRole").
roleScopeCompatible(".issuerOrAbove", ".issuerOrAbove").
roleScopeCompatible(".transferAgentOrAbove", ".transferAgentOrAbove").
roleScopeCompatible(".issuerRole", ".issuerOrAbove").
roleScopeCompatible(".issuerOrAbove", ".issuerRole").
roleScopeCompatible(".transferAgentRole", ".transferAgentOrAbove").
roleScopeCompatible(".transferAgentOrAbove", ".transferAgentRole").

% DSToken uses functional permission groups that map back to TrustService roles.
roleScopeCompatible(".admin", ".admin").
roleScopeCompatible(".admin", ".masterRole").

roleScopeCompatible(".minter", ".minter").
roleScopeCompatible(".minter", ".issuerRole").
roleScopeCompatible(".minter", ".issuerOrAbove").

roleScopeCompatible(".burner", ".burner").
roleScopeCompatible(".burner", ".issuerRole").
roleScopeCompatible(".burner", ".issuerOrAbove").
roleScopeCompatible(".burner", ".transferAgentRole").
roleScopeCompatible(".burner", ".transferAgentOrAbove").

roleScopeCompatible(".transferController", ".transferController").
roleScopeCompatible(".transferController", ".transferAgentRole").
roleScopeCompatible(".transferController", ".transferAgentOrAbove").

roleScopeCompatible(".omnibusOperator", ".omnibusOperator").
roleScopeCompatible(".omnibusOperator", ".issuerRole").
roleScopeCompatible(".omnibusOperator", ".issuerOrAbove").
roleScopeCompatible(".omnibusOperator", ".transferAgentRole").
roleScopeCompatible(".omnibusOperator", ".transferAgentOrAbove").
