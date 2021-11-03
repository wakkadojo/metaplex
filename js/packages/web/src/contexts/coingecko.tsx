import React, { useContext, useEffect, useState } from 'react';
import { RAYDIUM_MARKET_NAME } from '../constants';

export const COINGECKO_POOL_INTERVAL = 1000 * 60; // 60 sec
export const COINGECKO_API = 'https://api.coingecko.com/api/v3/';
export const COINGECKO_COIN_PRICE_API = `${COINGECKO_API}simple/price`;
export const RAYDIUM_PAIRS_API = 'https://api.raydium.io/pairs'
export interface PriceContextState {
  solPrice: number;
}

export const solToUSD = async (): Promise<number> => {
  const url = `${COINGECKO_COIN_PRICE_API}?ids=solana&vs_currencies=usd`;
  const resp = await window.fetch(url).then(resp => resp.json());
  return resp.solana.usd;
};

const CoingeckoContext =
  React.createContext<PriceContextState | null>(null);
export function CoingeckoProvider({ children = null as any }) {
  const [solPrice, setSolPrice] = useState<number>(0);

  useEffect(() => {
    let timerId = 0;
    const queryPrice = async () => {
      const price = await solToUSD();
      setSolPrice(price);
      startTimer();
    };

    const startTimer = () => {
      timerId = window.setTimeout(async () => {
        queryPrice();
      }, COINGECKO_POOL_INTERVAL);
    };

    queryPrice();
    return () => {
      clearTimeout(timerId);
    };
  }, [setSolPrice]);

  return (
    <CoingeckoContext.Provider value={{ solPrice }}>
      {children}
    </CoingeckoContext.Provider>
  );
}

export const useCoingecko = () => {
  const context = useContext(CoingeckoContext);
  return context as PriceContextState
};

export const solToUSDRaydium = async (): Promise<number> => {
  const url = RAYDIUM_PAIRS_API;
  const resp: Array<any> = await window.fetch(url).then(resp => resp.json());
  const target_price_row = resp.filter(row => row.name == RAYDIUM_MARKET_NAME)[0];
  return target_price_row.price;
};

const RaydiumAPIContext =
  React.createContext<PriceContextState | null>(null);
export function RaydiumAPIProvider({ children = null as any }) {
  const [solPrice, setSolPrice] = useState<number>(0);

  useEffect(() => {
    let timerId = 0;
    const queryPrice = async () => {
      const price = await solToUSDRaydium();
      setSolPrice(price);
      startTimer();
    };

    const startTimer = () => {
      timerId = window.setTimeout(async () => {
        queryPrice();
      }, COINGECKO_POOL_INTERVAL);
    };

    queryPrice();
    return () => {
      clearTimeout(timerId);
    };
  }, [setSolPrice]);

  return (
    <RaydiumAPIContext.Provider value={{ solPrice }}>
      {children}
    </RaydiumAPIContext.Provider>
  );
}

export const useRaydiumAPI = () => {
  const context = useContext(RaydiumAPIContext);
  return context as PriceContextState;
};

export const useSolPrice = () => {
  const { solPrice } = useRaydiumAPI(); // useCoingecko();

  return solPrice;
};
