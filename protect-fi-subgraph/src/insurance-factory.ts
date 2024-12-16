import { InsurancePoolCreated as InsurancePoolCreatedEvent } from "../generated/InsuranceFactory/InsuranceFactory"
import { InsurancePoolCreated } from "../generated/schema"
import { InsurancePool } from "../generated/templates"

export function handleInsurancePoolCreated(
  event: InsurancePoolCreatedEvent
): void {
  let entity = new InsurancePoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.insurer = event.params.insurer
  entity.poolAddress = event.params.poolAddress
  entity.poolName = event.params.poolName
  entity.symbol = event.params.symbol
  entity.descriptionUri = event.params.descriptionUri
  entity.exampleResponseUri = event.params.exampleResponseUri
  entity.curl = event.params.curl
  entity.encryptedCurlSecretKey = event.params.encryptedCurlSecretKey
  entity.encryptedApplicationID = event.params.encryptedApplicationID
  entity.encryptedApplicationSecret = event.params.encryptedApplicationSecret
  entity.regexExtraction = event.params.regexExtraction
  entity.regexValidation = event.params.regexValidation
  entity.claimFee = event.params.claimFee
  entity.benefit = event.params.benefit
  entity.startedAt = event.params.startedAt
  entity.finishedAt = event.params.finishedAt
  entity.endOfPurchaseAt = event.params.endOfPurchaseAt
  entity.maxPolicies = event.params.maxPolicies

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  InsurancePool.create(event.params.poolAddress)
}
