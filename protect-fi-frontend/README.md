# Protect.fi

## Decentralized Insurance Powered by zkTLS & AVS

Protect.fi revolutionizes insurance through decentralized technology, powered by Ethena, Eigenlayer, and zkTLS.

## 📝 Documentation

Full Documentation: [https://protect-fi.gitbook.io/protectfi](https://protect-fi.gitbook.io/protectfi)

## 🌟 Core Features

### Insurance Functions

- **Pool Creation**: Deploy new insurance pools with customizable parameters
- **Policy Management**: Purchase and track insurance policies
- **Claims Processing**: Submit and process claims with automated verification
- **Premium Calculation**: Dynamic risk-based premium computation
- **Proof Generation**: zkTLS-based claim verification

### Technical Features

- Decentralized claim assessment using validator nodes
- Smart contract-based policy management
- zkTLS integration for secure data verification
- AVS (Automated Verification System) for claims
- IPFS storage for policy documents

## 🚀 Tech Stack

- Solidity for smart contracts
- TypeScript
- Next.js frontend
- Ethena Oracle integration
- Eigenlayer for scalability
- zkTLS for privacy
- IPFS for storage

## 🛠️ Prerequisites

- Node.js v18+
- Yarn or npm
- Ethereum wallet (MetaMask)
- Access to Ethena testnet

## 💻 Installation

1. Clone the repository:

```bash
git clone https://github.com/protect-fi/protect-core.git
cd protect-core
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start development:

```bash
yarn dev
# or
npm run dev
```

## 🔗 Smart Contract Integration

### Reading Contract Data

```typescript
import { useReadContract } from "wagmi";
```

### Writing to Contract

```typescript
import { useWriteContract } from "wagmi";
```

## 📊 Subgraph Integration

### Query Example

```graphql
{
  operators {
    id
    address
    lastActiveTimestamp
    tasksResponded(orderBy: respondedAt, orderDirection: desc) {
      receiver
      requestOfframpId
      respondedAt
      status
      taskCreatedBlock
      taskIndex
      transactionHash
      transactionId
      createdAt
      channelId
    }
  }
}
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
