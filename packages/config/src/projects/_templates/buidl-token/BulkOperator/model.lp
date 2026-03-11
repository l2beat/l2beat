% BulkOperator is a gas-optimized batch wrapper for issuance/burns.
% It should not appear as an independent permission holder.
preventActingIndependently(@self).

% "act" through BulkOperator should inherit only matching roles.
roleScopedAct(@self).

wrapperTrustService(Wrapper, TrustService) :-
  address(Wrapper, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

% Actors with issuer-or-above access can batch-mint and batch-burn through BulkOperator.
% Exclude other batch wrappers to prevent infinite "act" cycles in the transitive closure.
permission(Actor, "act", @self, 0, nil, ".minter") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).

permission(Actor, "act", @self, 0, nil, ".burner") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).

% Actors with transfer-agent-or-above access can also batch-burn through BulkOperator.
permission(Actor, "act", @self, 0, nil, ".burner") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, transferAgent, Actor),
  not preventActingIndependently(Actor).
