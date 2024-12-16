import { HexAddress } from "../general/address";

export default interface PoolCreated {
    benefit: string
    blockNumber: string
    blockTimestamp: string
    claimFee: string
    curl: string
    descriptionUri: string
    encryptedApplicationID: string
    encryptedApplicationSecret: string
    encryptedCurlSecretKey: string
    endOfPurchaseAt: string
    exampleResponseUri: string
    finishedAt: string
    id: string
    insurer: HexAddress
    maxPolicies: string
    poolAddress: string
    poolName: string
    regexExtraction: string
    regexValidation: string
    startedAt: string
    symbol: string
    transactionHash: string
  }
  
  export type InsurancePoolCreateds = {
    insurancePoolCreateds: PoolCreated[];
  };
  