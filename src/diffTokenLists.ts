import { NFTInfo } from './types';

export type NFTInfoChangeKey = Exclude<keyof NFTInfo,'address' | 'chainId'>;
export type NFTInfoChanges = Array<NFTInfoChangeKey>;

/**
 * compares two token info key values
 * this subset of full deep equal functionality does not work on objects or object arrays
 * @param a comparison item a
 * @param b comparison item b
 */
function compareNFTInfoProperty(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((el, i) => b[i] === el);
  }
  return false;
}

/**
 * Differences between a base list and an updated list.
 */
export interface TokenListDiff {
  /**
   * Tokens from updated with chainId/address not present in base list
   */
  readonly added: NFTInfo[];
  /**
   * Tokens from base with chainId/address not present in the updated list
   */
  readonly removed: NFTInfo[];
  /**
   * The token info that changed
   */
  readonly changed: {
    [chainId: number]: {
      [address: string]: NFTInfoChanges;
    };
  };
}

/**
 * Computes the diff of a token list where the first argument is the base and the second argument is the updated list.
 * @param base base list
 * @param update updated list
 */
export function diffTokenLists(
  base: NFTInfo[],
  update: NFTInfo[]
): TokenListDiff {
  const indexedBase = base.reduce<{
    [chainId: number]: { [address: string]: NFTInfo };
  }>((memo, NFTInfo) => {
    if (!memo[NFTInfo.chainId]) memo[NFTInfo.chainId] = {};
    memo[NFTInfo.chainId][NFTInfo.address] = NFTInfo;
    return memo;
  }, {});

  const newListUpdates = update.reduce<{
    added: NFTInfo[];
    changed: {
      [chainId: number]: {
        [address: string]: NFTInfoChanges;
      };
    };
    index: {
      [chainId: number]: {
        [address: string]: true;
      };
    };
  }>(
    (memo, NFTInfo) => {
      const baseToken = indexedBase[NFTInfo.chainId]?.[NFTInfo.address];
      if (!baseToken) {
        memo.added.push(NFTInfo);
      } else {
        const changes: NFTInfoChanges = Object.keys(NFTInfo)
          .filter(
            (s): s is NFTInfoChangeKey => s !== 'address' && s !== 'chainId'
          )
          .filter(s => {
            return !compareNFTInfoProperty(NFTInfo[s], baseToken[s]);
          });
        if (changes.length > 0) {
          if (!memo.changed[NFTInfo.chainId]) {
            memo.changed[NFTInfo.chainId] = {};
          }
          memo.changed[NFTInfo.chainId][NFTInfo.address] = changes;
        }
      }

      if (!memo.index[NFTInfo.chainId]) {
        memo.index[NFTInfo.chainId] = {
          [NFTInfo.address]: true,
        };
      } else {
        memo.index[NFTInfo.chainId][NFTInfo.address] = true;
      }

      return memo;
    },
    { added: [], changed: {}, index: {} }
  );

  const removed = base.reduce<NFTInfo[]>((list, curr) => {
    if (
      !newListUpdates.index[curr.chainId] ||
      !newListUpdates.index[curr.chainId][curr.address]
    ) {
      list.push(curr);
    }
    return list;
  }, []);

  return {
    added: newListUpdates.added,
    changed: newListUpdates.changed,
    removed,
  };
}
