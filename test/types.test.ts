import { NFTList } from '../src';
import exampleList from './schema/example.nftlist.json';

describe('types', () => {
  it('matches example schema', () => {
    // this is enough--typescript won't cast it unless it matches the interface
    const list: NFTList = exampleList;

    expect(list.name).toEqual('My NFT List');
  });
});
