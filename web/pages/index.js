import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { fetchAccountItems } from "../flow/script.get-account-items"
import FETCH_ACCOUNT_ITEMS_SCRIPT from "../cadence/scripts/get_account_items.cdc"


export default function Home() {

  const [user, setUser] = useState({ loggedIn: null })
  const [name, setName] = useState('')
  const [checked, setChecked] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [nfts, setNfts] = useState("")

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const getItems = async () => {
    // const items = await fetchAccountItems(user.addr);
    const items = await fcl.query({
      cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setNfts(items.join(", "));
  }

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setName(profile?.name ?? 'No Profile')
  }

  const checkQuery = async () => {
    const isChecked = await fcl.query({
      cadence: `
      import Profile from 0xProfile
      pub fun main(address: Address): Bool {
        return Profile.check(address)
      }
    `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })
    setChecked(isChecked);
  }

  // NEW
  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg, t) => [arg("Flow Developer!", t.String)],
      limit: 50
    })

    let res = await fcl.tx(transactionId).onceSealed()
    setTransactionStatus(res.status)
  }

  const AuthedState = () => {
    return (
      <div>
        <button onClick={getItems}>Get Items</button>
        <button onClick={sendQuery}>Send Query</button>
        <button onClick={checkQuery}>Check initialized</button>
        <button onClick={initAccount}>Init Account</button> {/* NEW */}
        <button onClick={executeTransaction}>Execute Transaction</button> {/* NEW */}
        <button onClick={fcl.unauthenticate}>Log Out</button>

        <hr />
        <div>Items: {nfts}</div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <div>Initialized: {checked ? "initialized" : "uninitialized"}</div>
        <div>Transaction Status: {transactionStatus ?? "--"}</div> {/* NEW */}
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Flow App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}