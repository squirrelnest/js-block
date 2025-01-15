const SHA256 = require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    constructor (timestamp, transactions, data, previousHash='') {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.data = data
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        
        console.log("Block mined: " + this.hash)
        console.log("nonce: " + this.nonce)
    }
}

class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block("01/01/2025", "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]

        console.log("Block Successfully Mined")
        this.chain.push(block)
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount
                }
                if (trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log("\ncurrent hash is not equal")
                console.log("currentBlock.hash: ", currentBlock.hash)
                console.log("currentBlock.calculateHash: ", currentBlock.calculateHash())
                return false
            } 

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("\nBlock " + i + ": previous hash is not equal")
                console.log("currentBlock.previousHash: ", currentBlock.previousHash)
                console.log("previousBlock.hash: ", previousBlock.hash)
                return false
            }
        }

        return true
    }
}

let ourCrypto = new Blockchain()

ourCrypto.createTransaction(new Transaction("address1", "address2", 100))
ourCrypto.createTransaction(new Transaction("address1", "address2", 50))

console.log("Starting the miner...")

ourCrypto.minePendingTransactions("our-address")

console.log("Balance is: " + ourCrypto.getBalanceOfAddress("our-address"))

console.log("\nMining a second time...")

ourCrypto.minePendingTransactions("our-address")

console.log("New balance is: " + ourCrypto.getBalanceOfAddress("our-address"))

console.log(JSON.stringify(ourCrypto, null, 4))
console.log("Is blockchain valid? " + ourCrypto.isChainValid())

/*
console.log("Mining block 1...")
ourCrypto.addBlock(new Block(1, "01/05/2025", { amount: 7 }))
console.log("Mining block 2...")
ourCrypto.addBlock(new Block(1, "01/06/2025", { amount: 8 }))
*/

/*
ourCrypto.addBlock(new Block(1, "01/02/2025", { amount: 4 }))
ourCrypto.addBlock(new Block(2, "01/03/2025", { amount: 10 }))

console.log(JSON.stringify(ourCrypto, null, 4))
console.log("Is blockchain valid? " + ourCrypto.isChainValid())

ourCrypto.chain[1].data = { amount: 100 }
ourCrypto.chain[1].hash = ourCrypto.chain[1].calculateHash()

console.log(JSON.stringify(ourCrypto, null, 4))
console.log("Is blockchain valid? " + ourCrypto.isChainValid())
*/