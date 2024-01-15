import { ethers, network } from "hardhat";
import { configs } from "@glowswap/common/config";
import fs from "fs";
import { abi as masterChefABI } from "@glowswap/masterchef-v3/artifacts/contracts/MasterChefV3.sol/MasterChefV3.json";
import { abi as v3FactoryABI } from "@glowswap/v3-core/artifacts/contracts/GlowV3Factory.sol/GlowV3Factory.json";
import { sleep } from "@glowswap/common/sleep";

async function main() {
  const [owner] = await ethers.getSigners();
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name;
  const config = configs[networkName as keyof typeof configs];
  if (!config) {
    throw new Error(`No config found for network ${networkName}`);
  }

  const v3DeployedContracts = await import(
    `@glowswap/v3-core/deployments/${networkName}.json`
  );
  const MCV3DeployedContracts = await import(
    `@glowswap/masterchef-v3/deployments/${networkName}.json`
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

  const glowV3Factory_address = v3DeployedContracts.GlowV3Factory;
  const glowV3Factory = new ethers.Contract(
    glowV3Factory_address,
    v3FactoryABI,
    owner
  );
  await glowV3Factory.setLmPoolDeployer(glowV3LmPoolDeployer.address);
  console.log(
    "glowV3Factory setLmPoolDeployer to:",
    glowV3LmPoolDeployer.address
  );
  await sleep(5000);

  const masterchefv3 = new ethers.Contract(
    MCV3DeployedContracts.MasterChefV3,
    masterChefABI,
    owner
  );
  await masterchefv3.setLMPoolDeployer(glowV3LmPoolDeployer.address);
  console.log(
    "masterchefv3 setLMPoolDeployer to:",
    glowV3LmPoolDeployer.address
  );

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
