import { expect } from "chai";
import { ValidationError } from "joi";
import { validate } from "../../../src/lib/sms/validate";

describe.only("validate SMS", () => {
  describe.only("phone validation", () => {
    it("case #1: should return if there is no validation errors", async () => {
      const input = {
        to: ["+2001145244274", "+12124567890"],
        message: "Welcome Ahmed, your verification number is '256847'"
      };
      const data = validate(input);
      expect(JSON.stringify(data)).to.be.eq(JSON.stringify(input));
    });
  
    it("case #2: should return Error if phone not in International format", async () => {
      const input = {
        to: ["01145244274"],
        message: "Welcome Ahmed, your verification number is '256847'"
      };
      
      expect(() => validate(input)).to.throws(ValidationError, "\"to[0]\" contains an invalid value");
    });
  
    it("case #3: should return Error if phone not in correct format", async () => {
      const input = {
        to: ["+2002245244274"], // 022 not a valid Egyptian number
        message: "Welcome Ahmed, your verification number is '256847'"
      };
      
      expect(() => validate(input)).to.throws(ValidationError, "\"to[0]\" contains an invalid value");
    });

    it("case #3: should return Error if phone array is empty or null", async () => {
      const input = {
        to: [], 
        message: "Welcome Ahmed, your verification number is '256847'"
      };
      const input2 = {
        message: "Welcome Ahmed, your verification number is '256847'"
      };
      expect(() => validate(input)).to.throws(ValidationError, "\"to\" does not contain 1 required value(s)");
      expect(() => validate(input2)).to.throws(ValidationError, "\"to\" is required");
    });
  });

  describe.only("message validation", () => {
    it("case #1: should return Error if message is empty or null", async () => {
      const input = {
        to: ["+2001145244274"]
      };
      expect(() => validate(input)).to.throws(ValidationError, "\"message\" is required");
    });

    it("case #2: should return if message size is less than 10 letters", async () => {
      const input = {
        to: ["+2001145244274"],
        message: "Welcome"
      };
      expect(() => validate(input)).to.throws(ValidationError, "\"message\" length must be at least 10 characters long");
    });
  });
});
