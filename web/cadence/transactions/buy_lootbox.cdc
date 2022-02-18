import FungibleToken from 0xFungibleToken
import LootBox from 0xLootBox
import CyberPopToken from 0xCyberPopToken
import CyberPopItems from 0xCyberPopItems
import NonFungibleToken from 0xNonFungibleToken

transaction (category: UInt32, amount: UFix64) {
    let paymentVault: @FungibleToken.Vault
    let lootboxReceiver: &{NonFungibleToken.Receiver}
    let nftReceiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(acct: AuthAccount) {
        let vault = acct.borrow<&CyberPopToken.Vault>(from: CyberPopToken.VaultStoragePath) ?? panic("unable to borrow CYT vault")
        self.paymentVault <- vault.withdraw(amount: amount)
        let lootboxCollection = acct.borrow<&LootBox.Collection>(from: LootBox.CollectionStoragePath) ?? panic("cannot borrow collection")
        self.lootboxReceiver = lootboxCollection as &AnyResource{NonFungibleToken.Receiver}
        self.nftReceiver  = acct.getCapability<&{NonFungibleToken.Receiver}>(CyberPopItems.CollectionPublicPath)
        assert(self.nftReceiver.check(), message: "cannot borrow nft receiver")
    }
    pre {
        // self.nftReceiver.check() : panic("cannot borrow collection")
    }

    execute {
        let lootbox <- LootBox.buy(
            category: category,
            paymentVault: <-self.paymentVault,
            nftRecipient: self.nftReceiver
        )
        self.lootboxReceiver.deposit(token: <-lootbox)
    }
}