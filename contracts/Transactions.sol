pragma solidity ^0.4.0;

contract Transactions{
	address public government;
	uint fixedWagerPaymentperhr;
	uint fixedPaymentToGPC;
	uint public noOfProjects;

	mapping (address => paymentMade) balances;
	mapping (address => wagers1) hourWorked;
	mapping (address => mapping (uint => project)) ProjectsStock;
	mapping (uint => project) GovProjects;
	struct paymentMade{
		uint _type;
		uint balance;
		address receiver;
		bytes32 transferHash;
	}

	struct project{
		address _gpc;
		uint _noOfDays;
		uint _noOfWagers;
		uint _budget;
		uint _id;
		bytes32 _transferHash;
	}

	struct wagers1{
		uint hours1;
		uint days1;
		bool flag;
		address user;
	}

	modifier onlyGovernment{
		if (msg.sender != government) throw;
		_;
	}

	event BudgetAddedToGovernment(address indexed _governmentAddress, uint _budget);

	event PaymentMadeToGPC(address indexed _governmentAddress , address indexed _gpc, uint _amount);
	event PaymentMadeToWager(address indexed _gpc, address indexed _wager, uint _hoursPaidFor, uint _amount);
	event PaymentMadeToWager_HashLog(address indexed _gpc, address indexed _wager, uint _hoursPaidFor, uint _amount);
	event PaymentConfirmedByWager(address indexed _wager,uint _balance);

	event ProjectAddedToGov(uint _id, address _gpc, uint _noOfDays, uint _noOfWagers, uint _budget);
	event ProjectSentToGPC(uint _id, address _gpc, uint _noOfDays, uint _noOfWagers, uint _budget);

	event PaymentConfirmedByGPC(address indexed _gpc, uint _balance);

	event WagerWorkedHours(address indexed _wager, uint _hours); // check/verify

	function Transactions() {
		government = tx.origin;
		noOfProjects = 0;
		fixedWagerPaymentperhr = 100;
		fixedPaymentToGPC = 50000;
	}

	function addBudget(uint _budget) onlyGovernment returns (bool) {
		if (balances[government].receiver == address(0)) {
			paymentMade memory newGovernmentPay;
			newGovernmentPay.balance = _budget;
			newGovernmentPay._type = 0;
			newGovernmentPay.receiver = government;
			balances[government] = newGovernmentPay;
			BudgetAddedToGovernment(government, _budget);
		} else {
			balances[government].balance += _budget;
			BudgetAddedToGovernment(government, _budget);
		}
	}

	function addProjectToGov(uint id, address gpc, uint noOfDays, uint noOfWagers, uint budget) onlyGovernment returns (bool){
		if (balances[government].balance < budget) throw;
		if (ProjectsStock[gpc][id]._id != uint(0)) throw;
		project memory item;
		item._gpc = gpc;
		item._noOfDays = noOfDays;
		item._noOfWagers = noOfWagers;
		item._budget = budget;
		item._id = id;
		GovProjects[id] = item;
		noOfProjects += 1;
		ProjectAddedToGov(id, gpc, noOfDays, noOfWagers, budget);
	}

	function sendProjectToGPC_hash(uint id, address gpc, bytes32 hash) onlyGovernment returns (bool) {
		if(balances[government].balance < GovProjects[id]._budget) throw;
		if(GovProjects[id]._id == uint(0)) throw;
		if (balances[gpc].transferHash != bytes32(0)) throw;
		if(GovProjects[id]._gpc == gpc){
			project memory item;
			item._gpc = gpc;
			item._noOfDays = GovProjects[id]._noOfDays;
			item._noOfWagers = GovProjects[id]._noOfWagers;
			item._budget = GovProjects[id]._budget;
			item._transferHash = hash;
			item._id = id;
			ProjectsStock[gpc][id] = item;
			if(balances[gpc].receiver == address(0)) {
				paymentMade memory newUser;
				newUser._type = 1;
				newUser.balance = GovProjects[id]._budget;
				newUser.receiver = gpc;
				newUser.transferHash = bytes32(0);
				balances[gpc] = newUser;
				balances[government].balance -= GovProjects[id]._budget;
				PaymentMadeToGPC(government, gpc, GovProjects[id]._budget);
				ProjectSentToGPC(id, gpc, GovProjects[id]._noOfDays, GovProjects[id]._noOfWagers, GovProjects[id]._budget);
			}
			else{
				balances[gpc]._type = 1;
				balances[gpc].balance += GovProjects[id]._budget;
				balances[government].balance -= GovProjects[id]._budget;
				PaymentMadeToGPC(government, gpc, GovProjects[id]._budget);
				ProjectSentToGPC(id, gpc, GovProjects[id]._noOfDays, GovProjects[id]._noOfWagers, GovProjects[id]._budget);
			}
			return true;
		}
	}


  	function payToWager(address _wager, address _gpc) returns (bool) {
		if(balances[_gpc].receiver == address(0)) throw;
		uint totalPaymentToWager;
		uint hoursPaidFor;
		totalPaymentToWager = fixedWagerPaymentperhr * getTotalHoursWorked(_wager);
		if (totalPaymentToWager == 0) throw;
		if(balances[_wager].receiver == address(0)){
			if(balances[_gpc].balance < totalPaymentToWager) throw;
			paymentMade memory newUser;
			newUser._type = 2;
			newUser.balance = totalPaymentToWager;
			newUser.receiver = _wager;
			balances[_wager] = newUser;
			balances[_gpc].balance -= totalPaymentToWager;
			hoursPaidFor = totalPaymentToWager / fixedWagerPaymentperhr;
			PaymentMadeToWager(_gpc, _wager, hoursPaidFor, totalPaymentToWager);
		}
		else{
			// get previous balance of wager
			uint prevBal = balances[_wager].balance;
			// and then subtract it from the totalPaymentToWager to get the current due amount to be paid
			uint currentDueToPay = totalPaymentToWager - prevBal;
			if(balances[_gpc].balance < currentDueToPay) throw;
			balances[_wager].balance += currentDueToPay;
			balances[_gpc].balance -= currentDueToPay;
			hoursPaidFor = currentDueToPay / fixedWagerPaymentperhr;
			PaymentMadeToWager(_gpc, _wager, hoursPaidFor, currentDueToPay);
		}
		return true;
	}

  	function payToWager_Hash(address _wager, address _gpc, bytes32 _hash) returns (bool) {
		if(balances[_gpc].receiver == address(0)) throw;
		// Previous transfer not completed by customer
		if (balances[_wager].transferHash != bytes32(0)) throw;
		uint totalPaymentToWager;
		uint hoursPaidFor;
		totalPaymentToWager = fixedWagerPaymentperhr * getTotalHoursWorked(_wager);
		if (totalPaymentToWager == 0) throw;
		if(balances[_wager].receiver == address(0)){
			if(balances[_gpc].balance < totalPaymentToWager) throw;
			paymentMade memory newUser;
			newUser._type = 2;
			newUser.balance = totalPaymentToWager;
			newUser.receiver = _wager;
			newUser.transferHash = _hash;
			balances[_wager] = newUser;
			balances[_gpc].balance -= totalPaymentToWager;
			hoursPaidFor = totalPaymentToWager / fixedWagerPaymentperhr;
			PaymentMadeToWager_HashLog(_gpc, _wager, hoursPaidFor, totalPaymentToWager);
		}
		else{
			// get previous balance of wager
			uint prevBal = balances[_wager].balance;
			// and then subtract it from the totalPaymentToWager to get the current due amount to be paid
			uint currentDueToPay = totalPaymentToWager - prevBal;
			if(balances[_gpc].balance < currentDueToPay) throw;
			balances[_wager].balance += currentDueToPay;
			balances[_wager].transferHash = _hash;
			balances[_gpc].balance -= currentDueToPay;
			hoursPaidFor = currentDueToPay / fixedWagerPaymentperhr;
			PaymentMadeToWager_HashLog(_gpc, _wager, hoursPaidFor, currentDueToPay);
		}
		return true;
	}

	// Wager can confirm the money transfered from gpc
	// by looking at the transaction event
	function confirm_gpcSupplyToWager_Hash(address _wager, string _secretKey) returns (bool) {
		if (balances[_wager].receiver == address(0)) throw;
		if (balances[_wager].transferHash == bytes32(0)) throw;
		bytes32 newHashCalculated = sha3(_secretKey);
		bytes32 transferHash = balances[_wager].transferHash;

		if (newHashCalculated != transferHash)
			return false;

		// lands here only when newHashCalculated == transferHash
		balances[_wager].transferHash = bytes32(0);
		PaymentConfirmedByWager(_wager, balances[_wager].balance);
		return true;
	}

	function confirm_govSupplyToGpc_Hash(uint id,address gpc, string _secretKey) returns (bool) {
		if (ProjectsStock[gpc][id]._gpc == address(0)) throw;
		if (ProjectsStock[gpc][id]._transferHash == bytes32(0)) throw;
		bytes32 newHashCalculated = sha3(_secretKey);
		bytes32 transferHash = ProjectsStock[gpc][id]._transferHash;

		if (newHashCalculated != transferHash)
			return false;

		// lands here only when newHashCalculated == transferHash
		ProjectsStock[gpc][id]._transferHash = bytes32(0);
		PaymentConfirmedByGPC(gpc, ProjectsStock[gpc][id]._budget);
		return true;
	}

	function hoursWorked(address _wager) returns (bool) {
		if(hourWorked[_wager].user == address(0)) {
			wagers1 memory newUser;
			newUser.hours1 = 1;
			newUser.flag = true;
			newUser.days1 = 0;
			newUser.user = _wager;
			hourWorked[_wager] = newUser;
			// also create paymentMade struct for the new user
			paymentMade memory newUserPayment;
			newUserPayment._type = 2;
			newUserPayment.balance = 0;
			newUserPayment.receiver = _wager;
			balances[_wager] = newUserPayment;
			WagerWorkedHours(_wager, 1);
			return true;
		}
		if(hourWorked[_wager].flag == false) throw;
		if(hourWorked[_wager].days1 == 120){
			hourWorked[_wager].flag = false;
			return false;
		}
		if((hourWorked[_wager].hours1 < 7) && (hourWorked[_wager].days1 < 120)){
			hourWorked[_wager].hours1 += 1;
			WagerWorkedHours(_wager, 1);
			return true;
		}
		if(((hourWorked[_wager].hours1 + 1) == 8) && (hourWorked[_wager].days1 < 120)){
			hourWorked[_wager].hours1 = 0;
			hourWorked[_wager].days1 += 1;
			WagerWorkedHours(_wager, 1);
			//return true;
		}
	}

	function timeWorked(address _wager, uint _days, uint _hours) returns (bool) {
		if(_days > 120) throw;
		if(_hours >= 8) {
			_days += (_hours / 8);
			_hours = _hours % 8;
		}
		if(hourWorked[_wager].user == address(0)) {
			wagers1 memory newUser;
			newUser.hours1 = _hours;
			newUser.flag = true;
			newUser.days1 = _days;
			newUser.user = _wager;
			//newUser.transferHash = _hash;
			hourWorked[_wager] = newUser;
			// also create paymentMade struct for the new user
			paymentMade memory newUserPayment;
			newUserPayment._type = 2;
			newUserPayment.balance = 0;
			newUserPayment.receiver = _wager;
			balances[_wager] = newUserPayment;
			WagerWorkedHours(_wager, _hours + (_days * 8));
			return true;
		}
		if((hourWorked[_wager].days1 + _days) > 120) throw;
		if((hourWorked[_wager].hours1 + _hours) < 8) {
			hourWorked[_wager].hours1 += _hours;
			hourWorked[_wager].days1 += _days;
			WagerWorkedHours(_wager, _hours + (_days * 8));
			return true;
		}
		if((hourWorked[_wager].hours1 + _hours) == 8) {
			hourWorked[_wager].hours1 = 0;
			hourWorked[_wager].days1 += 1;
			hourWorked[_wager].days1 += _days;
			WagerWorkedHours(_wager, _hours + (_days * 8));
			return true;
		}
		if((hourWorked[_wager].hours1 + _hours) > 8) {
			hourWorked[_wager].hours1 = hourWorked[_wager].hours1 + _hours - 8;
			hourWorked[_wager].days1 += 1;
			hourWorked[_wager].days1 += _days;
			WagerWorkedHours(_wager, _hours + (_days * 8));
			return true;
		}
	}

	function getWagerWorkedTime(address _wager) constant returns (uint, uint) {
		uint workedHours;
		uint workedDays;
		if (hourWorked[_wager].user != address(0)) {
			workedHours = hourWorked[_wager].hours1;
			workedDays = hourWorked[_wager].days1;
		}
		return (workedDays, workedHours);
	}

	function getDueAmountOfWager(address _wager) constant returns (uint) {
		uint dueAmount;
		if (balances[_wager].receiver != address(0)) {
			dueAmount = fixedWagerPaymentperhr * getTotalHoursWorked(_wager) - balances[_wager].balance;
		}
		return dueAmount;
	}

	function getDueHoursNotPaid(address _wager) constant returns (uint) {
		return getDueAmountOfWager(_wager) / fixedWagerPaymentperhr;
	}

	function validWager(address _wager) constant returns (bool){
		return hourWorked[_wager].flag;
	}

	function getTotalHoursWorked(address _wager) constant returns (uint){
		return hourWorked[_wager].days1 * 8 + hourWorked[_wager].hours1;
	}

	function getTotalDaysWorked(address _cus) constant returns(uint){
		return hourWorked[_cus].days1;
	}

	function getBalance(address _userAddr) constant returns(uint){
		uint balance;
		if(balances[_userAddr].receiver != address(0)){
			balance = balances[_userAddr].balance;
		}
		return balance;
	}
}
