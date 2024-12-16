import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { InsurancePoolCreated } from "../generated/InsuranceFactory/InsuranceFactory"

export function createInsurancePoolCreatedEvent(
  insurer: Address,
  poolAddress: Address,
  poolName: string,
  symbol: string,
  descriptionUri: string,
  exampleResponseUri: string,
  curl: string,
  encryptedCurlSecretKey: string,
  encryptedApplicationID: string,
  encryptedApplicationSecret: string,
  regexExtraction: string,
  regexValidation: string,
  claimFee: BigInt,
  benefit: BigInt,
  startedAt: BigInt,
  finishedAt: BigInt,
  endOfPurchaseAt: BigInt,
  maxPolicies: BigInt
): InsurancePoolCreated {
  let insurancePoolCreatedEvent = changetype<InsurancePoolCreated>(
    newMockEvent()
  )

  insurancePoolCreatedEvent.parameters = new Array()

  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam("insurer", ethereum.Value.fromAddress(insurer))
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "poolAddress",
      ethereum.Value.fromAddress(poolAddress)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolName", ethereum.Value.fromString(poolName))
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "descriptionUri",
      ethereum.Value.fromString(descriptionUri)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "exampleResponseUri",
      ethereum.Value.fromString(exampleResponseUri)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam("curl", ethereum.Value.fromString(curl))
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "encryptedCurlSecretKey",
      ethereum.Value.fromString(encryptedCurlSecretKey)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "encryptedApplicationID",
      ethereum.Value.fromString(encryptedApplicationID)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "encryptedApplicationSecret",
      ethereum.Value.fromString(encryptedApplicationSecret)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "regexExtraction",
      ethereum.Value.fromString(regexExtraction)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "regexValidation",
      ethereum.Value.fromString(regexValidation)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "claimFee",
      ethereum.Value.fromUnsignedBigInt(claimFee)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "benefit",
      ethereum.Value.fromUnsignedBigInt(benefit)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "finishedAt",
      ethereum.Value.fromUnsignedBigInt(finishedAt)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endOfPurchaseAt",
      ethereum.Value.fromUnsignedBigInt(endOfPurchaseAt)
    )
  )
  insurancePoolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxPolicies",
      ethereum.Value.fromUnsignedBigInt(maxPolicies)
    )
  )

  return insurancePoolCreatedEvent
}
