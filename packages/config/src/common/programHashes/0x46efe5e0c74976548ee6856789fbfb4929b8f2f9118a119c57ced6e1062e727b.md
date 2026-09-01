1. Install docker.
2. Check out the correct branch in [raiko repo](https://github.com/taikoxyz/raiko/tree/main):
```
git clone https://github.com/taikoxyz/raiko.git
cd raiko
git checkout hotfix/hotfix-based-on-1.16.1
```
3. Execute `script/publish-image.sh` script that will rebuild zk programs from sources and output the necessary program hash:
```
chmod +x script/publish-image.sh
./script/publish-image.sh
```
In the options choose latest tag and zk. The hash will be labeled risc0 elf image id and will not have `0x` prefix.
