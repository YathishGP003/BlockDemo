const {Blcokchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('9784be217d10730f2ecf9d75812f56c4c6903b0020081f4cc8c976daa2f6408a');
const myValletAddress = myKey.getPublic('hex');

let savjeeCoin = new Blcokchain();

const txt1 = new Transaction(myValletAddress, 'public key goes here', 10);
txt1.signTransaction(myKey);
savjeeCoin.addTransaction(txt1);

//savjeeCoin.createTransaction(new Transaction('address1', 'address2', 100));
//savjeeCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner....');
savjeeCoin.minePendingTransaction(myValletAddress);

console.log('\n Balance of xavier is', savjeeCoin.getBalanceOfAddress(myValletAddress));

savjeeCoin.chain[1].transaction[0].amount = 1;

console.log('Is chain valid?', savjeeCoin.isChainValid());

//console.log('\n Starting the miner again....');
//savjeeCoin.minePendingTransaction('xaviers-address');
//console.log('\n Balance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));
//console.log('Mine Block 1... ');
//savjeeCoin.addBlock(new Block(1, "28/12/2023", { amount : 4 }));
//console.log('Mine Block 2... ');
//savjeeCoin.addBlock(new Block(2, "30/12/2023", { amount : 10 }));

//console.log('Is blockchain valid ? ' + savjeeCoin.isChainValid());
//console.log(JSON.stringify(savjeeCoin, null, 4));