// SPDX-License-Identifier: GPL-3.0

/// @title Interface for RgbToken

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IRgbDescriptor } from './IRgbDescriptor.sol';
import { IRgbSeeder } from './IRgbSeeder.sol';

interface IRgbToken is IERC721 {
    event RgbCreated(uint256 indexed tokenId, IRgbSeeder.Seed seed);

    event RgbBurned(uint256 indexed tokenId);

    event RgbfoundersDAOUpdated(address rgbfoundersDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(IRgbDescriptor descriptor);

    event DescriptorLocked();

    event SeederUpdated(IRgbSeeder seeder);

    event SeederLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setRgbfoundersDAO(address rgbfoundersDAO) external;

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(IRgbDescriptor descriptor) external;

    function lockDescriptor() external;

    function setSeeder(IRgbSeeder seeder) external;

    function lockSeeder() external;
}
