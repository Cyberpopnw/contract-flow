import NonFungibleToken from 0xNonFungibleToken
import CyberPopItems from 0xCyberPopItems

transaction {
    let minter: &CyberPopItems.NFTMinter
    let nftCollection: &{NonFungibleToken.CollectionPublic}
    prepare(acct: AuthAccount) {
        self.minter = acct.borrow<&CyberPopItems.NFTMinter>(from: CyberPopItems.MinterStoragePath) ?? panic("cannot borrow minter")
        self.nftCollection = acct.borrow<&CyberPopItems.Collection>(from: CyberPopItems.CollectionStoragePath) ?? panic("cannot borrow collection")
    }
    execute {
        self.minter.mintNFT(
            recipient: self.nftCollection,
            name: "nft1",
            description: "my first nft",
            thumbnail: "foo.jpg"
        )
    }
}