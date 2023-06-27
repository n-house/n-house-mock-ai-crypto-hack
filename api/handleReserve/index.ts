import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import Web3 from "web3"
import contract from "./abis/NhouseNFT.json"
const API_URL = process.env.API_URL || "https://evm.astar.network"
const PUBLIC_KEY = process.env.PUBLIC_KEY || "0x872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xBE0505c227A3f786319f820510F9C09BB79EAb74"

const handleTransfer = async (web3: any, address: string, tokenId: string, context: Context) => {
  const nftContract = new web3.eth.Contract((contract as any).abi, CONTRACT_ADDRESS)
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest")
  const data = await nftContract.methods.transferFrom(PUBLIC_KEY, address, JSON.parse(tokenId)).encodeABI()
  const tx = {
    gas: 500000,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    data: data,
    from: address,
  }
  const resp = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY, async (err: any, signedTx: any) => {
    if (err) {
      context.res = {
        status: 500,
        message: err,
      }
      return
    }
    console.log("SIGNING", signedTx)
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction as string, (err: any, resp: any) => {
      if (err) {
        context.res = {
          status: 500,
          message: err,
        }
        return
      }
      console.log("RESERVING", resp)
    })
  })
  return { status: 200, hash: resp.transactionHash }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { address, tokenId } = req.body
  const web3 = new Web3(API_URL)
  const resp = await handleTransfer(web3, address, tokenId, context)
  console.log(resp)

  if (resp.hash) {
    const interval = setInterval(async function () {
      console.log("Attempting to get transaction receipt...")
      web3.eth.getTransactionReceipt(resp.hash, async function (err, rec) {
        if (rec) {
          console.log(rec)
          clearInterval(interval)
          context.res = {
            status: 200,
            body: rec,
          }
        }
        if (err) {
          console.log(err)
          clearInterval(interval)
          context.res = {
            status: 200,
            body: rec,
          }
        }
      })
    }, 1000)
  }
}

export default httpTrigger
