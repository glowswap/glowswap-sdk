import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeGlowV3Pool } from '../../typechain-types/contracts/test/MockTimeGlowV3Pool'
import { TestERC20 } from '../../typechain-types/contracts/test/TestERC20'
import { GlowV3Factory } from '../../typechain-types/contracts/GlowV3Factory'
import { GlowV3PoolDeployer } from '../../typechain-types/contracts/GlowV3PoolDeployer'
import { TestGlowV3Callee } from '../../typechain-types/contracts/test/TestGlowV3Callee'
import { TestGlowV3Router } from '../../typechain-types/contracts/test/TestGlowV3Router'
import { MockTimeGlowV3PoolDeployer } from '../../typechain-types/contracts/test/MockTimeGlowV3PoolDeployer'
import GlowV3LmPoolArtifact from '@glowswap/v3-lm-pool/artifacts/contracts/GlowV3LmPool.sol/GlowV3LmPool.json'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: GlowV3Factory
}

interface DeployerFixture {
  deployer: GlowV3PoolDeployer
}

async function factoryFixture(): Promise<FactoryFixture> {
  const { deployer } = await deployerFixture()
  const factoryFactory = await ethers.getContractFactory('GlowV3Factory')
  const factory = (await factoryFactory.deploy(deployer.address)) as GlowV3Factory
  return { factory }
}
async function deployerFixture(): Promise<DeployerFixture> {
  const deployerFactory = await ethers.getContractFactory('GlowV3PoolDeployer')
  const deployer = (await deployerFactory.deploy()) as GlowV3PoolDeployer
  return { deployer }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestGlowV3Callee
  swapTargetRouter: TestGlowV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeGlowV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeGlowV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeGlowV3PoolDeployer')
  const MockTimeGlowV3PoolFactory = await ethers.getContractFactory('MockTimeGlowV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestGlowV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestGlowV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestGlowV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestGlowV3Router

  const GlowV3LmPoolFactory = await ethers.getContractFactoryFromArtifact(GlowV3LmPoolArtifact)

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer =
        (await MockTimeGlowV3PoolDeployerFactory.deploy()) as MockTimeGlowV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string

      const mockTimeGlowV3Pool = MockTimeGlowV3PoolFactory.attach(poolAddress) as MockTimeGlowV3Pool

      await (
        await factory.setLmPool(
          poolAddress,
          (
            await GlowV3LmPoolFactory.deploy(
              poolAddress,
              ethers.constants.AddressZero,
              Math.floor(Date.now() / 1000)
            )
          ).address
        )
      ).wait()

      return mockTimeGlowV3Pool
    },
  }
}
