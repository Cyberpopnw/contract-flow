import FungibleToken from 0xFungibleToken
import CyberPopItems from 0xCyberPopItems
pub struct ItemView {
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    init(
        name: String,
        description: String,
        thumbnail: String,
    ) {
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
    }
}
pub fun main(address: Address, tokenId: UInt64): ItemView? {
  if let collection = getAccount(address).getCapability<&{CyberPopItems.CyberPopItemsCollectionPublic}>(CyberPopItems.CollectionPublicPath).borrow() {
      if let item = collection.borrowCyberPopItem(id: tokenId) {
          let view = ItemView(name: item.name, description: item.description, thumbnail: item.thumbnail)
          return view
      }
  }
  return nil
}