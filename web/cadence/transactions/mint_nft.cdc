import NonFungibleToken from 0xNonFungibleToken
import CyberPopItems from 0xCyberPopItems

transaction {
    let minter: &CyberPopItems.NFTMinter
    let nftCollection: &CyberPopItems.Collection
    prepare(acct: AuthAccount) {
        self.minter = acct.borrow<&CyberPopItems.NFTMinter>(from: CyberPopItems.MinterStoragePath) ?? panic("cannot borrow minter")
        self.nftCollection = acct.borrow<&CyberPopItems.Collection>(from: CyberPopItems.CollectionStoragePath) ?? panic("cannot borrow collection")
    }
    execute {
        self.minter.mintNFT(
            recipient: self.nftCollection as &AnyResource{NonFungibleToken.Receiver},
            name: "nft1",
            description: "my first nft",
            thumbnail: "foo.jpg"
        )
    }
}