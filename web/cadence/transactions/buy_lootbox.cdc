import FungibleToken from 0xFungibleToken
import LootBox from 0xLootBox
import CyberPopToken from 0xCyberPopToken
import NonFungibleToken from 0xNonFungibleToken

transaction (category: UInt32, amount: UFix64) {
    let paymentVault: &{FungibleToken.Provider}
    let nftCollection: &{NonFungibleToken.Receiver}
    parepare(acct: AuthAccount) {
        let vault = acct.borrow<&CyberPopToken.Vault>(from: CyberPopToken.VaultStoragePath) ?? panic("unable to borrow CYT vault")
        self.paymentVault <- vault.withdraw(amount: amount) as &{FungibleToken.Provider}
        self.nftCollection = acct.getCapability<&{NonFungibleToken.Receiver}>(LootBox.CollectionPublicPath).borrow() ?? panic("Unable to borrow NFT collection")
    }

    execute {
        let lootbox <- LootBox.buy(category: category, paymentVault: <- self.paymentVault)
        self.nftCollection.deposit(<-lootbox)
    }
}