# CyberPop Backend API


## Setup

```
npm install
npm run dev
```

## Endpoints

1. Get CYT balance

`GET /:address/cyt` 

returns

```
{"balance": "1000.0"}
```

2. Get NFT information

`GET /:address/nfts`

returns

```
{"items":[{"name":"Double Dragger","description":"They are primary weapons for certain Assassin-type classes.","thumbnail":"doubleaxe.jpg"}]}
```
