import FungibleToken from 0xFungibleToken
import CyberPopToken from 0xCyberPopToken

pub fun main(address: Address): UFix64 {
  if let balanceCap = getAccount(address).getCapability<&{FungibleToken.Balance}>(/public/cyberPopTokenBalance).borrow() {
    return balanceCap.balance
  }

  return 0.0
}
