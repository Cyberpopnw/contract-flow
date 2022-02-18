import CyberPopToken from 0xCyberPopToken
import LootBox from 0xLootBox
import CyberPopItems from 0xCyberPopItems
import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken

pub fun hasNFT(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&CyberPopItems.Collection{NonFungibleToken.CollectionPublic}>(CyberPopItems.CollectionPublicPath)
    .check()
}

pub fun hasCYT(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&CyberPopToken.Vault{FungibleToken.Balance}>(CyberPopToken.BalancePublicPath)
    .check()
}

pub fun hasLootbox(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&LootBox.Collection{NonFungibleToken.CollectionPublic}>(LootBox.CollectionPublicPath)
    .check()
}

pub fun main(address: Address): {String: Bool} {
  let ret: {String: Bool} = {}
  ret["CYT"] = hasCYT(address)
  ret["NFT"] = hasNFT(address)
  ret["LootBox"] = hasLootBox(address)
  return ret
}