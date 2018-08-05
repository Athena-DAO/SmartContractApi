'use strict';

var contractInterface = require('../models/contract');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

exports.create_proposal = function (req, res) {
  var data_scientist = req.body.data_scientist.address
  var miner = req.body.miner
  var amount = req.body.amount
  var job_description = req.body.pipeline_id;
  var myContract = new web3.eth.Contract(contractInterface.getContractInterface(), contractInterface.getContractAddress());

  web3.eth.personal.unlockAccount(data_scientist, req.body.data_scientist.password).then(x => {
    myContract.methods.newProposal(miner, amount, job_description, web3.utils.asciiToHex("random")).estimateGas({ from: data_scientist })
      .then(function (gasAmount) {
        console.log(gasAmount)
        myContract.methods.newProposal(miner, amount, job_description, web3.utils.asciiToHex("random")).send({ from: data_scientist, gas: gasAmount + 10000 })
          .on('transactionHash', function (hash) {
            console.log(hash);
          })
          .on('receipt', function (receipt) {
            res.json(receipt.events.ProposalAdded.returnValues.proposalID);
          })
          .on('error', function (error) {
            console.log(error);
            res.status(500).send(error);
          });
        web3.eth.sendTransaction({
          from: data_scientist,
          to: contractInterface.getContractAddress(),
          value: amount
        })
          .then(function (receipt) {
            console.log(receipt)
          });
      })
  })
};

exports.vote_on_proposal = function (req, res) {
  var miner = req.body.miner.address
  var proposal_id = req.body.proposal_id

  var myContract = new web3.eth.Contract(contractInterface.getContractInterface(), contractInterface.getContractAddress());

  web3.eth.personal.unlockAccount(miner, req.body.miner.password).then(x => {
    myContract.methods.vote(proposal_id, true, 'complete', web3.utils.asciiToHex("random")).estimateGas({ from: miner })
      .then(function (gasAmount) {
        console.log(gasAmount)
        myContract.methods.vote(proposal_id, true, 'complete', web3.utils.asciiToHex("random")).send({ from: miner, gas: gasAmount + 10000 })
          .on('transactionHash', function (hash) {
            console.log(hash);
            res.status(200).send('');
          })
          .on('receipt', function (receipt) {
          })
          .on('error', function (error) {
            console.log(error);
            res.status(500).send(error);
          });
      })
  })
};