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
                <img src="/S.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Weapon Box</h5>
                    <p className="card-text">Gives a random weapon</p>
                    <a className="btn btn-primary" onClick={() => buyLootBox(0, "100.0")}>100 CYT</a>
                </div>
            </div>

            <div className="col-md-2 card" key="2">
                <img src="/SS.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Character Box</h5>
                    <p className="card-text">Gives a random character</p>
                    <a className="btn btn-primary" onClick={() => buyLootBox(1, "150.0")}>150 CYT</a>
                </div>
            </div>
        </div>
    )
}