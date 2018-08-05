'use strict';

var contractInterface = require('../models/contract');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

exports.create_account = function (req, res) {
  web3.eth.personal.newAccount(req.body.password).then(account => {
    var myContract = new web3.eth.Contract(contractInterface.getContractInterface(), contractInterface.getContractAddress());

    web3.eth.personal.unlockAccount(contractInterface.getAdminAccount(), contractInterface.getAdminPassword()).then(x => {
      myContract.methods.addMember(account, '').estimateGas({ from: contractInterface.getAdminAccount() })
        .then(function (gasAmount) {
          myContract.methods.addMember(account, '').send({ from: contractInterface.getAdminAccount(), gas: gasAmount + 10000 })
            .on('transactionHash', function (hash) {
              console.log("hash");
              console.log(hash);
            })
            .on('receipt', function (receipt) {
              console.log("recipt");
              console.log(receipt);
            })
            .on('error', console.error);
        })
    });
    res.json(account);
  })
};

exports.get_account = function (req, res) {
  web3.eth.getBalance(req.params.account_id)
    .then(x => {
      res.json(web3.utils.fromWei(x));
    });
};