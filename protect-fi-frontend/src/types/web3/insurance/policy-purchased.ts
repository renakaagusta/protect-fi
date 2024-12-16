import { HexAddress } from "../general/address";

export default interface PolicyPurchased {
    id: string,
    pool: HexAddress;
    insured: HexAddress;
    shares: string;
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: number;
  }
  
  export type PolicyPurchaseds = {
    policyPurchaseds: PolicyPurchased[];
  };
  