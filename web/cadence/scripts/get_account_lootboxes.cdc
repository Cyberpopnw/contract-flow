import NonFungibleToken from 0xNonFungibleToken
import LootBox from 0xLootBox

pub fun main(address: Address): [UInt64] {
  if let collection = getAccount(address).getCapability<&LootBox.Collection{NonFungibleToken.CollectionPublic, LootBox.LootBoxCollectionPublic}>(LootBox.CollectionPublicPath).borrow() {
    return collection.getIDs()
  }

  return []
}