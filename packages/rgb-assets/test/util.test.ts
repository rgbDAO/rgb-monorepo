import { expect } from 'chai';
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity';
import {
  shiftRightAndCast,
  getPseudorandomPart,
  getRgbSeedFromBlockHash,
  getRgbData,
} from '../src/index';
import { images } from '../src/image-data.json';
import { RgbSeed } from '../src/types';

const { bodies, accessories, heads, glasses } = images;

describe('@rgbdao/assets utils', () => {
  // Test against Noun 116, created at block 13661786
  const RGB116_ID = 116;
  const RGB116_SEED: RgbSeed = {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15,
  };
  const RGB116_PREV_BLOCKHASH =
    '0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01';
  const RGB116_PSEUDORANDOMNESS = solidityKeccak256(
    ['bytes32', 'uint256'],
    [RGB116_PREV_BLOCKHASH, RGB116_ID],
  );

  describe('shiftRightAndCast', () => {
    it('should work correctly', () => {
      expect(shiftRightAndCast(RGB116_PREV_BLOCKHASH, 0, 48)).to.equal('0x00134ee53e01');
      expect(shiftRightAndCast(RGB116_PREV_BLOCKHASH, 48, 48)).to.equal('0x7acb2f40d7f2');
    });
  });

  describe('getPseudorandomPart', () => {
    it('should match RgbSeeder.sol implementation for a pseudorandomly chosen part', () => {
      const headShift = 144;
      const { head } = RGB116_SEED;
      expect(getPseudorandomPart(RGB116_PSEUDORANDOMNESS, heads.length, headShift)).to.be.equal(
        head,
      );
    });
  });

  describe('getRgbSeedFromBlockHash', () => {
    it('should match RgbSeeder.sol implementation for generating a RGB seed', () => {
      expect(getRgbSeedFromBlockHash(RGB116_ID, RGB116_PREV_BLOCKHASH)).to.deep.equal(
        RGB116_SEED,
      );
    });
  });
});
