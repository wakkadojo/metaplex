import React, { useEffect, useState } from 'react';
import { Statistic } from 'antd';
import { useSolPrice } from '../../contexts';
import { formatUSD } from '@oyster/common';
import { SolCircle } from '../Custom';
import { QUOTE_NAME } from '../../constants';
import { isNull } from 'lodash';

interface IAmountLabel {
  amount: number | string;
  displayUSD?: boolean;
  displaySOL?: boolean;
  title?: string;
  style?: object;
  containerStyle?: object;
  iconSize?: number;
  customPrefix?: JSX.Element;
  ended?: boolean;
  amountNum?: number | null;
}

export const AmountLabel = (props: IAmountLabel) => {
  const {
    amount,
    displayUSD = true,
    displaySOL = false,
    title = '',
    style = {},
    containerStyle = {},
    iconSize = 38,
    customPrefix,
    ended,
    amountNum: _amountNum,
  } = props;

  const amountNum = _amountNum === undefined ? (typeof amount === 'string' ? (parseFloat(amount)) : amount) : _amountNum || 0;

  const solPrice = useSolPrice();

  const [priceUSD, setPriceUSD] = useState<number | undefined>(undefined);

  useEffect(() => {
    setPriceUSD(solPrice * amountNum);
  }, [amount, solPrice]);

  const PriceNaN = isNaN(amountNum);

  return (
    <div style={{ display: 'flex', ...containerStyle }}>
      {PriceNaN === false && (
        <Statistic
          style={style}
          className="create-statistic"
          title={title || ''}
          value={`${amount}${displaySOL ? ` ${QUOTE_NAME}` : ''}`}
          prefix={customPrefix || <SolCircle iconSize={iconSize} />}
        />
      )}
      {displayUSD && (
        <div className="usd">
          {PriceNaN === false ? (
            formatUSD.format(priceUSD || 0)
          ) : (
            <div className="placebid">{ended ? 'N/A' : 'Place Bid'}</div>
          )}
        </div>
      )}
    </div>
  );
};
