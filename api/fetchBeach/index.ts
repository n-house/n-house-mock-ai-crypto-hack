import Web3 from "web3"
import contract from "./abis/NOnTheBeachNFT.json"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const API_URL = process.env.API_URL || "https://evm.astar.network"
const PUBLIC_KEY = process.env.PUBLIC_KEY || "0x872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"
const CONTRACT_ADDRESS = process.env.NONTHEBEACH_ADDRESS || "0x5B0CFea8D2b67ECb8320D3FED6DAB87D63b174C5"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const web3 = new Web3(API_URL)
  const nftContract = new web3.eth.Contract((contract as any).abi, CONTRACT_ADDRESS)
  await nftContract.methods.getTokenUriFromAddress(PUBLIC_KEY).call((err: any, tokenUris: any) => {
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
