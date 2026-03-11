% IssuerMulticall is a batch wrapper for issuance operations.
% It should not appear as an independent permission holder.
preventActingIndependently(@self).

% "act" through IssuerMulticall should inherit only matching roles.
roleScopedAct(@self).

wrapperTrustService(Wrapper, TrustService) :-
  address(Wrapper, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

issuerMulticallTargetToken(Wrapper, Token) :-
  wrapperTrustService(Wrapper, TrustService),
  tokenTrustService(Token, TrustService).

permission(@self, "interact", Token, 0, "Can batch issuer-scoped mint calls through IssuerMulticall.", ".minter") :-
  issuerMulticallTargetToken(@self, Token).

permission(@self, "interact", Token, 0, "Can batch issuer-scoped burn calls through IssuerMulticall.", ".burner") :-
  issuerMulticallTargetToken(@self, Token).

% Actors with issuer-or-above access can batch issuer-scoped mint and burn calls.
% Exclude other batch wrappers to prevent infinite "act" cycles in the transitive closure.
permission(Actor, "act", @self, 0, nil, ".minter") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).

permission(Actor, "act", @self, 0, nil, ".burner") :-
  wrapperTrustService(@self, TrustService),
  securitizeRoleOrAbove(TrustService, issuer, Actor),
  not preventActingIndependently(Actor).
