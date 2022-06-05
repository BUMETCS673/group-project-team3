const { expect } = require("chai");

const isValidPassword = password => {
    return (password.length >= 8) && containsDigit(password) &&
        containsUpperCase(password) && containsSpecialCharacter(password);
}

const containsDigit = password => {
    return !!password.match(/\d+/g)
}

const containsUpperCase = password => {
    return !!password.match(/[A-Z]+/g)
}

const containsSpecialCharacter = password => {
    return !!password.match(/[!$&:+-]+/g)
}

describe("Password", function() {
    it("should be invalid if less than 8 characters", async function() {
        expect(isValidPassword("abc")).to.be.false;
    });

    it("should be invalid if no digit found", async function() {
        expect(isValidPassword("abcdefgh")).to.be.false;
    });

    it("should be invalid if no upper case letter found", async function() {
        expect(isValidPassword("abcdefgh1")).to.be.false;
    });

    it("should be invalid if no special case letter found", async function() {
        expect(isValidPassword("abcdefgh1A")).to.be.false;
    });

    it("should be valid if all requirements fulfilled", async function() {
        expect(isValidPassword("abcdefgh1A$")).to.be.true;
    });
});