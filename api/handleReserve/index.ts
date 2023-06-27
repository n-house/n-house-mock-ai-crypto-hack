import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import abi from "./abis/NhouseNFT.json"
const API_URL = process.env.API_URL || "https://evm.astar.network"
const PUBLIC_KEY = process.env.PUBLIC_KEY || "0x872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xBE0505c227A3f786319f820510F9C09BB79EAb74"
import { ethers } from "ethers"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { address, tokenId } = req.body
  const provider = new ethers.providers.JsonRpcProvider(API_URL)
  const signer = new ethers.Wallet(PRIVATE_KEY, provider)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, (abi as any).abi, signer)
  const nonce = await provider.getTransactionCount(PUBLIC_KEY)
  const tx = await contract.transferFrom(PUBLIC_KEY, address, JSON.parse(tokenId), { nonce: nonce })
  console.log(tx)
  await tx.wait()
  context.res = {
    status: 200,
    body: tx,
  }
}

export default httpTrigger
