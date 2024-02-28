import { account, buildtContracConfig, currPublicClient, currWalletClient, buildtToken } from './data/init_test_data';
import { zeroAddress } from 'viem';
import { GlowV3Factory, GlowV3Pool } from '../src'

describe('Pool', () => {
    const contractConfig = buildtContracConfig()
    const USDT = buildtToken("USDT")
    const USDC = buildtToken("USDC")
    const glowV3Factory = new GlowV3Factory(currPublicClient, contractConfig.GlowV3Factory)

    test('getPoolAddress', async () => {
        const poolAddress = await glowV3Factory.getPoolAddress(USDT.id, USDC.id, 100)

        console.log("poolAddress: ", poolAddress);
    })

    test('createPoolCallParameters', async () => {
        const fee = 2500
        const poolAddress = await glowV3Factory.getPoolAddress(USDT.id, USDC.id, fee)
        if (poolAddress !== zeroAddress) {
            throw Error(`the Pool has created , the pool address is ${poolAddress}`)
        }

        const res: any = GlowV3Factory.createPoolCallParameters(USDT, USDC, fee)
        console.log("args: ", res);

        const respone = await currWalletClient.writeContract({
            address: contractConfig.GlowV3Factory,
            ...res,
            account,
        })

        console.log("respone: ", respone);
    })

    test('getSlot0', async () => {
        const glowV3Pool = new GlowV3Pool(currPublicClient, "0x90B63dA86dD57Eb61e6E022a487a5172c354F945")
        const slot = await glowV3Pool.getSlot0()
        console.log("slot: ", slot);
    })

    test('buildPool', async () => {
        const glowV3Pool = new GlowV3Pool(currPublicClient, "0x90B63dA86dD57Eb61e6E022a487a5172c354F945")
        const pool = await glowV3Pool.buildPool()
        console.log("pool: ", pool);
    })
})
