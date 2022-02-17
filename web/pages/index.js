import Head from 'next/head'
import "../flow/config";
import "bootstrap/dist/css/bootstrap.css";
import { Link, Route } from "wouter";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import FETCH_CYT_BALANCE from "../cadence/scripts/get_account_cyt.cdc"
import MINT_NFT from "../cadence/transactions/mint_nft.cdc"
import MINT_CYT from "../cadence/transactions/mint_cyt.cdc"
import SETUP_ACCOUNT from "../cadence/transactions/setup_account.cdc"

import { LootBoxVendor } from '../components/LootBoxVendor';
import { NFTCollection } from '../components/NFTCollection';

export default function Home() {

  const [user, setUser] = useState({ loggedIn: null })
  const [cyt, setCYT] = useState(0)

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const getCYTBalance = async () => {
    const balance = await fcl.query({
      cadence: FETCH_CYT_BALANCE,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })
    setCYT(balance)
  }

  useEffect(() => user.loggedIn && getCYTBalance(), [user, transactionStatus]);

  const tx = async (cadence) => {
    const transactionId = await fcl.mutate({
      cadence: cadence,
      limit: 100
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const setupAccount = () => tx(SETUP_ACCOUNT)

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