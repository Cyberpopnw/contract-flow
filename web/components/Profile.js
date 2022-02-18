import react, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import SETUP_ACCOUNT from "../cadence/transactions/setup_account.cdc"
import FETCH_CYT_BALANCE from "../cadence/scripts/get_account_cyt.cdc"
import IS_ACCOUNT_INITIALIZED from "../cadence/scripts/is_account_initialized.cdc"

export function Profile({ user }) {
    const [cyt, setCYT] = useState(0)
    const [initialized, setInitialized] = useState(false)
    const getCYTBalance = async () => {
        const balance = await fcl.query({
            cadence: FETCH_CYT_BALANCE,
            args: (arg, t) => [arg(user.addr, t.Address)]
        })
        setCYT(balance)
    }

    useEffect(() => {
        async function update() {
            const data = await fcl.query({
                cadence: FETCH_CYT_BALANCE,
                args: (arg, t) => [arg(user.addr, t.Address)]
            })
            setInitialized(data.CYT && data.NFT && data.LootBox)
        }
        update()
    })

    useEffect(() => {
        user.loggedIn && getCYTBalance()
        return () => setCYT(0)
    }, [user]);

    const tx = async (cadence) => {
        const transactionId = await fcl.mutate({
            cadence: cadence,
            limit: 100
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)
    }

    const setupAccount = async () => await tx(SETUP_ACCOUNT)


    return (
        <>
            <div>CYT: {cyt}</div>
            <div>Address: {user?.addr ?? "No Address"}</div>
            <div>
                {!initialized &&
                    <button onClick={setupAccount}>Init Account</button>
                }
                <button onClick={fcl.unauthenticate}>Log Out</button>
            </div>
        </>
    )
}