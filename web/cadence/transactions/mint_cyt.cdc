import FungibleToken from 0xFungibleToken
import CyberPopToken from 0xCyberPopToken

transaction {
    let admin: &CyberPopToken.Administrator
    let receiver: &{FungibleToken.Receiver}
    prepare(acct: AuthAccount) {
        self.admin = acct.borrow<&CyberPopToken.Administrator>(from: /storage/cyberPopTokenAdmin) ?? panic("cannot borrow admin")
        self.receiver = acct.getCapability<&{FungibleToken.Receiver}>(CyberPopToken.receiverStoragePath).borrow() ?? panic("cannot borrow receiver")
    }
    execute {
        let amount = 1_000_000.0
        let minter <- self.admin.createNewMinter(allowedAmount: amount)
        let vault <- minter.mintTokens(
            amount: amount
        )
        self.receiver.deposit(from: <- vault)
        destroy minter
    }
}