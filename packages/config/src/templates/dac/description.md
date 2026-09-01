## Simple Committee

The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, their operational transparency, and the mechanisms in place to handle disputes and failures.

## Simple DA Bridge

The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification. The bridge requires a {{requiredMembers}}/{{membersCount}} threshold of signatures to be met before the data commitment is accepted
