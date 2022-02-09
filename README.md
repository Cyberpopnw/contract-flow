## Getting Started

1. [Install the Flow CLI](https://github.com/onflow/flow-cli).

2. Start the emulator.

```bash
flow emulator
```

3. Start dev fcl wallet

```
docker run -it \
    -p 8701:8701
    -e PORT=8701 \
    -e BASE_URL=http://localhost:8701
    -e FLOW_ACCESS_NODE=http://emulator:8080 \
    -e FLOW_ACCOUNT_KEY_ID=0 \
    -e FLOW_ACCOUNT_PRIVATE_KEY=4f82df6790f07b281adb5bbc848bd6298a2de67f94bdfac7a400d5a1b893de5 \
    -e FLOW_ACCOUNT_PUBLIC_KEY=519e9fbf966c6589fafe60903c0da5f55c5cb50aee5d870f097b35dfb6de13c170718cd92f50811cdd9290e51c2766440b696e0423a5031ae482cca79e3c479 \
    -e FLOW_INIT_ACCOUNTS=0 \
    -e FLOW_ACCOUNT_ADDRESS=0xf8d6e0586b0a20c7 \
    -e FLOW_AVATAR_URL=https://avatars.onflow.org/avatar/ \
    -e CONTRACT_FUNGIBLE_TOKEN=0xee82856bf20e2aa6 \
    -e CONTRACT_FLOW_TOKEN=0x0ae53cb6e3f42a79 \
    -e CONTRACT_FUSD=0xf8d6e0586b0a20c7 \
    -e TOKEN_AMOUNT_FLOW=100.0 \
    -e TOKEN_AMOUNT_FUSD=100.0 \
    ghcr.io/onflow/fcl-dev-wallet:latest
```

4. Start web ui


```
cd web; npm run start
```
