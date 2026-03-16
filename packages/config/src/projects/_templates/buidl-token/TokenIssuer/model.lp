% TokenIssuer is a wrapper for token issuance and investor registration.
% It should not appear as an independent permission holder.
preventActingIndependently(@self).

% "act" through TokenIssuer should inherit only matching roles.
roleScopedAct(@self).

wrapperTrustService(Wrapper, TrustService) :-
  address(Wrapper, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

% Actors with issuer-or-above access can mint through TokenIssuer.
% Exclude other batch wrappers to prevent infinite "act" cycles in the transitive closure.
permission(Actor, "act", @self, 0, nil, ".minter") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).

% Master role holder can upgrade TokenIssuer and configure service parameters.
permission(MasterActor, "upgrade", @self, 0, "Can upgrade TokenIssuer and configure service parameters.", ".admin") :-
  wrapperTrustService(@self, TrustService),
  securitizeRole(TrustService, master, MasterActor).
