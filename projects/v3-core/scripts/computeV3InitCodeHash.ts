import { ethers } from 'hardhat'
import GlowV3PoolArtifact from '../artifacts/contracts/GlowV3Pool.sol/GlowV3Pool.json'

const hash = ethers.utils.keccak256(GlowV3PoolArtifact.bytecode)
console.log(hash)
