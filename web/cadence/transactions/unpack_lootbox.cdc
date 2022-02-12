import LootBox from 0xLootBox
import NonFungibleToken from 0xNonFungibleToken
import CyberPopItems from 0xCyberPopItems

transaction(id: UInt64) {
    let nftRecipient: &{NonFungibleToken.Receiver}
    let collection: &LootBox.Collection{LootBox.LootBoxCollectionPublic}
    prepare(acct: AuthAccount) {
        self.collection = acct.borrow<&LootBox.Collection>(from: LootBox.CollectionStoragePath) ?? panic("failed to borrow public collection")
        self.nftRecipient = acct.getCapability<&{NonFungibleToken.Receiver}>(CyberPopItems.CollectionPublicPath).borrow() ?? panic("cannot borrow NFT receiver")
    }

    execute {
        self.collection.unpackLootBox(id: id, recipient: self.nftRecipient)
    }
}