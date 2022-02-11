import CyberPopToken from 0xCyberPopToken
import LootBox from 0xLootBox
import CyberPopItems from 0xCyberPopItems

transaction {
    prepare(acct: AuthAccount) {
        let lootboxCollection <- LootBox.createEmptyCollection()
        // init Lootbox collection
        acct.save(<- lootboxCollection, LootBox.CollectionStoragePath)
        // create a public capability for the collection
        acct.link<&LootBox.Collection{NonFungibleToken.CollectionPublic, LootBox.LootBoxCollectionPublic}>(
            LootBox.CollectionPublicPath,
            target: LootBox.CollectionStoragePath
        )

        // init CYT token vault
        let cytVault <- CyberPopToken.createEmptyVault()
        account.save(<- cytVault, CyberPopToken.VaultStoragePath)
        // Create a public capability to the stored Vault that only exposes
        // the `deposit` method through the `Receiver` interface
        //
        self.account.link<&{FungibleToken.Receiver}>(
            CyberPopToken.ReceiverPublicPath,
            target: CyberPopToken.VaultStoragePath
        )

        // Create a public capability to the stored Vault that only exposes
        // the `balance` field through the `Balance` interface
        //
        self.account.link<&CyberPopToken.Vault{FungibleToken.Balance}>(
            CyberPopToken.BalancePublicPath,
            target: CyberPopToken.VaultStoragePath,
        )

        // init CyberPop NFT collection
        let nftCollection <- CyberPopItems.createEmptyCollection())
        account.save(<- nftCollection, CyberPopItems.CollectionStoragePath)
        acct.link<&LootBox.Collection{NonFungibleToken.CollectionPublic, CyberPopItems.CyberPopItemsCollectionPublic}>(
            CyberPopItems.CollectionPublicPath,
            target: CyberPopItems.CollectionStoragePath
        )
    }
}