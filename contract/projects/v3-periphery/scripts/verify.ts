import { verifyContract } from '@glowswap/common/verify'
import { sleep } from '@glowswap/common/sleep'
import { configs } from '@glowswap/common/config'

async function main() {
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]

  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }
  const deployedContracts_v3_core = await import(`@glowswap/v3-core/deployments/${networkName}.json`)
  const deployedContracts_v3_periphery = await import(`@glowswap/v3-periphery/deployments/${networkName}.json`)

  // Verify swapRouter
  console.log(
    `Verify swapRouter:${deployedContracts_v3_periphery.SwapRouter} with glowV3PoolDeployer:${deployedContracts_v3_core.GlowV3PoolDeployer}, glowV3Factory:${deployedContracts_v3_core.GlowV3Factory} and wNative:${config.WNATIVE}`
  )
  await verifyContract(deployedContracts_v3_periphery.SwapRouter, [
    deployedContracts_v3_core.GlowV3PoolDeployer,
    deployedContracts_v3_core.GlowV3Factory,
    config.WNATIVE,
  ])
  await sleep(10000)

  // Verify nonfungibleTokenPositionDescriptor
  console.log('Verify nonfungibleTokenPositionDescriptor')
  await verifyContract(deployedContracts_v3_periphery.NonfungibleTokenPositionDescriptor)
  await sleep(10000)

  // Verify NonfungiblePositionManager
  console.log('Verify NonfungiblePositionManager')
  await verifyContract(deployedContracts_v3_periphery.NonfungiblePositionManager, [
    deployedContracts_v3_core.GlowV3PoolDeployer,
    deployedContracts_v3_core.GlowV3Factory,
    config.WNATIVE,
    deployedContracts_v3_periphery.NonfungibleTokenPositionDescriptor,
  ])
  await sleep(10000)

  // Verify glowInterfaceMulticall
  console.log('Verify glowInterfaceMulticall')
  await verifyContract(deployedContracts_v3_periphery.GlowInterfaceMulticall)
  await sleep(10000)

  // Verify v3Migrator
  console.log('Verify v3Migrator')
  await verifyContract(deployedContracts_v3_periphery.V3Migrator, [
    deployedContracts_v3_core.GlowV3PoolDeployer,
    deployedContracts_v3_core.GlowV3Factory,
    config.WNATIVE,
    deployedContracts_v3_periphery.NonfungiblePositionManager,
  ])
  await sleep(10000)

  // Verify tickLens
  console.log('Verify tickLens')
  await verifyContract(deployedContracts_v3_periphery.TickLens)
  await sleep(10000)

  // Verify Quoter
  console.log('Verify Quoter')
  await verifyContract(deployedContracts_v3_periphery.Quoter, [
    deployedContracts_v3_core.GlowV3PoolDeployer,
    deployedContracts_v3_core.GlowV3Factory,
    config.WNATIVE,
  ])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
