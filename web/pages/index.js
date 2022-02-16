import Head from 'next/head'
import "../flow/config";
import "bootstrap/dist/css/bootstrap.css";
import { Link, Route } from "wouter";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { fetchAccountItems } from "../flow/script.get-account-items"
import FETCH_ACCOUNT_ITEMS_SCRIPT from "../cadence/scripts/get_account_items.cdc"
import FETCH_LOOTBOXES from "../cadence/scripts/get_account_lootboxes.cdc"
import FETCH_CYT_BALANCE from "../cadence/scripts/get_account_cyt.cdc"
import FETCH_LOOTBOX from "../cadence/scripts/get_lootbox.cdc"
import MINT_NFT from "../cadence/transactions/mint_nft.cdc"
import MINT_CYT from "../cadence/transactions/mint_cyt.cdc"
import BUY_LOOTBOX from "../cadence/transactions/buy_lootbox.cdc"
import UNPACK_LOOTBOX from "../cadence/transactions/unpack_lootbox.cdc"
import SETUP_ACCOUNT from "../cadence/transactions/setup_account.cdc"

import { LootBoxVendor } from '../components/LootBoxVendor';
import { NFTCollection } from '../components/NFTCollection';

export default function Home() {

  const [user, setUser] = useState({ loggedIn: null })
  const [name, setName] = useState('')
  const [checked, setChecked] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [nfts, setNfts] = useState("")
  const [cyt, setCYT] = useState(0)
  const [lootboxes, setLootboxes] = useState("")

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const getItems = async () => {
    // const items = await fetchAccountItems(user.addr);
    const items = await fcl.query({
      cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setNfts(items.join(", "));
  }

  const getCYTBalance = async () => {
    const balance = await fcl.query({
      cadence: FETCH_CYT_BALANCE,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })
    setCYT(balance)
  }

  useEffect(() => user.loggedIn && getCYTBalance(), [user, transactionStatus]);

  const getLootBox = async (id) => {
    const lootbox = await fcl.query({
      cadence: FETCH_LOOTBOX,
      args: (arg, t) => [arg(user.addr, t.Address), arg(id, t.UInt64)]
    })
    setName(lootbox.class);
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

  const query = async (script) => {
    return await fcl.query({
      cadence: script,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })
  }

  const getLootboxes = async () => {
    let ids = await query(FETCH_LOOTBOXES)
    setLootboxes(ids.join(", "))
  }

  const mintNFT = async () => {
    const transactionId = await fcl.mutate({
      cadence: MINT_NFT,
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const tx = async (cadence) => {
    const transactionId = await fcl.mutate({
      cadence: cadence,
      limit: 100
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const setupAccount = () => tx(SETUP_ACCOUNT)
  const buyLootbox = async () => {
    const transactionId = await fcl.mutate({
      cadence: BUY_LOOTBOX,
      args: (arg, t) => [arg(0, t.UInt32), arg("100.0", t.UFix64)],
      limit: 100
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const unpackLootbox = async (id) => {
    const transactionId = await fcl.mutate({
      cadence: UNPACK_LOOTBOX,
      args: (arg, t) => [arg(id, t.UInt64)],
      limit: 100
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }



  const mintCYT = () => tx(MINT_CYT)
  const AuthedState = () => {
    return (
      <div>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/buy">Buy</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/nft">NFT</Link>
          </li>
        </ul>

        <hr />
        <Route path="/">
          <div>
            <button onClick={setupAccount}>Init Account</button>
            <button onClick={fcl.unauthenticate}>Log Out</button>
          </div>
          <div>Items: {nfts}</div>
          <div>CYT: {cyt}</div>
          <div>LootBoxes: {lootboxes}</div>
          <div>LootBox: {name}</div>
          <div>Address: {user?.addr ?? "No Address"}</div>
          <div>Initialized: {checked ? "initialized" : "uninitialized"}</div>
          <div>Transaction Status: {transactionStatus ?? "--"}</div> {/* NEW */}
        </Route>
        <Route path="/buy">
          <LootBoxVendor />
        </Route>
        <Route path="/nft">
          <NFTCollection user={user} />
        </Route>
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