import { Abi, Address, createPublicClient, createWalletClient, defineChain, getContract, hexToBigInt, http, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { calculateGasMargin } from '../../src/utils/utils'
import { MethodParameters, Token } from '../../src/constants'
import { ContractConfig, bsquareHabitatTestnetConfig } from './contract_config'

export const tokens: Token[] = [
    {
        "name": "Bitcoin",
        "symbol": "BTC",
        "id": "0x74c0d1DaB4E34339c7704C80A00651AfAd1fBd8f",
        "chainId": 1103,
        "decimals": 18,
        "logoURI": "https://bsquared-token.netlify.app/images/glow-habitat-test/0x74c0d1DaB4E34339c7704C80A00651AfAd1fBd8f.png",
        "isNative": true,
        "type": "erc-20",
        "labels": [],
        "wrapId": "0x74c0d1DaB4E34339c7704C80A00651AfAd1fBd8f"
    },
    {
        "name": "Wrapped BTC",
        "symbol": "WBTC",
        "id": "0x74c0d1DaB4E34339c7704C80A00651AfAd1fBd8f",
        "wrapId": "0x0000000000000000000000000000000000000001",
        "chainId": 1103,
        "decimals": 18,
        "logoURI": "https://bsquared-token.netlify.app/images/glow-habitat-test/0x0000000000000000000000000000000000000001.png",
        "isNative": false,
        "type": "erc-20",
        "labels": []
    },
    {
        "name": "USD Coin",
        "symbol": "USDC",
        "id": "0x18CB9a524564CeA5e8faD4dCa9Ad5DDe6cF212e3",
        "chainId": 1103,
        "decimals": 6,
        "logoURI": "https://bsquared-token.netlify.app/images/glow-habitat-test/0x18CB9a524564CeA5e8faD4dCa9Ad5DDe6cF212e3.png",
        "type": "erc-20",
        "labels": [
            "Stablecoins"
        ],
        "isNative": false,
        "wrapId": "0x18CB9a524564CeA5e8faD4dCa9Ad5DDe6cF212e3"
    },
    {
        "name": "ETH",
        "symbol": "WETH",
        "id": "0x17459858c5bAD5e97E48Eb831fa8B1096964b0d7",
        "chainId": 1103,
        "decimals": 18,
        "logoURI": "https://bsquared-token.netlify.app/images/glow-habitat-test/0x17459858c5bAD5e97E48Eb831fa8B1096964b0d7.png",
        "type": "erc-20",
        "labels": [],
        "isNative": false,
        "wrapId": "0x17459858c5bAD5e97E48Eb831fa8B1096964b0d7"
    },
    {
        "name": "Tether",
        "symbol": "USDT",
        "id": "0xe454776c60E63F987f287b97172884E4B1FB890a",
        "chainId": 1103,
        "decimals": 6,
        "logoURI": "https://bsquared-token.netlify.app/images/glow-habitat-test/0xe454776c60E63F987f287b97172884E4B1FB890a.png",
        "type": "erc-20",
        "labels": [
            "Stablecoins"
        ],
        "isNative": false,
        "wrapId": "0xe454776c60E63F987f287b97172884E4B1FB890a"
    }
]

export const bsquaredHabitatTestnet = defineChain({
    id: 1103,
    name: 'B² Habitat Testnet',
    network: 'B² Habitat Testnet',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://habitat-rpc.bsquared.network/"],
        },
        public: {
            http: ["https://habitat-rpc.bsquared.network/"],
        },
    },
    blockExplorers: {
        default: {
            name: 'Polygon zkevm',
            url: "https://habitat-explorer.bsquared.network/"
        },
    },
})

export const currPublicClient = createPublicClient({
    chain: bsquaredHabitatTestnet,
    transport: http()
})

export const currWalletClient = createWalletClient({
    chain: bsquaredHabitatTestnet,
    transport: http()
})

export const account = privateKeyToAccount('0x7656dea46927d34e85d4a4f75c11e5cd25e0aeba91829a2240125f0cf40ac22a')
// export const account = privateKeyToAccount('0x37740bb9c75495dcf596e2a0ecbe7d85647f34c12f67d5c739139b7744d23d6e')

export function buildtContractClient(abi: Abi, address: Address) {
    const contract = getContract({
        address,
        abi,
        client: currPublicClient,
    })
    return contract
}

export function buildtToken(symbol: string): Token {

    const list = tokens.filter((item) => {
        return item.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase()
    })
    return list[0]
}

export async function sendMulticall(
    parameters: MethodParameters,
    contractAddress: Address,
    onlyEstimateGas: boolean = false
) {
    console.log({ calldata: parameters.calldata, value: hexToBigInt(parameters.value) })

    const gasLimit = await currPublicClient.estimateGas({
        account,
        to: contractAddress,
        data: parameters.calldata,
        value: hexToBigInt(parameters.value),
    })
    console.log("gasLimit ", gasLimit);

    const fee = calculateGasMargin(gasLimit)
    if (!onlyEstimateGas) {
        const hex = await currWalletClient.sendTransaction({
            account,
            to: contractAddress,
            data: parameters.calldata,
            value: hexToBigInt(parameters.value),
            gas: fee,
        })
        return { hex }
    } else {
        return { fee }
    }
}

export function buildtContracConfig(): ContractConfig {
    return bsquareHabitatTestnetConfig
}

