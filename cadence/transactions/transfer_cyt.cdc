import FungibleToken from 0xf8d6e0586b0a20c7
import CyberPopToken from 0xf8d6e0586b0a20c7

transaction (recipient: Address, amount: UFix64) {
    let vault: &CyberPopToken.Vault
    let receiver: &{FungibleToken.Receiver}
    prepare(acct: AuthAccount) {
        self.vault = acct.borrow<&CyberPopToken.Vault>(from: CyberPopToken.VaultStoragePath) ?? panic("cannot borrow vault")
        self.receiver = getAccount(recipient).getCapability<&{FungibleToken.Receiver}>(CyberPopToken.ReceiverPublicPath).borrow() ?? panic("cannot borrow receiver")
    }
    execute {
        let payment <- self.vault.withdraw(amount: amount)
        self.receiver.deposit(from: <- payment)
    }
}