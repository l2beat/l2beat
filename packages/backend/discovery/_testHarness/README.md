# How to update

- `git clone https://github.com/foundry-rs/forge-std`
- `cd forge-std`
- `git submodule update --init --recursive`
- `forge flatten src/Test.sol > Test.sol`
- `forge flatten src/Script.sol > Script.sol`

The two files that you have created while flattening (`Test.sol` and
`Script.sol`) are your updated versions of the ones present in this directory.
Simply copy them over and commit them to main, and you've successfully
upgraded the testing harness!
