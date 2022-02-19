// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/RgbDAOLogicV1.sol';

contract RgbDAOImmutable is RgbDAOLogicV1 {
    constructor(
        address timelock_,
        address rgb_,
        address admin_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) {
        admin = msg.sender;
        initialize(timelock_, rgb_, vetoer_, votingPeriod_, votingDelay_, proposalThresholdBPS_, quorumVotesBPS_);

        admin = admin_;
    }

    function initialize(
        address timelock_,
        address rgb_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'RgbDAO::initialize: admin only');
        require(address(timelock) == address(0), 'RgbDAO::initialize: can only initialize once');

        timelock = IRgbDAOExecutor(timelock_);
        rgb = RgbTokenLike(rgb_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
