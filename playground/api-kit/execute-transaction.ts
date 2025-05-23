import { Hash } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'

// This file can be used to play around with the Safe Core SDK

interface Config {
  CHAIN_ID: bigint
  RPC_URL: string
  SIGNER_ADDRESS_PRIVATE_KEY: string
  SAFE_ADDRESS: string
  SAFE_TX_HASH: string
}

// Adjust the configuration with your own input parameters before running the script
const config: Config = {
  CHAIN_ID: 11155111n,
  RPC_URL: 'https://sepolia.gateway.tenderly.co',
  SIGNER_ADDRESS_PRIVATE_KEY: '<SIGNER_ADDRESS_PRIVATE_KEY>',
  SAFE_ADDRESS: '<SAFE_ADDRESS>',
  SAFE_TX_HASH: '<SAFE_TX_HASH>'
}

async function main() {
  // Create Safe instance
  const protocolKit = await Safe.init({
    provider: config.RPC_URL,
    signer: config.SIGNER_ADDRESS_PRIVATE_KEY,
    safeAddress: config.SAFE_ADDRESS
  })

  // Create Safe API Kit instance
  const apiKit = new SafeApiKit({
    chainId: config.CHAIN_ID
  })

  // Get the transaction
  const safeTransaction = await apiKit.getTransaction(config.SAFE_TX_HASH)
  const isTxExecutable = await protocolKit.isValidTransaction(safeTransaction)

  if (isTxExecutable) {
    // Execute the transaction
    const txResponse = await protocolKit.executeTransaction(safeTransaction)

    await waitForTransactionReceipt(protocolKit.getSafeProvider().getExternalProvider(), {
      hash: txResponse.hash as Hash
    })

    console.log('Transaction executed.')
    console.log('- Transaction hash:', txResponse.hash)
  } else {
    console.log('Transaction invalid. Transaction was not executed.')
  }
}

main()
