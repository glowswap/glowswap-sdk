import { verifyContract } from '@glowswap/common/verify'
import { sleep } from '@glowswap/common/sleep'
import { network } from 'hardhat'

async function main() {
  const networkName = network.name
  const deployedContracts = await import(`@glowswap/v3-core/deployments/${networkName}.json`)

  // Verify GlowV3PoolDeployer
  console.log('Verify GlowV3PoolDeployer at: ', deployedContracts.GlowV3PoolDeployer)
  await verifyContract(deployedContracts.GlowV3PoolDeployer)
  await sleep(10000)

  // Verify pancakeV3Factory
  console.log('Verify GlowV3Factory at: ', deployedContracts.GlowV3Factory)
  await verifyContract(deployedContracts.GlowV3Factory, [deployedContracts.GlowV3PoolDeployer])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
