import react, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import BUY_LOOTBOX from "../cadence/transactions/buy_lootbox.cdc"

export function LootBoxVendor() {
    let buyLootBox = async (optionId, amount) => {
        const transactionId = await fcl.mutate({
            cadence: BUY_LOOTBOX,
            args: (arg, t) => [arg(optionId, t.UInt32), arg(amount, t.UFix64)],
            limit: 100
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)
    }
    return (
        <div className="row">
            <div className="col-md-2 card" key="1">
                <img src="/normalbox.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Normal Box</h5>
                    <p className="card-text">Has a low chance of getting a Dragon</p>
                    <a className="btn btn-primary" onClick={() => buyLootBox(0, "100.0")}>Buy</a>
                </div>
            </div>

            <div className="col-md-2 card" key="2">
                <img src="/premiumbox.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Premium Box</h5>
                    <p className="card-text">Has a high chance of getting a Dragon</p>
                    <a className="btn btn-primary" onClick={() => buyLootBox(1, "120.0")}>Buy</a>
                </div>
            </div>
        </div>
    )
}