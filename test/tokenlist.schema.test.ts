import Ajv from 'ajv';
import { schema } from '../src';
import exampleList from './schema/example.nftlist.json';
import exampleNameSymbolSpecialCharacters from './schema/example-name-symbol-special-characters.nftlist.json';
import bigExampleList from './schema/bigexample.nftlist.json';
import exampleListMinimum from './schema/exampleminimum.nftlist.json';
import emptyList from './schema/empty.nftlist.json';
import emptyNameSymbol from './schema/empty-name-symbol.nftlist.json';
import bigWords from './schema/bigwords.nftlist.json';
import invalidTokenAddress from './schema/invalidtokenaddress.nftlist.json';
import invalidTimestamp from './schema/invalidtimestamp.nftlist.json';
import invalidLogoURI1 from './schema/invalidlogouri.1.nftlist.json';
import invalidLogoURI2 from './schema/invalidlogouri.2.nftlist.json';
import invalidVersion1 from './schema/invalidversion.1.nftlist.json';
import invalidVersion2 from './schema/invalidversion.2.nftlist.json';
import invalidVersion3 from './schema/invalidversion.3.nftlist.json';
import invalidDecimals1 from './schema/invaliddecimals.1.nftlist.json';
import invalidNumTags from './schema/invalidNumTags.nftlist.json';
import invalidDecimals2 from './schema/invaliddecimals.2.nftlist.json';
import extensionsValid from './schema/extensions-valid.nftlist.json';
import extensionsInvalid from './schema/extensions-invalid.nftlist.json';
import extensionsValidObject from './schema/extensions-valid-object.nftlist.json';
import extensionsInvalidObjectTooDeep from './schema/extensions-invalid-object-too-deep.nftlist.json';
import tokenSymbolWithPeriod from './schema/tokenwithperiodsymbol.nftlist.json';
import crossChainExtensions from './schema/example-crosschain.nftlist.json';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(schema);

describe('schema', () => {
  it('is valid', () => {
    expect(ajv.validateSchema(schema)).toEqual(true);
  });

  function checkSchema(schema: any, valid: boolean): void {
    const isValid = validator(schema);
    expect(validator.errors).toMatchSnapshot();
    expect(isValid).toEqual(valid);
  }

  it('works for example schema', () => {
    checkSchema(exampleList, true);
  });

  it('works for special characters schema', () => {
    checkSchema(exampleNameSymbolSpecialCharacters, true);
  });

  it('works for big example schema', () => {
    checkSchema(bigExampleList, true);
  });

  it('minimum example schema', () => {
    checkSchema(exampleListMinimum, true);
  });

  it('requires name, timestamp, version, nfts', () => {
    checkSchema({}, false);
  });

  it('empty list fails', () => {
    checkSchema(emptyList, false);
  });

  it('works for empty names and symbols', () => {
    checkSchema(emptyNameSymbol, true);
  });

  it('fails with big names', () => {
    checkSchema(bigWords, false);
  });

  it('checks token address', () => {
    checkSchema(invalidTokenAddress, false);
  });

  it('invalid timestamp', () => {
    checkSchema(invalidTimestamp, false);
  });

  it('invalid logo URI', () => {
    checkSchema(invalidLogoURI1, false);
    checkSchema(invalidLogoURI2, false);
  });

  it('invalid decimals', () => {
    checkSchema(invalidDecimals1, false);
    checkSchema(invalidDecimals2, false);
  });

  it('invalid number of tags on token', () => {
    checkSchema(invalidNumTags, false);
  });

  it('checks version', () => {
    checkSchema(invalidVersion1, false);
    checkSchema(invalidVersion2, false);
    checkSchema(invalidVersion3, false);
  });

  it('checks extensions', () => {
    checkSchema(extensionsValid, true);
    checkSchema(extensionsInvalid, false);
  });

  it('checks extensions with object', () => {
    checkSchema(extensionsValidObject, true);
  });

  it('checks extensions with too much nesting', () => {
    checkSchema(extensionsInvalidObjectTooDeep, false);
  });

  it('token symbols may contain periods', () => {
    checkSchema(tokenSymbolWithPeriod, true);
  });

  it('cross chain extensions example', () => {
    checkSchema(crossChainExtensions, true);
  });

  it('allows up to 10k nfts', () => {
    const exampleListWith10kTokens = {
      ...exampleList,
      nfts: [...Array(10000)].map(() => exampleList.nfts[0]),
    };
    checkSchema(exampleListWith10kTokens, true);
  });

  it('fails with 10001 nfts', () => {
    const exampleListWith10kTokensPlusOne = {
      ...exampleList,
      nfts: [...Array(10001)].map(() => exampleList.nfts[0]),
    };
    checkSchema(exampleListWith10kTokensPlusOne, false);
  });

  it('allows additional top-level fields', () => {
   const exampleListWithUnknownField = {
     ...exampleList,
     unknownField: 'foo',
   };
   checkSchema(exampleListWithUnknownField, true);
 });
});
