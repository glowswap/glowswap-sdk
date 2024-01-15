/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import { ethers, network } from "hardhat";
import { sleep } from "@glowswap/common/sleep";

async function main() {
  const networkName = network.name;
  const MasterChefV3 = await ethers.getContractFactory("MasterChefV3");
  const masterChefV3Contracts = await import(`@glowswap/masterchef-v3/deployments/${networkName}.json`);
  const masterChefV3 = MasterChefV3.attach(masterChefV3Contracts.MasterChefV3);
  const ONLY_FETCH = false;

  const rewarders = [
    {
      poolAddress: "0x66d17b90b1b16eb54b4ce3924076a5555adf0ecc", // USDT-USDC
      rewardToken: "0x17459858c5bAD5e97E48Eb831fa8B1096964b0d7", // USDC
      duration: 86400 * 3,
      rewardPerSecond: "10000000000000000",
    },
    {
      poolAddress: "0x66d17b90b1b16eb54b4ce3924076a5555adf0ecc", // USDT-USDC
      rewardToken: "0x6B7aB2622BfE00d62b4C787C2b3D29b021219b88", // BTC
      duration: 86400 * 3,
      rewardPerSecond: "2000000000000000000000000",
    },
    {
      poolAddress: "0x6fe696c8f8332f0e918e74e2891c7cc94a1f48ac", // BTC-USDC
      rewardToken: "0x6B7aB2622BfE00d62b4C787C2b3D29b021219b88", // BTC
      duration: 86400 * 3,
      rewardPerSecond: "0",
    },
    {
      poolAddress: "0x6fe696c8f8332f0e918e74e2891c7cc94a1f48ac", // BTC-USDC
      rewardToken: "0x720114819c30558f8c5807aB76A5030febB6cAaE", // USDT
      duration: 86400 * 3,
      rewardPerSecond: "10000000000000000",
    },
  ];

  let rewarderMap = new Map();
  for (const rewarder of rewarders) {
    const rewarderLength = await masterChefV3.getRewarderLength(rewarder.poolAddress);
    if (rewarderLength.eq(0)) {
      continue;
    }
    if (!rewarderMap.has(rewarder.poolAddress)) {
      rewarderMap.set(rewarder.poolAddress, new Map());
    }
    for (let i = 0; i < rewarderLength.toNumber(); i++) {
      const rewarderInfo = await masterChefV3.getRewarderInfo(rewarder.poolAddress, i);
      rewarderMap.get(rewarder.poolAddress).set(rewarderInfo.rewardToken, rewarderInfo);
    }
  }

  for (let entrie of rewarderMap.entries()) {
    console.log(`${entrie[0]} rewarders`);
    console.log("------------------------------------------------------------------");
    for (let rewarderInfo of entrie[1].values()) {
      console.log(
        `rewardToken: ${rewarderInfo.rewardToken} rewardPerSecond: ${rewarderInfo.rewardPerSecond} endTime: ${rewarderInfo.endTime}`
      );
    }
    console.log("\n");
  }

  if (ONLY_FETCH) {
    return;
  }
  for (const rewarder of rewarders) {
    // addPool
    if (!rewarderMap.has(rewarder.poolAddress)) {
      console.log("add pool: ", rewarder);
      const tx = await masterChefV3.addPool(
        rewarder.poolAddress,
        rewarder.rewardToken,
        rewarder.rewardPerSecond,
        rewarder.duration,
        {
          gasLimit: 3000000,
        }
      );
      const resp = await tx.wait();
      await sleep(3000);
      console.log(rewarder);
      console.log(`add pool tx: ${resp.transactionHash} status: ${resp.status}`);
      continue;
    }

    const pid = await masterChefV3.v3PoolAddressPid(rewarder.poolAddress);
    // addRewarder
    const poolRewarderMap = rewarderMap.get(rewarder.poolAddress);
    if (!poolRewarderMap.has(rewarder.rewardToken)) {
      console.log("add rewarder: ", rewarder);
      const tx = await masterChefV3.addRewarder(
        pid,
        rewarder.rewardToken,
        rewarder.rewardPerSecond,
        rewarder.duration,
        {
          gasLimit: 3000000,
        }
      );
      const resp = await tx.wait();
      await sleep(3000);
      console.log(rewarder);
      console.log(`add rewarder tx: ${resp.transactionHash} status: ${resp.status}`);
      continue;
    }

    // updateRewarder
    console.log("update rewarder: ", rewarder);
    const tx = await masterChefV3.updateRewarder(
      pid,
      rewarder.rewardToken,
      rewarder.rewardPerSecond,
      rewarder.duration,
      {
        gasLimit: 3000000,
      }
    );
    const resp = await tx.wait();
    await sleep(3000);
    console.log(rewarder);
    console.log(`update rewarder tx: ${resp.transactionHash} status: ${resp.status}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
