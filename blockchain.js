const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculatehash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingkey){
        if(signingkey.getPublic('hex') !== this.fromAddress){
            throw new Error('You connot sign transcation for other wallets!..');
        }

        const hashTx = this.calculatehash();
        const sig = signingkey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isvalid(){
        if(this.fromAddress === null){
            return true;
        }
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculatehash(), this.signature);

    }
}

class Block {
    constructor(timestamp, transaction, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.hash = this.calculatehash();
        this.nonce = 0;
    }

    calculatehash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculatehash();
        }
        console.log("Block mine : " +this.hash);
    }

    hasValidTrnsaction(){
        for(const tx of this.transaction){
            if(!tx.isvalid()){
                return false;
            }
        }
        return true;
    }
}

class Blcokchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("24/12/2023", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //addBlock(newBlock){
    //    newBlock.previousHash = this.getLatestBlock().hash;
    //    newBlock.mineBlock(this.difficulty);
    //    this.chain.push(newBlock);
    //}

    minePendingTransaction(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransaction.push(rewardTx); 


        let block = new Block(Date.now(), this.pendingTransaction, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block succesfully mined');
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    
    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transaction.isvalid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this. chain[i-1];

            if(currentBlock.hasValidTrnsaction()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculatehash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Blcokchain = Blcokchain;
module.exports.Transaction = Transaction;
