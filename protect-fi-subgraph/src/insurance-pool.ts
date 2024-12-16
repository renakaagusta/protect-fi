import {
  Approval as ApprovalEvent,
  ClaimApproved as ClaimApprovedEvent,
  ClaimRejected as ClaimRejectedEvent,
  ClaimSubmitted as ClaimSubmittedEvent,
  Deposit as DepositEvent,
  PolicyPurchased as PolicyPurchasedEvent,
  Stake as StakeEvent,
  Transfer as TransferEvent,
  TransferInsurer as TransferInsurerEvent,
  Withdraw as WithdrawEvent,
  YieldUpdated as YieldUpdatedEvent
} from "../generated/templates/InsurancePool/InsurancePool"
import {
  Approval,
  ClaimApproved,
  ClaimRejected,
  ClaimSubmitted,
  Deposit,
  PolicyPurchased,
  Stake,
  Transfer,
  TransferInsurer,
  Withdraw,
  YieldUpdated
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleClaimApproved(event: ClaimApprovedEvent): void {
  let entity = new ClaimApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.claim_insured = event.params.claim.insured
  entity.claim_amount = event.params.claim.amount
  entity.claim_index = event.params.claim.index
  entity.claim_proofUri = event.params.claim.proofUri
  entity.claim_isApproved = event.params.claim.isApproved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleClaimRejected(event: ClaimRejectedEvent): void {
  let entity = new ClaimRejected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.claim_insured = event.params.claim.insured
  entity.claim_amount = event.params.claim.amount
  entity.claim_index = event.params.claim.index
  entity.claim_proofUri = event.params.claim.proofUri
  entity.claim_isApproved = event.params.claim.isApproved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleClaimSubmitted(event: ClaimSubmittedEvent): void {
  let entity = new ClaimSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.claimNum = event.params.claimNum
  entity.claim_insured = event.params.claim.insured
  entity.claim_amount = event.params.claim.amount
  entity.claim_index = event.params.claim.index
  entity.claim_proofUri = event.params.claim.proofUri
  entity.claim_isApproved = event.params.claim.isApproved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handlePolicyPurchased(event: PolicyPurchasedEvent): void {
  let entity = new PolicyPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.insured = event.params.insured
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleStake(event: StakeEvent): void {
  let entity = new Stake(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleTransferInsurer(event: TransferInsurerEvent): void {
  let entity = new TransferInsurer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldInsurer = event.params.oldInsurer
  entity.newInsurer = event.params.newInsurer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.withdrawAmount = event.params.withdrawAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}

export function handleYieldUpdated(event: YieldUpdatedEvent): void {
  let entity = new YieldUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.totalAssetInUSDe = event.params.totalAssetInUSDe
  entity.yieldAmount = event.params.yieldAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.pool = event.address;

  entity.save()
}
