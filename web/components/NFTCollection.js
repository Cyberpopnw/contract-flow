import react, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import FETCH_LOOTBOXES from "../cadence/scripts/get_account_lootboxes.cdc"
import FETCH_LOOTBOX from "../cadence/scripts/get_lootbox.cdc"
import UNPACK_LOOTBOX from "../cadence/transactions/unpack_lootbox.cdc"
import FETCH_ACCOUNT_ITEMS_SCRIPT from "../cadence/scripts/get_account_items.cdc"

const query = async (script, user) => {
    return await fcl.query({
        cadence: script,
        args: (arg, t) => [arg(user.addr, t.Address)]
    })
}

const getLootBox = async (user, id) => {
    const lootbox = await fcl.query({
        cadence: FETCH_LOOTBOX,
        args: (arg, t) => [arg(user.addr, t.Address), arg(id, t.UInt64)]
    })
    return lootbox
}

export function NFTCollection({ user }) {
    const [nfts, setNfts] = useState("")
    const [boxes, setBoxes] = useState([])
    const [transactionStatus, setTransactionStatus] = useState(0)

    const getItems = async (user) => {
        // const items = await fetchAccountItems(user.addr);
        const items = await fcl.query({
            cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
            args: (arg, t) => [arg(user.addr, t.Address)]
        })

        setNfts(items.join(", "));
    }

    useEffect(() => getItems(user), [user])

    const unpackLootbox = async (id) => {
        const transactionId = await fcl.mutate({
            cadence: UNPACK_LOOTBOX,
            args: (arg, t) => [arg(id, t.UInt64)],
            limit: 100
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)
    }

    useEffect(() => {
        const getLootboxes = async () => {
            let ids = await query(FETCH_LOOTBOXES, user)
            setBoxes([])
            ids.forEach(async (id) => {
                let lootbox = await getLootBox(user, id);
                lootbox.id = id
                setBoxes(old => [...old, lootbox])
            })
        }
        getLootboxes()
    }, [user])
    return (
        <>
            <div>NFTS: {nfts}</div>
            <div className="row">
                {boxes.map((box, i) => {
                    return (
                        <div className="col-md-1 card" key={i}>
                            <img src={"/" + box.class + ".jpg"} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{box.class} Box</h5>
                                <a className="btn btn-primary" onClick={() => unpackLootbox(box.id)}>Unpack</a>
                            </div>
                        </div>

                    )
                })}
            </div>
        </>
    )
}