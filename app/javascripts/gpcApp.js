// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

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
		//web3.eth.defaultAccount = web3.eth.accounts[0];
      accounts = accs;
      governmentAddress = accounts[0];
      
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
          return user.getBalance.call(addr, {from:governmentAddress, gas: 200000});
        }).then(function(res){
          console.log(res.valueOf());
          alert(res.valueOf());
        }).catch(function(e){
          console.log(e);
        });
      }
  },
  
  supplyToWager: function(){
    var self = this;
    var user;
    var gpc = document.getElementById('gpc_addr1').value;
    var wager = document.getElementById('wager_addr').value;
    var gpc_addr1 = accounts[gpc];
    var wager_addr1 = accounts[wager];
    
    Transaction.deployed().then(function(instance){
        user =instance; 
        return user.payToWager(wager_addr1,gpc_addr1,{from: governmentAddress, gas:250000});
      }).then(function(res){
        console.log(res.valueOf());
		    alert("Success!!");
      }).catch(function(e){
        console.log(e);
      });
  },
  supplyToWager_hash: function(){
    var self = this;
    var user;
    var gpc = document.getElementById('gpc_addr2').value;
    var wager = document.getElementById('wager_address').value;
	  var transferHash = document.getElementById('hash').value;
    var gpc_addr1 = accounts[gpc];
    var wager_addr1 = accounts[wager];
	  var elems =document.getElementsByTagName("input");
	  for ( var i = elems.length; i--; ) {
		  elems[i].value = ""; 
    }
    Transaction.deployed().then(function(instance){
        user =instance; 
        return user.payToWager_Hash(wager_addr1,gpc_addr1,transferHash,{from: governmentAddress, gas:250000});
    }).then(function(res){
      console.log(res.valueOf());
		  alert("Success!!");
    }).catch(function(e){
      console.log(e);
    });

  },
  confirm_supplyToGPC: function(){
    var self = this;
    var user;
    var id = document.getElementById('proj_id').value;
	  var gpc = document.getElementById('gpc_addr1').value;
	  var transferHash = prompt("Enter your secret key:");
    if(transferHash!=null){
	    var gpc_addr2 = accounts[gpc];
      var elems =document.getElementsByTagName("input");
	    for ( var i = elems.length; i--; ) {
		    elems[i].value = ""; 
      }
      Transaction.deployed().then(function(instance){
        user =instance; 
        return user.confirm_govSupplyToGpc_Hash(id,gpc_addr2,transferHash,{from: governmentAddress, gas:250000});
      }).then(function(res){
        console.log(res.valueOf());
		    alert("Success!!");
      }).catch(function(e){
        console.log(e);
      });
	  }
  },
  setTimeworked: function(){
    var self=this;
    var user;
    var addr_no =document.getElementById('wager_addr').value;
    var days1 =document.getElementById('days1').value;
    var hours1 = document.getElementById('hours1').value;
	
    if(addr_no!=null && days1!=null && hours1!=null){
      var addr =accounts[addr_no];
	    var elems =document.getElementsByTagName("input");
	    for ( var i = elems.length; i--; ) {
		    elems[i].value = ""; 
      }
      Transaction.deployed().then(function(instance){
        user =instance; 
        return user.timeWorked(addr,days1,hours1,{from: governmentAddress, gas:250000});
      }).then(function(res){
        alert("Success!!");
        console.log(res.valueOf());
      }).catch(function(e){
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
    // console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    console.warn("No web3 detected. Falling back to http://localhost:8080. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
  }

  // cal start funtion
  App.start();
});
