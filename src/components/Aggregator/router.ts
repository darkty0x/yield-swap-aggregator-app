import * as matcha from './adapters/0x';
import * as inch from './adapters/1inch';
import * as cowswap from './adapters/cowswap';
// import * as firebird from './adapters/firebird'
import * as kyberswap from './adapters/kyberswap';
import * as openocean from './adapters/openocean';
import * as paraswap from './adapters/paraswap';
import * as lifi from './adapters/lifi';
import * as rango from './adapters/rango';

// import * as unidex from "./adapters/unidex" - disabled, their api is broken
// import * as airswap from './adapters/airswap' cors
// import * as odos from './adapters/odos' cors
import * as yieldyak from './adapters/yieldyak';
import { capitalizeFirstLetter } from '~/utils';
import { allChains } from '../WalletProvider/chains';
import { chainNamesReplaced, chainsMap } from './constants';
// import * as krystal from './adapters/krystal'

export const adapters = [matcha, inch, cowswap, kyberswap, openocean, paraswap, yieldyak, lifi, rango];

const adaptersMap = adapters.reduce((acc, adapter) => ({ ...acc, [adapter.name]: adapter }), {}) as Record<
	string,
	typeof inch
>;

export function getAllChains() {
	const chains = new Set<string>();
	for (const adapter of adapters) {
		Object.keys(adapter.chainToId).forEach((chain) => chains.add(chain));
	}
	const chainsArr = Array.from(chains);

	const chainsOptions = chainsArr.map((c) => ({
		value: c,
		label: chainNamesReplaced[c] ?? capitalizeFirstLetter(c),
		logoURI: allChains.find(({ id }) => id === chainsMap[c])?.iconUrl
	}));

	return chainsOptions;
}

export function listRoutes(chain: string, from: string, to: string, amount: string, extra, setter) {
	setter([]);
	return Promise.all(
		adapters
			.filter((adap) => adap.chainToId[chain] !== undefined)
			.map(async (adapter) => {
				let price = 'failure' as any;
				try {
					price = await adapter.getQuote(chain, from, to, amount, {
						...extra
					});
				} catch (e) {
					console.error(e);
				}
				const res = {
					price,
					name: adapter.name,
					airdrop: !adapter.token,
					fromAmount: amount
				};

				if (price.price !== 'failure') {
					setter((state) => [...(state || []), res]);
				}
				return res;
			})
	);
}

export async function swap({ chain, from, to, amount, signer, slippage = '1', adapter, rawQuote, tokens }) {
	const aggregator = adaptersMap[adapter];
	try {
		const res = await aggregator.swap({
			chain,
			from,
			to,
			amount,
			signer,
			slippage,
			rawQuote,
			tokens
		});
		return res;
	} catch (e) {
		console.log(e);
	}
}
