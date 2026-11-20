### Enforcement

The immutable pools check no list at deposit or at withdrawal, and the app screens nobody. No key or role exists that could approve, block or disclose. A relayer can refuse to submit a withdrawal. The user then picks another or submits it from their own wallet. Circle and Tether can freeze the USDC and USDT that the token pools hold. The pools keep nobody out, so a withdrawal alone cannot show that its deposit is not a flagged one. OFAC's listing and delisting of the pools are under [milestones](#milestones-and-incidents).

### Proof of clean origin

The app's [compliance page](https://github.com/torndao777-eng/classic-ui/blob/8af0abd14d7eeb734f943b968ce687cb5946eac6/pages/compliance.vue) builds the report from a note. 0xbow's [Proof of Association](https://tornado.0xbow.io), an outside tool, proves that a withdrawal's deposit is on 0xbow's list, without showing which deposit. It posts the proof to a registry contract, where it also narrows the withdrawal's possible deposits to that list. 0xbow curates the list and says it excludes deposits tied to sanctioned or criminal groups, hacks, theft and scams.
