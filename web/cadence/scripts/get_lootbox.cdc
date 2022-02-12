import FungibleToken from 0xFungibleToken
import CyberPopToken from 0xCyberPopToken
import LootBox from 0xLootBox
pub struct LootBoxView {
    pub let class: String
    pub let color: String
    init(
        class: String,
        color: String,
    ) {
        self.class = class
        self.color = color
    }
}
pub fun main(address: Address, lootBoxId: UInt64): LootBoxView? {
  if let collection = getAccount(address).getCapability<&{LootBox.LootBoxCollectionPublic}>(LootBox.CollectionPublicPath).borrow() {
      if let lootbox = collection.borrowLootBox(id: lootBoxId) {
          let view = LootBoxView(class: lootbox.class, color: lootbox.color)
          return view
      }
  }
  return nil
}