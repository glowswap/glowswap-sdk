import { abi as POOL_ABI } from '@glowswap/v3-core/artifacts/contracts/GlowV3Pool.sol/GlowV3Pool.json'
import { Contract, Wallet } from 'ethers'
import { IGlowV3Pool } from '../../typechain-types'

export default function poolAtAddress(address: string, wallet: Wallet): IGlowV3Pool {
  return new Contract(address, POOL_ABI, wallet) as IGlowV3Pool
}
