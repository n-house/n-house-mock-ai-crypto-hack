import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import Web3 from "web3"
import contract from "./abis/NhouseNFT.json"
const API_URL = process.env.API_URL || "https://evm.astar.network"
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xBE0505c227A3f786319f820510F9C09BB79EAb74"

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
    const formattedUris = tokenUris.map((tokenUri: any) => {
      return {
        tokenId: tokenUri[0],
        tokenUri: JSON.parse(tokenUri[1]),
      }
    })
    console.log(formattedUris)
    context.res = {
      status: 200,
      body: formattedUris,
    }
  })
}

export default httpTrigger
