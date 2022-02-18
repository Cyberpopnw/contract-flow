import NonFungibleToken from 0xNonFungibleToken
import CyberPopItems from 0xCyberPopItems

pub fun main(address: Address): [UInt64] {
  if let collection = getAccount(address).getCapability<&CyberPopItems.Collection{NonFungibleToken.CollectionPublic, CyberPopItems.CyberPopItemsCollectionPublic}>(CyberPopItems.CollectionPublicPath).borrow() {
    return collection.getIDs()
  }

  return []
}