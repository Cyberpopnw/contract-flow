// CyberPop LootBox NFT contract

import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import CyberPopItems from "./CyberPopItems.cdc"
import FungibleToken from "./FungibleToken.cdc"
import CyberPopToken from "./CyberPopToken.cdc"

pub contract LootBox: NonFungibleToken {
    access(self) var templates: {UInt32: Template}
    access(self) var nftTemplates: {UInt32: NFTTemplate}
    access(self) var nftProbabilities: {UInt32: [UInt64]}
    access(contract) var tokenReceiver: Capability<&{FungibleToken.Receiver}>

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub struct Template {
      pub let templateID: UInt32
      pub let color: String
      pub let class: String
      pub let thumbnail: String
      pub let price: UFix64

      init(
          id: UInt32,
          class: String,
          color: String,
          thumbnail: String,
          price: UFix64
      ) {
          self.templateID = id
          self.class = class
          self.color = color
          self.thumbnail = thumbnail
          self.price = price
      }
    }

    pub struct NFTTemplate {
        pub let templateID: UInt32
        pub let name: String
        pub let description: String
        pub let thumbnail: String

        init(
            id: UInt32,
            name: String,
            description: String,
            thumbnail: String
        ) {
            self.templateID = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
        }
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64

        pub let class: String
        pub let color: String
        pub let thumbnail: String
        pub let nftId: UInt32
        access(self) let minter: Capability<&CyberPopItems.NFTMinter{CyberPopItems.Minter}>
        access(self) let recipient: Capability<&{NonFungibleToken.Receiver}>

        init(
            id: UInt64,
            class: String,
            color: String,
            thumbnail: String,
            recipient: Capability<&{NonFungibleToken.Receiver}>,
            minter: Capability<&CyberPopItems.NFTMinter{CyberPopItems.Minter}>,
            nftId: UInt32,
        ) {
            self.id = id
            self.class = class 
            self.color = color
            self.thumbnail = thumbnail
            self.minter = minter
            self.recipient = recipient
            self.nftId = nftId
        }
    
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.class,
                        description: self.color,
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.thumbnail
                        )
                    )
            }

            return nil
        }

        access(contract) fun unpack(recipient: &{NonFungibleToken.Receiver}): String {
            let index = self.weightedRandom(chances: LootBox.nftProbabilities[self.nftId]!)
            let tpl = LootBox.nftTemplates[index]!
            self.minter.borrow()!.mintNFT(recipient: self.recipient.borrow()!,
                name: tpl.name,
                description: tpl.description,
                thumbnail: tpl.thumbnail)
            return tpl.name
        }

        // @param chances An array of integer, each element represent the weight of corresponding index
        // @returns the index picked up
        access(self) fun weightedRandom(chances: [UInt64]): UInt32 {
            var sum: UInt64 = 0
            for chance in chances {
                sum = sum + chance
            }
            var x = unsafeRandom() % sum
            var index: UInt32 = 0
            for chance in chances {
                if x < chance {
                    return index
                }
                index = index + 1
                x = x - chance
            }
            return 0
        }
    }

    pub resource interface LootBoxCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowLootBox(id: UInt64): &LootBox.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow LootBox reference: the ID of the returned reference is incorrect"
            }
        }
        pub fun unpackLootBox(id: UInt64, recipient: &{NonFungibleToken.Receiver}): String
    }

    pub resource Collection: LootBoxCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @LootBox.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }
 
        pub fun borrowLootBox(id: UInt64): &LootBox.NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &LootBox.NFT
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
            let cyberPopItem = nft as! &LootBox.NFT
            return cyberPopItem as &AnyResource{MetadataViews.Resolver}
        }

        pub fun unpackLootBox(id: UInt64, recipient: &{NonFungibleToken.Receiver}): String {
            let lootbox = self.borrowLootBox(id: id)!
            let name = lootbox.unpack(recipient: recipient)
            destroy <- self.withdraw(withdrawID: id)
            return name
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Buy lootbox with CYT
    pub fun buy(
        category templateID: UInt32,
        paymentVault: @FungibleToken.Vault,
        nftRecipient: Capability<&{NonFungibleToken.Receiver}>) : @NFT {
        assert(nftRecipient.check(), message: "cannot borrow nft receiver")
        let tpl = LootBox.templates[templateID] ?? panic("Unknown lootbox category")
        let receiver = self.tokenReceiver.borrow()!
        receiver.deposit(from: <- paymentVault)
        let minter = self.account.borrow<&NFTMinter>(from: self.MinterStoragePath)!
        let nftMinter = self.account.getCapability<&CyberPopItems.NFTMinter{CyberPopItems.Minter}>(/public/minterPublicPath)
        assert(nftMinter.check(), message: "cannot borrow minter")
        let lootbox <- minter.mintNFT(
            nftRecipient: nftRecipient,
            class: tpl.class, 
            color: tpl.color, 
            thumbnail: tpl.thumbnail,
            minter: nftMinter,
            nftId: templateID)
        return <- lootbox
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        pub fun mintNFT(
            nftRecipient: Capability<&{NonFungibleToken.Receiver}>,
            class: String,
            color: String,
            thumbnail: String,
            minter: Capability<&CyberPopItems.NFTMinter{CyberPopItems.Minter}>,
            nftId: UInt32,
        ) : @NFT {
            // create a new NFT
            var newNFT <- create NFT(
                id: LootBox.totalSupply,
                class: class,
                color: color,
                thumbnail: thumbnail,
                recipient: nftRecipient,
                minter: minter,
                nftId: nftId,
            )

            LootBox.totalSupply = LootBox.totalSupply + UInt64(1)
            return <- newNFT
        }
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0
        self.templates = {}
        self.nftTemplates = {}
        self.nftProbabilities = {}
        self.tokenReceiver = self.account.getCapability<&{FungibleToken.Receiver}>(CyberPopToken.ReceiverPublicPath)

        // Set the named paths
        self.CollectionStoragePath = /storage/cyberPopLootBoxCollection
        self.CollectionPublicPath = /public/cyberPopLootBoxCollection
        self.MinterStoragePath = /storage/cyberPopLootBoxMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // create a public capability for the collection
        self.account.link<&LootBox.Collection{NonFungibleToken.CollectionPublic, LootBox.LootBoxCollectionPublic}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)
        self.templates[0] = Template(
            id: 0,
            class: "S",
            color: "Green",
            thumbnail: "green_box.jpg",
            price: 100.0
        )

        self.templates[1] = Template(
            id: 1,
            class: "SS",
            color: "Pink",
            thumbnail: "pink_box.jpg",
            price: 120.0
        )

        self.nftTemplates[0] = NFTTemplate(
            id: 0,
            name: "dragon",
            description: "Mighty Dragon",
            thumbnail: "drag.jpg"
        )

        self.nftTemplates[0] = NFTTemplate(
            id: 0,
            name: "dragon",
            description: "Mighty Dragon",
            thumbnail: "drag.jpg"
        )

        self.nftTemplates[1] = NFTTemplate(
            id: 1,
            name: "egg",
            description: "A delicious egg",
            thumbnail: "egg.jpg"
        )

        self.nftProbabilities[0] = [50, 50]
        self.nftProbabilities[1] = [10, 90]

        emit ContractInitialized()
    }
}
