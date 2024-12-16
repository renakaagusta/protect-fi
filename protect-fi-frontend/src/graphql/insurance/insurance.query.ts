import { gql } from "graphql-request";

export const queryPoolCreateds = gql`query QueryPoolCreateds {
        insurancePoolCreateds(orderDirection: desc, orderBy: blockTimestamp) {
            benefit
            blockNumber
            blockTimestamp
            claimFee
            curl
            descriptionUri
            encryptedApplicationID
            encryptedApplicationSecret
            encryptedCurlSecretKey
            endOfPurchaseAt
            exampleResponseUri
            finishedAt
            id
            insurer
            maxPolicies
            poolAddress
            poolName
            regexExtraction
            regexValidation
            startedAt
            symbol
            transactionHash
    }
}`

export const queryPoolCreatedsByPool = gql`query QueryPoolCreateds($poolAddress: Bytes, $first: Int) {
        insurancePoolCreateds(where: {poolAddress: $poolAddress}, first: $first, orderDirection: desc, orderBy: blockTimestamp) {
            benefit
            blockNumber
            blockTimestamp
            claimFee
            curl
            descriptionUri
            encryptedApplicationID
            encryptedApplicationSecret
            encryptedCurlSecretKey
            endOfPurchaseAt
            exampleResponseUri
            finishedAt
            id
            insurer
            maxPolicies
            poolAddress
            poolName
            regexExtraction
            regexValidation
            startedAt
            symbol
            transactionHash
        }
    }`

export const queryPolicyPurchasedsByPool = gql`
    query QueryPolicyPurchaseds($pool: Bytes) {        
        policyPurchaseds(where: {pool: $pool}, orderDirection: desc, orderBy: blockTimestamp) {
            blockNumber
            blockTimestamp
            id
            insured
            pool
            shares
            transactionHash
        }
}`

export const queryDepositsByPool = gql`
    query QueryDeposits($pool: String) {
        deposits(where: {pool: $pool}, orderDirection: desc, orderBy: blockTimestamp) {
            amount
            blockNumber
            blockTimestamp
            from
            id
            pool
            transactionHash
        }
    }`


export const queryClaimSubmittedsByPool = gql`
    query QueryClaimSubmitteds($pool: Bytes) {
        claimSubmitteds(where: {pool: $pool}, orderDirection: desc, orderBy: blockTimestamp) {
            blockNumber
            blockTimestamp
            claimNum
            claim_amount
            claim_index
            claim_insured
            claim_isApproved
            claim_proofUri
            id
            pool
            transactionHash
        }
    }`


export const queryClaimApprovedsByPool = gql`
    query QueryClaimApproveds($pool: Bytes) {
        claimApproveds(where: {pool: $pool}, orderDirection: desc, orderBy: blockTimestamp) {
            blockNumber
            claim_index
            blockTimestamp
            claim_amount
            claim_isApproved
            claim_insured
            claim_proofUri
            id
            pool
            transactionHash
        }
    }`

export const queryClaimRejectedsByPool = gql`
    query QueryClaimRejecteds($pool: Bytes) {
        claimRejecteds(where: {pool: $pool}, orderDirection: desc, orderBy: blockTimestamp) {
            blockNumber
            claim_index
            blockTimestamp
            claim_amount
            claim_isApproved
            claim_insured
            claim_proofUri
            id
            pool
            transactionHash
        }
    }`