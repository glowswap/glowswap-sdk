import { Address } from "viem"

export type ContractConfig = {
    GlowV3Factory: Address,
    GlowV3PoolDeployer: Address,
    SwapRouter: Address,
    NonfungibleTokenPositionDescriptor: Address,
    NonfungiblePositionManager: Address,
    GlowInterfaceMulticall: Address,
    V3Migrator: Address,
    TickLens: Address
    Quoter: Address
    MasterChefV3: Address
}

export const bsquareHabitatTestnetConfig: ContractConfig = {
    GlowV3Factory: "0x832BAB2E1215020d7F5D477FF7A71c2cD638c27C",
    GlowV3PoolDeployer: "0x6125Bd1B49822EA3a052D2eDBD7ceb965f5C3eDD",
    SwapRouter: "0x6B7aB2622BfE00d62b4C787C2b3D29b021219b88",
    NonfungibleTokenPositionDescriptor: "0x7D33bfFdcB9ed2d0F047481FE21C57eE826b0566",
    NonfungiblePositionManager: "0x0C467640b1d4D990927109c5CA6e13a6c9B65Adb",
    GlowInterfaceMulticall: "0x6bD7044e0C69BfE28773133DCc1A2A6a3ca8e7A1",
    V3Migrator: "0x",
    TickLens: "0x",
    Quoter: "0x0dd48d2b400d8b6FeC506C0855263E553231a811",
    MasterChefV3: "0x71e5bDa7fE44827D69B10b18bbdf6a1ce8c61d90"
}
