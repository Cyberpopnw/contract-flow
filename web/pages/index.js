import Head from 'next/head'
import "../flow/config";
import "bootstrap/dist/css/bootstrap.css";
import { Link, Route } from "wouter";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import MINT_CYT from "../cadence/transactions/mint_cyt.cdc"
import TRANSFER_CYT from "../cadence/transactions/transfer_cyt.cdc"

import { LootBoxVendor } from '../components/LootBoxVendor';
import { NFTCollection } from '../components/NFTCollection';
import { Profile } from '../components/Profile';

export default function Home() {

  const [user, setUser] = useState({ loggedIn: null })

  // var user = fcl.currentUser.snapshot()
  // fcl.currentUser.subscribe(console.log)
  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  const tx = async (cadence) => {
    const transactionId = await fcl.mutate({
      cadence: cadence,
      limit: 100
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const mintCYT = async () => await tx(MINT_CYT)
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
          <Profile user={user} />
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