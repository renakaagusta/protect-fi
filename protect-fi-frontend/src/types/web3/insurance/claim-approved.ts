import { HexAddress } from "../general/address";

export default interface ClaimApproved {
  blockNumber: string
  blockTimestamp: string
  claim_amount: string
  claim_index: string
  claim_insured: HexAddress
  claim_isApproved: boolean
  claim_proofUri: string
  pool: HexAddress
  id: string
}

export type ClaimApproveds = {
  claimApproveds: ClaimApproved[];
};
