//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
//var User = artifacts.require("./User.sol");
//var Approval = artifacts.require("./Approval.sol");
//var PaymentCards = artifacts.require("./PaymentCards.sol");
var Transactions = artifacts.require("./Transactions.sol");

module.exports = function(deployer) {
  //deployer.deploy(User);
   //deployer.deploy(Approval);
	//deployer.deploy(PaymentCards);
	deployer.deploy(Transactions);
};
