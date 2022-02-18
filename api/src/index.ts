import express from 'express'
import './flow/config'
import * as fcl from '@onflow/fcl'
import * as t from "@onflow/types"
import * as fs from 'fs'
import * as path from 'path'

import { FlowService } from './services/flow'

const app = express()
const port = 3000

const flowService = new FlowService(
  "f8d6e0586b0a20c7",
  "f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5",
  0
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/:address/cyt', async (req, res) => {
  const script = fs.readFileSync(
    path.join(
      __dirname,
      `cadence/scripts/get_account_cyt.cdc`
    ),
    'utf8'
  )
  const balance = await flowService.executeScript<number>({
    script,
    args: [fcl.arg(req.params.address, t.Address)]
  })

  res.send({ balance: balance })
})

app.get('/:address/nfts', async (req, res) => {
  let script = fs.readFileSync(
    path.join(
      __dirname,
      `cadence/scripts/get_account_items.cdc`
    ),
    'utf8'
  )
  const ids = await flowService.executeScript<number[]>({
    script,
    args: [fcl.arg(req.params.address, t.Address)]
  })

  if (ids.length == 0) {
    res.send({ items: ids })
    return
  }

  script = fs.readFileSync(
    path.join(
      __dirname,
      `cadence/scripts/get_account_item.cdc`
    ),
    'utf8'
  )

  const items: any[] = []
  for (let i = 0; i < ids.length; i++) {
    const item = await flowService.executeScript<any>({
      script,
      args: [fcl.arg(req.params.address, t.Address), fcl.arg(ids[i], t.UInt64)]
    })
    items.push(item)
  }

  res.send({ items: items })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
