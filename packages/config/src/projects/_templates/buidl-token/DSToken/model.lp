permission(Actor, "interact", @self, 0, "Can manage roles and execute any token operation including granting/revoking permissions.", ".masterRole") :-
  address(@self, Chain, _),
  address(TS, Chain, _),
  securitizeRole(TS, master, Actor).

permission(Actor, "interact", @self, 0, "Can mint new tokens and burn existing tokens.", ".issuerRole") :-
  address(@self, Chain, _),
  address(TS, Chain, _),
  securitizeRole(TS, issuer, Actor).

permission(Actor, "interact", @self, 0, "Can force transfer tokens from any account (used for compliance/seizure).", ".transferAgentRole") :-
  address(@self, Chain, _),
  address(TS, Chain, _),
  securitizeRole(TS, transferAgent, Actor).
