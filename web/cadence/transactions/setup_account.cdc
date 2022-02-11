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
transaction {
    prepare(acct: AuthAccount) {
        if (!hasLootbox(acct.address)) {
            let lootboxCollection <- LootBox.createEmptyCollection()
            // init Lootbox collection
            acct.save(<- lootboxCollection, to: LootBox.CollectionStoragePath)
            // create a public capability for the collection
            acct.link<&LootBox.Collection{NonFungibleToken.CollectionPublic, LootBox.LootBoxCollectionPublic}>(
                LootBox.CollectionPublicPath,
                target: LootBox.CollectionStoragePath
            )
        }

        if (!hasCYT(acct.address)) {
            // init CYT token vault
            let cytVault <- CyberPopToken.createEmptyVault()
            acct.save(<- cytVault, to: CyberPopToken.VaultStoragePath)
            // Create a public capability to the stored Vault that only exposes
            // the `deposit` method through the `Receiver` interface
            //
            acct.link<&{FungibleToken.Receiver}>(
                CyberPopToken.ReceiverPublicPath,
                target: CyberPopToken.VaultStoragePath
            )

            // Create a public capability to the stored Vault that only exposes
            // the `balance` field through the `Balance` interface
            //
            acct.link<&CyberPopToken.Vault{FungibleToken.Balance}>(
                CyberPopToken.BalancePublicPath,
                target: CyberPopToken.VaultStoragePath,
            )
        }

        if (!hasNFT(acct.address)) {
            // init CyberPop NFT collection
            let nftCollection <- CyberPopItems.createEmptyCollection()
            acct.save(<- nftCollection, to: CyberPopItems.CollectionStoragePath)
            acct.link<&CyberPopItems.Collection{NonFungibleToken.CollectionPublic, CyberPopItems.CyberPopItemsCollectionPublic}>(
                CyberPopItems.CollectionPublicPath,
                target: CyberPopItems.CollectionStoragePath
            )
        }
    }
}