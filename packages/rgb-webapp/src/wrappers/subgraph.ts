import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export interface IBid {
  id: string;
  bidder: {
    id: string;
  };
  amount: BigNumber;
  blockNumber: number;
  blockTimestamp: number;
  txIndex?: number;
  rgb: {
    id: number;
    startTime?: BigNumberish;
    endTime?: BigNumberish;
    settled?: boolean;
  };
}

export const auctionQuery = (auctionId: number) => gql`
{
	auction(id: ${auctionId}) {
	  id
	  amount
	  settled
	  bidder {
	  	id
	  }
	  startTime
	  endTime
	  rgb {
		id
		seed {
		  id
		  background
		  body
		  accessory
		  head
		  glasses
		}
		owner {
		  id
		}
	  }
	  bids {
		id
		blockNumber
		txIndex
		amount
	  }
	}
  }
  `;

export const bidsByAuctionQuery = (auctionId: string) => gql`
 {
	bids(where:{auction: "${auctionId}"}) {
	  id
	  amount
	  blockNumber
	  blockTimestamp
	  txIndex
	  bidder {
	  	id
	  }
	  rgb {
		id
	  }
	}
  }
 `;

export const rgbQuery = (id: string) => gql`
 {
	rgb(id:"${id}") {
	  id
	  seed {
	  background
		body
		accessory
		head
		glasses
	}
	  owner {
		id
	  }
	}
  }
 `;

export const rgbIndex = () => gql`
  {
    rgb {
      id
      owner {
        id
      }
    }
  }
`;

export const latestAuctionsQuery = () => gql`
  {
    auctions(orderBy: startTime, orderDirection: desc, first: 1000) {
      id
      amount
      settled
      bidder {
        id
      }
      startTime
      endTime
      rgb {
        id
        owner {
          id
        }
      }
      bids {
        id
        amount
        blockNumber
        blockTimestamp
        txIndex
        bidder {
          id
        }
      }
    }
  }
`;

export const latestBidsQuery = (first: number = 10) => gql`
{
	bids(
	  first: ${first},
	  orderBy:blockTimestamp,
	  orderDirection: desc
	) {
	  id
	  bidder {
		id
	  }
	  amount
	  blockTimestamp
	  txIndex
	  blockNumber
	  auction {
		id
		startTime
		endTime
		settled
	  }
	}
  }  
`;

export const rgbVotingHistoryQuery = (rgbId: number) => gql`
{
	rgb(id: ${rgbId}) {
		id
		votes {
		proposal {
			id
		}
		support
		supportDetailed
		}
	}
}
`;

export const highestRgbIdMintedAtProposalTime = (proposalStartBlock: number) => gql`
{
	auctions(orderBy: endTime orderDirection: desc first: 1 block: { number: ${proposalStartBlock} }) {
		id
	}
}`;

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
