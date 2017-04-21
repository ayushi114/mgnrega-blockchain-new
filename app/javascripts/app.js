// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import transaction_artifacts from '../../build/contracts/Transactions.json'

var Transaction = contract(transaction_artifacts);


var accounts;
var governmentAddress;
var transactionGlobal;
window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Transaction.setProvider(web3.currentProvider);
    Transaction.deployed().then(function(instance){
        transactionGlobal = instance;
    });
    // Get the initial account balance so it can be displayed.
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
      governmentAddress = accounts[0];
      
    });
  },
  initializeGovBal: function(){
    var self = this;
	
    var govAddr = governmentAddress;
    var userx;
	  var budget = document.getElementById('gov_budget').value;
	  document.getElementById('gov_budget').value = "";
    Transaction.deployed().then(function(instance){
        userx = instance;
        //return bal.initializeGov(govAddr);
		    //alert("hello");
        return userx.addBudget(budget, {from:governmentAddress, gas: 100000});
		    //alert("hello");
	  }).then(function(res){
	    console.log(res.valueOf());
	       //alert("Success");
	  }).catch(function(e){
		    //alert("Success");
		  console.log(e);
      
    });

  },
  
  getBal: function(){
      var self=this;
      var addr = prompt("Please enter address of account");
      if(addr!=null){
        var addr =accounts[addr];
        var user;
        Transaction.deployed().then(function(instance){
        user = instance;
        //return bal.initializeGov(govAddr);
        return user.getBalance.call(addr, {from:governmentAddress, gas: 200000});
        }).then(function(res){
          console.log(res.valueOf());
          alert(res.valueOf());
        }).catch(function(e){
          console.log(e);
        });
      }
  },
  
  addProjectToGov: function(){
    var self = this;
    var user;
	  var id = document.getElementById('id2').value;
    var gpc = document.getElementById('gpc_addr2').value;
    var noOfDays = document.getElementById('days2').value;
	  var budget = document.getElementById('budget').value;
	  var noOfWager = document.getElementById('wagers2').value;
	  if(noOfWager != null && budget != null && noOfDays !=null && gpc !=null){
      var gpc_addr1 = accounts[gpc];
      var elems =document.getElementsByTagName("input");
	    for ( var i = elems.length; i--; ) {
		    elems[i].value = ""; 
      }
      Transaction.deployed().then(function(instance){
        user =instance; 
        return user.addProjectToGov(id,gpc_addr1,noOfDays,noOfWager,budget,{from: governmentAddress, gas:250000});
      }).then(function(res){
        console.log(res.valueOf());
		    alert("Project Successfully Added!!");
      }).catch(function(e){
		    alert("Failure!!");
        console.log(e);
      });
	  }
  },
  
 
  
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
