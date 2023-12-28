require("@nomicfoundation/hardhat-toolbox");

task("check-gas", "Checks the gas cost for storing data")
    .addParam("data", "The data to be sent as a hex string")
    .setAction(async (taskArgs, hre) => {
        const GasTest = await hre.ethers.getContractFactory("GasTest");
        const gasTest = await GasTest.deploy();

        function toHexString(str) {
            let hexString = '';
            for (let i = 0; i < str.length; i++) {
                hexString += str.charCodeAt(i).toString(16);
            }
            return hexString;
        }
        const data = '0x' + toHexString(taskArgs.data);
        
        // データをバイト列にして、コントラクト引数に渡す
        const tx1 = await gasTest.calldataBytes(data);
        const receipt1 = await tx1.wait();
        console.log(`Gas used with smart contract: ${receipt1.gasUsed.toString()}`);

        // データをアドレスの配列にして、コントラクト引数に渡す
        const addresses = [];
        const dataWithoutPrefix = data.substring(2);
        for (let i = 0; i < dataWithoutPrefix.length; i += 40) {
          const address = dataWithoutPrefix.substring(i, i + 40).padEnd(40, '0');
          addresses.push(hre.ethers.getAddress('0x' + address));
        }
        const tx2 = await gasTest.calldataAddresses(addresses);
        const receipt2 = await tx2.wait();
        console.log(`Gas used with smart contract for addresses: ${receipt2.gasUsed.toString()}`);

        // データをアドレスの配列にして、コントラクト引数に渡し、さらに 1 wei を送金する
        const tx3 = await gasTest.calldataAddressesAndSendingWei(addresses, { value: addresses.length });
        const receipt3 = await tx3.wait();
        console.log(`Gas used with smart contract for addresses and sending wei: ${receipt3.gasUsed.toString()}`);

        // データをバイト列にして、トランザクションに直接のせる
        const signer = (await hre.ethers.getSigners())[0];
        const directTx = {
            to: gasTest.address,
            data,
        };
        const directReceipt = await signer.sendTransaction(directTx);
        const finalReceipt = await directReceipt.wait();
        console.log(`Gas used with direct transaction: ${finalReceipt.gasUsed.toString()}`);
    });

module.exports = {
  solidity: "0.8.19",
};
