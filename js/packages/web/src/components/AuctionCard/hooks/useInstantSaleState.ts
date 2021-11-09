import { useWallet } from '@solana/wallet-adapter-react';
import { AuctionView } from '../../../hooks';

interface ActionButtonContentProps {
  isInstantSale: boolean;
  isAlreadyBought: boolean;
  canClaimItem: boolean;
  canClaimPurchasedItem: boolean;
  canEndInstantSale: boolean;
}

export const useInstantSaleState = (
  auctionView: AuctionView,
): ActionButtonContentProps => {
  const wallet = useWallet();

  const {
    isInstantSale,
    auctionManager,
    auction,
    myBidderPot,
    myBidderMetadata,
  } = auctionView;

  const isOwner = auctionManager.authority === wallet?.publicKey?.toBase58();
  const isAuctionEnded = auction.info.endedAt;
  const isBidCanceled = !!myBidderMetadata?.info.cancelled;
  const canClaimPurchasedItem = !!(myBidderPot && !isBidCanceled);
  const isAlreadyBought = !!(myBidderPot && isBidCanceled);
  const canClaimItem = !!(isOwner && isAuctionEnded);
  const canEndInstantSale = isOwner && !isAuctionEnded;
  // case 1: bug          false,   undefined,      false,         true,                  false,           false,        false
  // case 2: pre-claimed  false 
  // case e: post-claimed false    undefined,      false,         true,                  false,           false,        false
  // console.log('LOLOL', isOwner, isAuctionEnded, isBidCanceled, canClaimPurchasedItem, isAlreadyBought, canClaimItem, canEndInstantSale);

  return {
    isInstantSale,
    isAlreadyBought,
    canClaimItem,
    canClaimPurchasedItem,
    canEndInstantSale,
  };
};
