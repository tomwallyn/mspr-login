var chai = require("chai");
var sinon = require("sinon");
var sinonTest = require("sinon-test");
var test = sinonTest(sinon);

var authentification = require("../authentification/service");

describe("Authentification service", function () {
  describe("checkIpCountry", function () {
    it(
        "return FR if ip is in France",
        test(async function () {
            result = authentification.checkIpCountry("::ffff:92.188.98.73");
            chai.expect(result.country).to.be.equal("FR");
        })
    );

    it(
        "return other pays if ip is in other country",
        test(async function () {
          result = authentification.checkIpCountry("::ffff:192.164.28.34");
          chai.expect(result.country).to.be.equal("AT");
        })
    );
  });

  describe("generateToken", function () {
    it(
        "return token with length 96",
        test(async function () {
            result = await authentification.generateToken()
            chai.expect(result).lengthOf(96);
        })
    );
  });
  
});