import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import Web3 from "web3"
import contract from "./abis/NhouseMembership.json"

const API_URL = process.env.API_URL || "https://evm.astar.network"
const CONTRACT_ADDRESS = process.env.MEMBERSHIP_ADDRESS || "0x7B4a600b78fC6534B4125145cd38e45d366ebD28"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const address = req.body.address
  const web3 = new Web3(API_URL)
  const nftContract = new web3.eth.Contract((contract as any).abi, CONTRACT_ADDRESS)
  await nftContract.methods.getTokenUriFromAddress(address).call((err: any, tokenUris: any) => {
    if (err) {
      console.log("An error occured", err)
      context.res = {
        status: 500,
      }
      return
    }
    console.log(tokenUris)
    if (tokenUris.length != 0) {
      context.res = {
        status: 200,
        body: tokenUris,
      }
      return
    } else {
      context.res = {
        status: 200,
      }
      return
    }
  })
}

export default httpTrigger
