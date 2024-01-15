import { verifyContract } from "@glowswap/common/verify";
import { sleep } from "@glowswap/common/sleep";
import { configs } from "@glowswap/common/config";
import { network } from "hardhat";

async function main() {
  const networkName = network.name;
  const config = configs[networkName as keyof typeof configs];

  if (!config) {
    throw new Error(`No config found for network ${networkName}`);
  }
  const deployedContractsMasterchefV3 = await import(
    `@glowswap/masterchef-v3/deployments/${networkName}.json`
  );
  const deployedContractsV3LmPool = await import(
    `@glowswap/v3-lm-pool/deployments/${networkName}.json`
  );

  // Verify glowV3LmPoolDeployer
  console.log("Verify GlowV3LmPoolDeployer");
  await verifyContract(deployedContractsV3LmPool.GlowV3LmPoolDeployer, [
    deployedContractsMasterchefV3.MasterChefV3,
  ]);
  await sleep(10000);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
