import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import abi from "./abis/NhouseMembership.json"
const API_URL = process.env.API_URL || "https://evm.astar.network"
const PUBLIC_KEY = process.env.PUBLIC_KEY || "0x872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const CONTRACT_ADDRESS = process.env.MEMBERSHIP_ADDRESS || "0x7B4a600b78fC6534B4125145cd38e45d366ebD28"
import { ethers } from "ethers"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { address } = req.body

  const tokenUri = JSON.stringify({
    name: "Nhouse Membership NFT",
    description: "An NFT from Nhouse",
    image: "https://art.pixilart.com/82d984fcd46cafb.gif",
    propertyName: "Nhouse Blue",
  })
  const provider = new ethers.providers.JsonRpcProvider(API_URL)
  const signer = new ethers.Wallet(PRIVATE_KEY, provider)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, (abi as any).abi, signer)
  const nonce = await provider.getTransactionCount(PUBLIC_KEY)
  try {
    const tx = await contract.mintNFT(address, tokenUri, { nonce: nonce })
    context.log(tx)
    await tx.wait()
    context.res = {
      status: 200,
      body: tx,
    }
  } catch (error) {
    context.log(error)
    context.res = {
      status: 500,
      body: error,
    }
  }
}

export default httpTrigger
