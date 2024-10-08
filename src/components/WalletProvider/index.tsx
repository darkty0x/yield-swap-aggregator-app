import * as React from 'react';
import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import styled from 'styled-components';
import { allChains } from './chains';
import { rpcsKeys } from '../Aggregator/rpcs';
import { rainbowWallet } from '@rainbow-me/rainbowkit/wallets';

const { provider, chains } = configureChains(
	[...allChains],
	rpcsKeys.map((key) =>
		jsonRpcProvider({
			rpc: (chain) => ({ http: (chain.rpcUrls[key] as any) || '' })
		})
	)
);

const Provider = styled.div`
	width: 100%;
	& > div {
		width: 100%;
	}
`;

const { connectors } = getDefaultWallets({
	appName: 'DefiLlama',
	chains,
	projectId: 'b3d4ba9fb97949ab12267b470a6f31d2'
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors: [...connectors(), rainbowWallet({ chains, projectId: 'b3d4ba9fb97949ab12267b470a6f31d2' })],
	provider
});

export const WalletWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<Provider>
				<RainbowKitProvider chains={chains} showRecentTransactions={true} theme={darkTheme()}>
					{children}
				</RainbowKitProvider>
			</Provider>
		</WagmiConfig>
	);
};
