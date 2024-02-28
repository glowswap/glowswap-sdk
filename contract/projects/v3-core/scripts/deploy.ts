import { Contract, ContractFactory } from 'ethers'
import { ethers, network } from 'hardhat'
import fs from 'fs'
import { sleep } from '@glowswap/common/sleep'

type ContractJson = { abi: any; bytecode: string }
const artifacts: { [name: string]: ContractJson } = {
  GlowV3PoolDeployer: require('../artifacts/contracts/GlowV3PoolDeployer.sol/GlowV3PoolDeployer.json'),
  GlowV3Factory: require('../artifacts/contracts/GlowV3Factory.sol/GlowV3Factory.json'),
}

async function main() {
  const [owner] = await ethers.getSigners()
  const networkName = network.name
  // console.log(`Owner :${owner.address} Deploying to ${networkName} network`)

  let glowV3PoolDeployer_address = ''
  let glowV3PoolDeployer: Contract
  const GlowV3PoolDeployer = new ContractFactory(
    artifacts.GlowV3PoolDeployer.abi,
    artifacts.GlowV3PoolDeployer.bytecode,
    owner
  )
  console.log('Deploying GlowV3PoolDeployer...')
  if (!glowV3PoolDeployer_address) {
    glowV3PoolDeployer = await GlowV3PoolDeployer.deploy()

    glowV3PoolDeployer_address = glowV3PoolDeployer.address
    console.log('glowV3PoolDeployer deployed at:', glowV3PoolDeployer_address)
    await sleep(10000)
  } else {
    glowV3PoolDeployer = new ethers.Contract(glowV3PoolDeployer_address, artifacts.GlowV3PoolDeployer.abi, owner)
  }

  let glowV3Factory_address = ''
  let glowV3Factory: Contract
  if (!glowV3Factory_address) {
    const GlowV3Factory = new ContractFactory(artifacts.GlowV3Factory.abi, artifacts.GlowV3Factory.bytecode, owner)
    glowV3Factory = await GlowV3Factory.deploy(glowV3PoolDeployer_address)

    glowV3Factory_address = glowV3Factory.address
    console.log('glowV3Factory deployed at:', glowV3Factory_address)
    await sleep(10000)
  } else {
    glowV3Factory = new ethers.Contract(glowV3Factory_address, artifacts.GlowV3Factory.abi, owner)
  }

  // Set FactoryAddress for glowV3PoolDeployer.
  await glowV3PoolDeployer.setFactoryAddress(glowV3Factory_address)
  console.log('glowV3PoolDeployer.setFactoryAddress done')

  const contracts = {
    GlowV3Factory: glowV3Factory_address,
    GlowV3PoolDeployer: glowV3PoolDeployer_address,
  }

  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
