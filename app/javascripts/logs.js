// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import transaction_artifacts from '../../build/contracts/Transactions.json'
// Food is our usable abstraction
var Transaction = contract(transaction_artifacts);

var accounts;
var governmentAddress;
var paymentGlobal;
//var foodItems = {};
var userAccounts = {};
var i;
//var foodItemInterval;
var accountsDB = {};

//var foodStockOf = {};
var governmentStock = {};
var gpcStock = {};
var customerStock = {};

window.LogsApp = {
    logStart: function() {
      var self = this;
      Transaction.setProvider(web3.currentProvider);

      Transaction.deployed().then(function(instance){
          paymentGlobal = instance;
          console.log(paymentGlobal);
      });

      web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }
        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }
        accounts = accs;
        for (var i = 0; i < accounts.length; i++)
            console.log(i + " => " + accounts[i]);
        governmentAddress = accounts[0];

        
        self.loadAccountsDB();
		    window.LogsApp.getEventsFromGenesis();
		
      });
    },
    loadAccountsDB: function() {
      var self = this;

      accountsDB[accounts[0]] = "Government";
      accountsDB[accounts[1]] = "Tomoko";
      accountsDB[accounts[2]] = "Anita";
      accountsDB[accounts[3]] = "Elia";
      accountsDB[accounts[4]] = "Kathlene";
      accountsDB[accounts[5]] = "Royce";
      accountsDB[accounts[6]] = "Stan";
      accountsDB[accounts[7]] = "Latina";
      accountsDB[accounts[8]] = "Ida";
      accountsDB[accounts[9]] = "Boyd";
  },
	getEventsFromGenesis: function() {
    var self = this;
	  var event2 = paymentGlobal.BudgetAddedToGovernment({}, {fromBlock: 0, toBlock: 'latest'});
    event2.get(function(error, result){
      if (!error) {
        // var foodAddedToStockLog = document.getElementById("food-added-to-stock-log");
        var budgetAddedToStockTable = document.getElementById("money-added-to-stock-table");
        // events from 0 to last but one
        document.getElementById("load-1").style.display = "none";
		    var transaction_no=1;
        for (var i = 0; i < result.length; i++) {
          console.log(transaction_no + " : " + result[i].args._budget);
		      var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
		      td1.appendChild(document.createTextNode(transaction_no));
          if (governmentStock.hasOwnProperty(result[i].args._governmentAddress)) {
            governmentStock[result[i].args._governmentAddress] += result[i].args._budget.toNumber();
          } else {
            governmentStock[result[i].args._governmentAddress] = result[i].args._budget.toNumber();
          }
          td2.appendChild(document.createTextNode(result[i].args._budget));
          tr.appendChild(td1);
          tr.appendChild(td2);
          budgetAddedToStockTable.appendChild(tr);
		      transaction_no++;
        }
        
      } else {
        console.log(error);
      }
    });
	  var event21 = paymentGlobal.ProjectAddedToGov({}, {fromBlock: 0, toBlock: 'latest'});
    event21.get(function(error, result){
      if (!error) {
        
        var budgetAddedToStockTable1 = document.getElementById("project-added-to-stock-table");
        // events from 0 to last but one
        document.getElementById("load-1").style.display = "none";
		    var transaction_no=1;
        for (var i = 0; i < result.length; i++) {
          //console.log(transaction_no + " : " + result[i].args._budget);
		      var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
		      var td3 = document.createElement("td");
		      var td4 = document.createElement("td");
		      var td5 = document.createElement("td");
		      td1.appendChild(document.createTextNode(result[i].args._id));
		      td2.appendChild(document.createTextNode(accountsDB[result[i].args._gpc]));
		      td3.appendChild(document.createTextNode(result[i].args._noOfDays));
		      td4.appendChild(document.createTextNode(result[i].args._noOfWagers));
		      td5.appendChild(document.createTextNode(result[i].args._budget));
          tr.appendChild(td1);
          tr.appendChild(td2);
		      tr.appendChild(td3);
		      tr.appendChild(td4);
		      tr.appendChild(td5);
          budgetAddedToStockTable1.appendChild(tr);
        }
        
      } else {
		    alert("Project ID already exists!!");
        console.log(error);
      }
    });
	  var event22 = paymentGlobal.ProjectSentToGPC({}, {fromBlock: 0, toBlock: 'latest'});
    event22.get(function(error, result){
      if (!error) {
        var projectAddedToStockTable2 = document.getElementById("project-sent-to-stock-table");
        document.getElementById("load-1").style.display = "none";
		    var transaction_no=1;
        for (var i = 0; i < result.length; i++) {
          //console.log(transaction_no + " : " + result[i].args._budget);
		      var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
		      var td3 = document.createElement("td");
		      var td4 = document.createElement("td");
		      var td5 = document.createElement("td");
		      td1.appendChild(document.createTextNode(result[i].args._id));
		      td2.appendChild(document.createTextNode(accountsDB[result[i].args._gpc]));
		      td3.appendChild(document.createTextNode(result[i].args._noOfDays));
		      td4.appendChild(document.createTextNode(result[i].args._noOfWagers));
	        td5.appendChild(document.createTextNode(result[i].args._budget));
          tr.appendChild(td1);
          tr.appendChild(td2);
		      tr.appendChild(td3);
		      tr.appendChild(td4);
		      tr.appendChild(td5);
          projectAddedToStockTable2.appendChild(tr);
		    }
        // window.LogsApp.registerEvent();
      } else {
        console.log(error);
      }
    });
	  var event23 = paymentGlobal.PaymentConfirmedByGPC({}, {fromBlock: 0, toBlock: 'latest'});
    event23.get(function(error, result){
      if (!error) {
        
        var paymentConfirmed = document.getElementById("payment-confirmed-by-gpc-table");
        // events from 0 to last but one
        document.getElementById("load-1").style.display = "none";
		    var transaction_no=1;
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].args._gpc);
		      var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
		   
		      td1.appendChild(document.createTextNode(accountsDB[result[i].args._gpc]));
		      td2.appendChild(document.createTextNode(result[i].args._balance));
		  
          tr.appendChild(td1);
          tr.appendChild(td2);
		      paymentConfirmed.appendChild(tr);
		  
        }
        // window.LogsApp.registerEvent();
      } else {
        console.log(error);
      }
    });
	
	  var event3 = paymentGlobal.PaymentMadeToGPC({}, {fromBlock: 0, toBlock: 'latest'});
    event3.get(function(error, result){
      if (!error) {
        // var foodSuppliedToFpsLog = document.getElementById("food-supplied-to-fps-log");
        var moneySuppliedToGpcTable = document.getElementById("money-supplied-to-gpc-table");
        // events from 0 to last but one
        document.getElementById("load-2").style.display = "none";
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].args._gpc + " : " + result[i].args._amount);
          if (gpcStock.hasOwnProperty(result[i].args._gpc)) {
            gpcStock[result[i].args._gpc] += result[i].args._amount.toNumber();
			
          } else {
            //fpsStock[result[i].args._fpsAddress] = {};
            gpcStock[result[i].args._gpc] = result[i].args._amount.toNumber();
          }
          var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
          //var td3 = document.createElement("td");
          td1.appendChild(document.createTextNode(accountsDB[result[i].args._gpc]));
          td2.appendChild(document.createTextNode(result[i].args._amount));
          //td3.appendChild(document.createTextNode(result[i].args._quantity));
          tr.appendChild(td1);
          tr.appendChild(td2);
          //tr.appendChild(td3);
          moneySuppliedToGpcTable.appendChild(tr);
          
        }
      } else {
        console.log(error);
      }
    });
	  var event4 = paymentGlobal.PaymentMadeToWager_HashLog({}, {fromBlock: 0, toBlock: 'latest'});
    event4.get(function(error, result){
      if (!error) {
        // var foodSoldToCustomerLog = document.getElementById("food-sold-to-customer-log");
        var moneySuppliedToWagerTable = document.getElementById("money-supplied-to-wager-table");
        // events from 0 to last but one
        document.getElementById("load-3").style.display = "none";
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].args._gpc + " => " + result[i].args._wager +  " : " + result[i].args._hoursPaidFor + " : " +  result[i].args._amount);
          if (customerStock.hasOwnProperty(result[i].args._wager)) {
            if (customerStock[result[i].args._wager].hasOwnProperty(result[i].args._gpc)) {
              customerStock[result[i].args._wager][result[i].args._gpc]["amount"] += result[i].args._amount.toNumber();
              customerStock[result[i].args._wager][result[i].args._gpc]["hrs"] += result[i].args._hoursPaidFor.toNumber();
            } else {
              customerStock[result[i].args._wager][result[i].args._gpc] = {
                "amount": result[i].args._amount.toNumber(),
                "hrs": result[i].args._hoursPaidFor.toNumber()
              };
            }
			
          } else {
            customerStock[result[i].args._wager] = {};
            
            customerStock[result[i].args._wager][result[i].args._gpc] = {
              "amount": result[i].args._amount.toNumber(),
              "hrs": result[i].args._hoursPaidFor.toNumber()
             };
          }
          var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
          var td3 = document.createElement("td");
          var td4 = document.createElement("td");
          td1.appendChild(document.createTextNode(accountsDB[result[i].args._gpc]));
          td2.appendChild(document.createTextNode(accountsDB[result[i].args._wager]));
          td3.appendChild(document.createTextNode(result[i].args._hoursPaidFor));
          td4.appendChild(document.createTextNode(result[i].args._amount));
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          moneySuppliedToWagerTable.appendChild(tr);
          
        }
        self.loadSummary();
      } else {
        console.log(error);
      }
    });
	
	  var event24 = paymentGlobal.PaymentConfirmedByWager({}, {fromBlock: 0, toBlock: 'latest'});
    event24.get(function(error, result){
      if (!error) {
        // var foodAddedToStockLog = document.getElementById("food-added-to-stock-log");
        var paymentConfirmedWager = document.getElementById("payment-confirmed-by-wager-table");
        // events from 0 to last but one
        document.getElementById("load-1").style.display = "none";
		    var transaction_no=1;
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].args._wager);
		      var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          var td4 = document.createElement("td");
		      td1.appendChild(document.createTextNode(accountsDB[result[i].args._wager]));
		      td4.appendChild(document.createTextNode(result[i].args._balance));
		      tr.appendChild(td1);
          tr.appendChild(td4);
		      paymentConfirmedWager.appendChild(tr);

        }
        // window.LogsApp.registerEvent();
      } else {
        console.log(error);
      }
    });
	
	},
	
	//----------------------------------------------------
	loadSummary: function() {
    var self = this;
    var summary1Table = document.getElementById("summary1-table");
    var summary2Table = document.getElementById("summary2-table");
    var summary3Table = document.getElementById("summary3-table");

    console.log(governmentStock);
    console.log(gpcStock);
    console.log(customerStock);

    
	var totalSuppliedByGov=0;
	for (var gpc in gpcStock){
		totalSuppliedByGov += gpcStock[gpc];
	}
  for (var money in governmentStock) {
    if (governmentStock.hasOwnProperty(money)) {
		    var remainingforGov =governmentStock[money]-totalSuppliedByGov;
	       //alert(remainingforGov);
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
		    var td3 = document.createElement("td");
        td1.appendChild(document.createTextNode("Government"));
        td2.appendChild(document.createTextNode(governmentStock[money]));
		    td3.appendChild(document.createTextNode(remainingforGov));
        tr.appendChild(td1);
        tr.appendChild(td2);
		    tr.appendChild(td3);
        summary1Table.appendChild(tr);
        
    }
  }
    
	
  for (var gpc in gpcStock) {
	  var remainingforGpc=gpcStock[gpc];
	  for(var wag in customerStock){
		  if(customerStock[wag].hasOwnProperty(gpc)){
			   //alert("hello");
			  remainingforGpc -= customerStock[wag][gpc]["amount"];
		  }
	  }
	  if (gpcStock.hasOwnProperty(gpc)) {
      var tr1 = document.createElement("tr");
      var td1 = document.createElement("td");
		  var td2 = document.createElement("td");
		  var td3 = document.createElement("td");
        //td1.setAttribute("colspan", "2");
        //tr1.setAttribute("class", "table-info");
      td1.appendChild(document.createTextNode(accountsDB[gpc]));
		  td2.appendChild(document.createTextNode(gpcStock[gpc]));
		  td3.appendChild(document.createTextNode(remainingforGpc));
		  tr1.appendChild(td1);
		  tr1.appendChild(td2);
		  tr1.appendChild(td3);
      summary2Table.appendChild(tr1);
        
    }
  }
  for (var cust in customerStock) {
    if (customerStock.hasOwnProperty(cust)) {
        
        var tr1 = document.createElement("tr");
        var td1 = document.createElement("td");
		    var td2 = document.createElement("td");
		    td1.appendChild(document.createTextNode(accountsDB[cust]));
		    for (var gpc in customerStock[cust]){
			    if (customerStock[cust].hasOwnProperty(gpc)){
				    td2.appendChild(document.createTextNode(customerStock[cust][gpc]["amount"]));
			    }
		    }
		
		    tr1.appendChild(td1);
		    tr1.appendChild(td2);
		    summary3Table.appendChild(tr1);
        
    }
  }

    // summaryDiv3.appendChild(cDiv);

  document.getElementById("load-4").style.display = "none";
	
},
  
}

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    console.warn("No web3 detected. Falling back to http://localhost:8080. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
  }

  LogsApp.logStart();
});
