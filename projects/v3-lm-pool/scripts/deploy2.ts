import { ethers, network } from "hardhat";
import { configs } from "@glowswap/common/config";
import fs from "fs";
import { sleep } from "@glowswap/common/sleep";

async function main() {
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name;
  const config = configs[networkName as keyof typeof configs];
  if (!config) {
    throw new Error(`No config found for network ${networkName}`);
  }

  const MCV3DeployedContracts = await import(
    `@glowswap/masterchef-v3/deployments/Viction.json`
  );

  const GlowV3LmPoolDeployer = await ethers.getContractFactory(
    "GlowV3LmPoolDeployer"
  );
  console.log(MCV3DeployedContracts.MasterChefV3);
  const glowV3LmPoolDeployer = await GlowV3LmPoolDeployer.deploy(
    MCV3DeployedContracts.MasterChefV3
  );
  console.log(
    "glowV3LmPoolDeployer deployed to:",
    glowV3LmPoolDeployer.address
  );
  await sleep(5000);

  const contracts = {
    GlowV3LmPoolDeployer: glowV3LmPoolDeployer.address,
  };
  fs.writeFileSync(
    `./deployments/${networkName}.json`,
    JSON.stringify(contracts, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
