import { minVersionBump, NFTInfo, VersionUpgrade } from '../src';
const tokenA: NFTInfo = {
  chainId: 1,
  address: '0x0a',
  nftType: 'ERC721',
  logoURI: 'ipfs://test',
  symbol: 'abcd',
  name: 'token a',
  decimals: 18,
  tags: ['hello', 'world'],
};
const tokenAChangedNameDecimals: NFTInfo = {
  ...tokenA,
  name: 'blah',
  decimals: 12,
};
const tokenAChangedTags: NFTInfo = {
  ...tokenA,
  tags: ['hello', 'worlds'],
};
const tokenB: NFTInfo = {
  chainId: 1,
  address: '0x0b',
  nftType: 'ERC721',
  logoURI: 'ipfs://blah',
  symbol: 'defg',
  name: 'token b',
  decimals: 9,
  tags: ['token', 'other'],
};
describe('#minVersionBump', () => {
  it('empty', () => {
    expect(minVersionBump([], [])).toBe(VersionUpgrade.NONE);
  });
  it('patch for tag changes only', () => {
    expect(minVersionBump([tokenA], [tokenAChangedTags])).toBe(
      VersionUpgrade.PATCH
    );
  });
  it('patch for name/decimals changes', () => {
    expect(minVersionBump([tokenA], [tokenAChangedNameDecimals])).toBe(
      VersionUpgrade.PATCH
    );
  });
  it('major for remove', () => {
    expect(minVersionBump([tokenA], [])).toBe(VersionUpgrade.MAJOR);
  });
  it('minor for add', () => {
    expect(minVersionBump([], [tokenA])).toBe(VersionUpgrade.MINOR);
  });
  it('major for add/remove', () => {
    expect(minVersionBump([tokenB], [tokenA])).toBe(VersionUpgrade.MAJOR);
  });
});
