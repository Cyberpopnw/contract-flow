import LootBox from 0xLootBox
import NonFungibleToken from 0xNonFungibleToken
import CyberPopItems from 0xCyberPopItems

transaction(id: UInt64) {
    let nftRecipient: &{NonFungibleToken.Receiver}
    let collection: &LootBox.Collection{LootBox.LootBoxCollectionPublic}
    prepare(acct: AuthAccount) {
        self.collection = acct.getCapability<&LootBox.Collection{LootBox.LootBoxCollectionPublic}>(LootBox.CollectionPublicPath).borrow() ?? panic("failed to borrow public collection")
        let col = acct.borrow<&CyberPopItems.Collection>(from: CyberPopItems.CollectionStoragePath) ?? panic("cannot borrow collection")
        self.nftRecipient = col as! &AnyResource{NonFungibleToken.Receiver}
    }

    execute {
        self.collection.unpackLootBox(id: id, recipient: self.nftRecipient)
    }
}