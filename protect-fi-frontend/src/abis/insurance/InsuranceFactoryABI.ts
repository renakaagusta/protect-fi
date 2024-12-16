const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_usde",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_stakedUSDe",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_serviceManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_storageFee",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_withdrawFee",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allInsurancePools",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createInsurancePool",
    "inputs": [
      {
        "name": "_name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_symbol",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_descriptionUri",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_exampleResponseUri",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_curl",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_encryptedCurlSecretKey",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_encryptedApplicationID",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_encryptedApplicationSecret",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_regexExtraction",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_regexValidation",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_claimFee",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_benefit",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_startedAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_finishedAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_endOfPurchaseAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_maxPolicies",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "poolAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAllInsurancePools",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolsByInsurer",
    "inputs": [
      {
        "name": "_insurer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "insurerToPools",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registeredPools",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "serviceManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "stakedUSDe",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "storageFee",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateStorageFee",
    "inputs": [
      {
        "name": "_storageFee",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateWithdrawFee",
    "inputs": [
      {
        "name": "_withdrawFee",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "usde",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawFee",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "InsurancePoolCreated",
    "inputs": [
      {
        "name": "insurer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "poolAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "poolName",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "symbol",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "descriptionUri",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "exampleResponseUri",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "curl",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "encryptedCurlSecretKey",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "encryptedApplicationID",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "encryptedApplicationSecret",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "regexExtraction",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "regexValidation",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "claimFee",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "benefit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "startedAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "finishedAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "endOfPurchaseAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "maxPolicies",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];

export default abi;