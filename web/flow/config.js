import { config } from "@onflow/fcl";

console.log(process.env.NEXT_PUBLIC_ACCESS_NODE);
config({
    "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE,
    "discovery.wallet": process.env.NEXT_PUBLIC_WALLET_DISCOVERY,
    "0xFungibleToken": process.env.NEXT_PUBLIC_FT_CONTRACT,
    "0xFUSD": process.env.NEXT_PUBLIC_FUSD_CONTRACT,
    // "accessNode.api": process.env.ACCESS_API, //"https://access-testnet.onflow.org",
    // "accessNode.api": "http://localhost:8080", //"https://access-testnet.onflow.org",
    // "accessNode.api": "https://access-testnet.onflow.org",
    //"discovery.wallet": "http://localhost:8701/fcl/authn", //"https://fcl-discovery.onflow.org/testnet/authn",
    //"discovery.wallet": process.env.DISCOVERY_WALLET, //"https://fcl-discovery.onflow.org/testnet/authn",
    // "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    // "0xProfile": "0xba1132bc08f82fe2", //"0xf8d6e0586b0a20c7" // The account address where the smart contract lives
    "0xProfile": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT, // The account address where the smart contract lives
    "0xFungibleToken": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT, // The account address where the smart contract lives
    "0xNonFungibleToken": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT, // The account address where the smart contract lives
    "0xCyberPopToken": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT, // The account address where the smart contract lives
    "0xCyberPopItems": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT, // The account address where the smart contract lives
    "0xLootBox": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT, // The account address where the smart contract lives
    "0xCYBERPOP": process.env.NEXT_PUBLIC_CYBERPOP_ACCOUNT
})
