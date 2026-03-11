trustedDirectActor(Actor) :-
  addressType(Actor, eoa).

trustedDirectActor(Actor) :-
  msig(Actor, _).

tokenTrustService(@self, TrustService) :-
  address(@self, Chain, _),
  address(TrustService, Chain, &services.TrustService:raw|lower|quote|orNil).

tokenOwner(@self, Owner) :-
  address(@self, Chain, _),
  address(Owner, Chain, &owner:raw|lower|quote|orNil).

permission(Actor, "interact", @self, 0, "Can upgrade the token, update DS service addresses, and configure token features.", ".admin") :-
  tokenOwner(@self, Actor).

permission(Actor, "interact", @self, 0, "Can upgrade the token, update DS service addresses, and configure token features.", ".admin") :-
  tokenTrustService(@self, TrustService),
  trustedDirectActor(Actor),
  securitizeRole(TrustService, master, Actor).

permission(Actor, "interact", @self, 0, "Can mint tokens, including locked and no-compliance issuance.", ".minter") :-
  tokenTrustService(@self, TrustService),
  trustedDirectActor(Actor),
  securitizeRoleOrAbove(TrustService, issuer, Actor).

permission(Actor, "interact", @self, 0, "Can burn tokens.", ".burner") :-
  tokenTrustService(@self, TrustService),
  trustedDirectActor(Actor),
  securitizeRoleOrAbove(TrustService, issuer, Actor).

permission(Actor, "interact", @self, 0, "Can burn tokens.", ".burner") :-
  tokenTrustService(@self, TrustService),
  trustedDirectActor(Actor),
  securitizeRoleOrAbove(TrustService, transferAgent, Actor).

permission(Actor, "interact", @self, 0, "Can pause or unpause the token, set the initial cap, and use transfer-agent controls such as omnibus burn and seizure.", ".transferController") :-
  tokenTrustService(@self, TrustService),
  trustedDirectActor(Actor),
  securitizeRoleOrAbove(TrustService, transferAgent, Actor).

tokenIssuerService(@self, TokenIssuer) :-
  address(@self, Chain, _),
  address(TokenIssuer, Chain, &services.TokenIssuer:raw|lower|quote|orNil).

transactionRelayerService(@self, TransactionRelayer) :-
  address(@self, Chain, _),
  address(TransactionRelayer, Chain, &services.TransactionRelayer:raw|lower|quote|orNil).

permission(TokenIssuer, "interact", @self, 0, "Can register investors and mint tokens through TokenIssuer.", ".minter") :-
  tokenIssuerService(@self, TokenIssuer).

permission(TransactionRelayer, "interact", @self, 0, "Can relay issuer-approved mint calls through TransactionRelayer.", ".minter") :-
  transactionRelayerService(@self, TransactionRelayer).

permission(TransactionRelayer, "interact", @self, 0, "Can relay issuer-approved burn calls through TransactionRelayer.", ".burner") :-
  transactionRelayerService(@self, TransactionRelayer).

omnibusTBEControllerService(@self, OmnibusTBEController) :-
  address(@self, Chain, _),
  address(OmnibusTBEController, Chain, &services.OmnibusTBEController:raw|lower|quote|orNil).

permission(OmnibusTBEController, "interact", @self, 0, "Can mint omnibus-managed tokens through OmnibusTBEController.", ".minter") :-
  omnibusTBEControllerService(@self, OmnibusTBEController).

permission(OmnibusTBEController, "interact", @self, 0, "Can burn omnibus-managed tokens through OmnibusTBEController.", ".burner") :-
  omnibusTBEControllerService(@self, OmnibusTBEController).

permission(OmnibusTBEController, "interact", @self, 0, "Can transfer omnibus-managed tokens and update omnibus accounting through OmnibusTBEController.", ".omnibusOperator") :-
  omnibusTBEControllerService(@self, OmnibusTBEController).

bulkOperatorService(@self, BulkOperator) :-
  address(@self, Chain, _),
  address(BulkOperator, Chain, &services.BulkOperator:raw|lower|quote|orNil).

permission(BulkOperator, "interact", @self, 0, "Can batch-mint tokens through BulkOperator.", ".minter") :-
  bulkOperatorService(@self, BulkOperator).

permission(BulkOperator, "interact", @self, 0, "Can batch-burn tokens through BulkOperator.", ".burner") :-
  bulkOperatorService(@self, BulkOperator).

issuerMulticallService(@self, IssuerMulticall) :-
  address(@self, Chain, _),
  address(IssuerMulticall, Chain, &services.IssuerMulticall:raw|lower|quote|orNil).

permission(IssuerMulticall, "interact", @self, 0, "Can batch issuer-scoped mint calls through IssuerMulticall.", ".minter") :-
  issuerMulticallService(@self, IssuerMulticall).

permission(IssuerMulticall, "interact", @self, 0, "Can batch issuer-scoped burn calls through IssuerMulticall.", ".burner") :-
  issuerMulticallService(@self, IssuerMulticall).
