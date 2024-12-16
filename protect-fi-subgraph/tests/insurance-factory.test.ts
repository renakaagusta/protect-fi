import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { InsurancePoolCreated } from "../generated/schema"
import { InsurancePoolCreated as InsurancePoolCreatedEvent } from "../generated/InsuranceFactory/InsuranceFactory"
import { handleInsurancePoolCreated } from "../src/insurance-factory"
import { createInsurancePoolCreatedEvent } from "./insurance-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let insurer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let poolAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let poolName = "Example string value"
    let symbol = "Example string value"
    let descriptionUri = "Example string value"
    let exampleResponseUri = "Example string value"
    let curl = "Example string value"
    let encryptedCurlSecretKey = "Example string value"
    let encryptedApplicationID = "Example string value"
    let encryptedApplicationSecret = "Example string value"
    let regexExtraction = "Example string value"
    let regexValidation = "Example string value"
    let claimFee = BigInt.fromI32(234)
    let benefit = BigInt.fromI32(234)
    let startedAt = BigInt.fromI32(234)
    let finishedAt = BigInt.fromI32(234)
    let endOfPurchaseAt = BigInt.fromI32(234)
    let maxPolicies = BigInt.fromI32(234)
    let newInsurancePoolCreatedEvent = createInsurancePoolCreatedEvent(
      insurer,
      poolAddress,
      poolName,
      symbol,
      descriptionUri,
      exampleResponseUri,
      curl,
      encryptedCurlSecretKey,
      encryptedApplicationID,
      encryptedApplicationSecret,
      regexExtraction,
      regexValidation,
      claimFee,
      benefit,
      startedAt,
      finishedAt,
      endOfPurchaseAt,
      maxPolicies
    )
    handleInsurancePoolCreated(newInsurancePoolCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("InsurancePoolCreated created and stored", () => {
    assert.entityCount("InsurancePoolCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "insurer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolName",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "symbol",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "descriptionUri",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "exampleResponseUri",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "curl",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "encryptedCurlSecretKey",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "encryptedApplicationID",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "encryptedApplicationSecret",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "regexExtraction",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "regexValidation",
      "Example string value"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "claimFee",
      "234"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "benefit",
      "234"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "startedAt",
      "234"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "finishedAt",
      "234"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "endOfPurchaseAt",
      "234"
    )
    assert.fieldEquals(
      "InsurancePoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "maxPolicies",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
