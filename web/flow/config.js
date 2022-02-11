import { config } from "@onflow/fcl";

config({
    "accessNode.api": "http://localhost:8080", //"https://access-testnet.onflow.org",
    // "accessNode.api": "https://access-testnet.onflow.org",
    "discovery.wallet": "http://localhost:8701/fcl/authn", //"https://fcl-discovery.onflow.org/testnet/authn",
    // "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    // "0xProfile": "0xba1132bc08f82fe2", //"0xf8d6e0586b0a20c7" // The account address where the smart contract lives
    "0xProfile": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xFungibleToken": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xNonFungibleToken": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xCyberPopToken": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xCyberPopItems": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
    "0xLootBox": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
})