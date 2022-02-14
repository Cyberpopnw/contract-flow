import { config } from "@onflow/fcl";

config({
    "accessNode.api": process.env.ACCESS_API, //"https://access-testnet.onflow.org",
    // "accessNode.api": "https://access-testnet.onflow.org",
    "discovery.wallet": process.env.DISCOVERY_WALLET, //"https://fcl-discovery.onflow.org/testnet/authn",
    // "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    // "0xProfile": "0xba1132bc08f82fe2", //"0xf8d6e0586b0a20c7" // The account address where the smart contract lives
    "0xProfile": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xFungibleToken": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xNonFungibleToken": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xCyberPopToken": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xCyberPopItems": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xLootBox": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xCYBERPOP": process.env.CYBERPOP_ACCOUNT
})