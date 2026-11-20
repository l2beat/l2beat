### Enforcement

ChangeNOW [documents](https://changenow.io/faq/kyc-aml) an automated risk system that can hold an exchange and ask for identity verification. Monero checks nothing, and the wallet screens nobody. The user picks a service for each swap from the list Cake Labs ships, and can pick another for the next. The services are closed.

### Access to private data

A held swap turns into an identity check, so the service then knows who moved those funds.

### Proof of clean origin

Monero has no list and no proof against one. The [private view key](https://github.com/cake-tech/cake_wallet/blob/ae2765659afce6b353d20504830b81198b2fc5e2/lib/view_model/wallet_keys_view_model.dart#L268-L272) opens every incoming payment of the wallet. The [transaction key](https://github.com/cake-tech/cake_wallet/blob/ae2765659afce6b353d20504830b81198b2fc5e2/lib/view_model/transaction_details_view_model.dart#L174-L175) proves one payment to its recipient.
