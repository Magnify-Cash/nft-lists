type ExtensionValue = string | number | boolean | null | undefined;

export interface NFTInfo {
  readonly chainId: number;
  readonly address: string;
  readonly nftType: string;
  readonly name: string;
  readonly decimals?: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: {
    readonly [key: string]:
      | {
          [key: string]:
            | {
                [key: string]: ExtensionValue;
              }
            | ExtensionValue;
        }
      | ExtensionValue;
  };
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

export interface NFTList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly nfts: NFTInfo[];
  readonly tokenMap?: {
    readonly [key: string]: NFTInfo;
  };
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
