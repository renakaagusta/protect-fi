import { HexAddress } from "../general/address";

export default interface ClaimSubmitted {
    id: string,
    pool: HexAddress;
    claimNum: string;
    claim_amount: string;
    claim_index: string;
    claim_proofUri: string;
    claim_insured: HexAddress;
    claim_isApproved: boolean;
    blockNumber: number;
    blockTimestamp: number;
    transactionHash: number;
  }
  
  export type ClaimSubmitteds = {
    claimSubmitteds: ClaimSubmitted[];
  };
  