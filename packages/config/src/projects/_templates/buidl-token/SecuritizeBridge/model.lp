bridgeDSToken(@self, DSToken) :-
  address(@self, Chain, _),
  address(DSToken, Chain, &dsToken:raw|lower|quote).

permission(@self, "interact", DSToken, 0, "Can burn user-requested tokens before bridging them out.", ".burner") :-
  bridgeDSToken(@self, DSToken).

permission(@self, "interact", DSToken, 0, "Can mint bridged tokens delivered from an approved remote bridge.", ".minter") :-
  bridgeDSToken(@self, DSToken).

roleScopedAct(@self).
