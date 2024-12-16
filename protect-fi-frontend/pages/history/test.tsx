import { erc20Abi } from 'viem'
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import vaultABI from '../../src/abis-fe/VaultABI.json'

function ReadContract() {
    const { data: balance } = useReadContract({
        abi: erc20Abi,
        address: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
        functionName: 'balanceOf',
        args: ['0x88a1493366D48225fc3cEFbdae9eBb23E323Ade3'],
    })

    //   allowance 
    // cara mengubah rpc nya ke tenderly

    // Metamask juga harus ditimpa => langsung ke extension dari metamask

    // allowence => supa

    const {
        data: approvalHash,
        isPending: isPendingApproval,
        writeContract: writeApproval,
    } = useWriteContract()

    const handleApproval = async () => {
        await writeApproval({
            address: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
            abi: erc20Abi,
            functionName: 'approve',
            args: ['0xF62eEc897fa5ef36a957702AA4a45B58fE8Fe312', BigInt(1000)],
        })
    }

    const { isLoading: isApprovalLoading, status: statusApproval } = useWaitForTransactionReceipt({
        hash: approvalHash
    })

    const {
        data: depositHash,
        isPending: isDepositPending,
        isError: isDepositError,
        writeContract: writeDeposit,
    } = useWriteContract()



    const handleDeposit = async () => {
        try {
            await writeDeposit({
                address: '0xF62eEc897fa5ef36a957702AA4a45B58fE8Fe312',
                abi: vaultABI,
                functionName: 'deposit',
                args: [BigInt(1000)],
            }, {onError: (err) => console.log('Deposit Error:', err)});
            console.log('Deposit successful!');
        } catch (err) {
            console.error('Deposit Error:', err);
        }
    };
    

    const { isLoading: isDepositLoading, status: statusDeposit } = useWaitForTransactionReceipt({
        hash: depositHash
    })

    

    return (
        <div className='pt-32'>
            <button onClick={() => handleApproval()}>Approve</button>
            <div>Pending: {isPendingApproval ? 'Sedang Approve' : 'Tidak Sedang Approve'}</div>
            <div>Hash: {approvalHash}</div>

            {isApprovalLoading ? <div>status: {statusApproval}</div> : null}
            <div>status: {statusApproval}</div> 

            <button onClick={() => handleDeposit()}>Deposit</button>

            <div>error: {isDepositError ? 'Sedang eror' : 'Tidak Sedang Error'}</div>
            <div>Pending: {isDepositPending ? 'Sedang Deposit' : 'Tidak Sedang Deposit'}</div>
            <div>Hash: {depositHash}</div>

            <div className='pt-32 text-2xl'>Balance: {balance?.toString()}</div>
        </div>
    )
}

export default ReadContract