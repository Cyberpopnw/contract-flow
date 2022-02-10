import * as fcl from "@onflow/fcl"
import FETCH_ACCOUNT_ITEMS_SCRIPT from "../cadence/scripts/get_account_items.cdc"

export async function fetchAccountItems(address) {
    if (address == null) return null;

    // prettier-ignore
    return await fcl.query({
        cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
        args: (arg, t) => [
            arg(address, t.Address),
        ],
    })
}
