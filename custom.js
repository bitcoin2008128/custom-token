
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('customToken', function () {
  let token;
  let admin;
  let user1;
  let user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('customToken');
    token = await Token.deploy('Test Token', 'TST', 1000000);
  });

  it('should have the correct name and symbol', async function () {
    expect(await token.name()).to.equal('Test Token');
    expect(await token.symbol()).to.equal('TST');
  });

  it('should have the correct admin address', async function () {
    expect(await token.admin()).to.equal(admin.address);
  });

  it('should allow the admin to set the tax value', async function () {
    await token.connect(admin).setTax(20);
    expect(await token.getTaxValue()).to.equal(20);
  });

  it('should not allow non-admins to set the tax value', async function () {
    await expect(token.connect(user1).setTax(10)).to.be.revertedWith('Only admin can set the tax value');
  });

  it('should allow the admin to set the token name', async function () {
    const newName = 'New';
    await token.setName(newName, { from: admin.address });
    expect(await token.showName()).to.equal(newName);
  });

  it('should not allow non-admins to set the name', async function () {
    await expect(token.connect(user1).setName('New Name')).to.be.revertedWith('Only admin can change the name');
  });

  it('should allow the admin to set the symbol', async function () {
    await token.setSymbol('NEW', { from: admin.address });
    expect(await token.showSymbol()).to.equal('NEW');
  });

  it('should not allow non-admins to set the symbol', async function () {
    await expect(token.connect(user1).setSymbol('NEW')).to.be.revertedWith('Only admin can change the symbol');
  });

  it('should allow users to transfer tokens', async function () {
    await token.transfer(user1.address, 100, { from: admin.address });
    expect(await token.balanceOf(user1.address)).to.equal(100);
  });

  it('should burn tokens on transfer', async function () {
    await token.connect(admin).setTax(3);
    await token.transfer(user1.address, 100, { from: admin.address });
    expect(await token.balanceOf(user1.address)).to.equal(97); 
  });

  it('should allow users to transfer tokens from one address to another', async function () {
    await token.connect(admin).setTax(3);
    await token.transfer(user1.address, 100, { from: admin.address });
    await token.connect(user1).transfer(user2.address, 50);
    expect(await token.balanceOf(user2.address)).to.equal(49); 
  });
});