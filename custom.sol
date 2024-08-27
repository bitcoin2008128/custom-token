// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract customToken is ERC20 {
    string public tokenName;
    string public tokenSymbol;
    address public admin;
    uint public taxValue;
    mapping(address => bool) Roles;

    constructor(string memory _name, string memory _symbol, uint supply) ERC20(_name, _symbol) {
        tokenName = _name;
        tokenSymbol = _symbol;
        admin = msg.sender;
        _mint(msg.sender, supply * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 9;
    }

     function setRole(address account,bool isadmin) public {
        require(msg.sender==admin,"only admin can set the role");
        Roles[account]=isadmin;
    }

    function removeRole(address account) public {
        require(msg.sender == admin, "Only admin can remove the role");
        Roles[account] = false;
    }

    function setTax(uint _taxValue) public {
        require(msg.sender == admin, "Only admin can set the tax value");
        taxValue = _taxValue;
    }

    function getTaxValue() public view returns (uint) {
        return taxValue;
    }

    function isAdmin(address account) public view returns (bool) {
        return Roles[account];
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function setName(string memory _name) public {
        require(msg.sender == admin, "Only admin can change the name");
        tokenName = _name;
    }

    function setSymbol(string memory _symbol) public {
        require(msg.sender == admin, "Only admin can change the symbol");
        tokenSymbol = _symbol;
    }

    function showName() public view returns (string memory) {
        return tokenName;
    }

    function showSymbol() public view returns (string memory) {
        return tokenSymbol;
    }

    function transfer(address recipient, uint amount) public override returns (bool) {
    uint burnAmount = amount * taxValue / 100; 
    uint transferAmount = amount - burnAmount; 

    _burn(_msgSender(), burnAmount); 
    return super.transfer(recipient, transferAmount);
}


    function transferFrom(address sender, address recipient, uint amount) public override returns (bool) {
        uint burnAmount = amount * taxValue / 100;
        _burn(sender, burnAmount);
        return super.transferFrom(sender, recipient, amount - burnAmount);
    }
}
