import { describe, it, expect } from "vitest";
import {
  transformParam,
  negated,
  plus,
  minus,
  multiply,
  min,
  max,
  equals,
  dividedBy,
  percentage,
  round,
  abs,
  toFixed,
} from "../operation";

describe("operation utils", () => {
  describe("transformParam", () => {
    it("should handle null/undefined values", () => {
      expect(transformParam(null).toString()).toBe("0");
      expect(transformParam(undefined).toString()).toBe("0");
    });
  });

  describe("negated", () => {
    it("should negate a number", () => {
      expect(negated(5).toString()).toBe("-5");
    });
  });

  describe("plus", () => {
    it("should add two numbers", () => {
      expect(plus(5)(3).toString()).toBe("8");
    });
  });

  describe("minus", () => {
    it("should subtract two numbers", () => {
      expect(minus(5)(3).toString()).toBe("2");
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      expect(multiply(5)(3).toString()).toBe("15");
    });
  });

  describe("min", () => {
    it("should find minimum value", () => {
      expect(min(5, 3, 8).toString()).toBe("3");
    });
  });

  describe("max", () => {
    it("should find maximum value", () => {
      expect(max(5, 3, 8).toString()).toBe("8");
    });
  });

  describe("equals", () => {
    it("should compare two numbers", () => {
      expect(equals(5)(5)).toBe(true);
      expect(equals(5)(3)).toBe(false);
    });
  });

  describe("dividedBy", () => {
    it("should handle division by zero", () => {
      expect(dividedBy(5)(0).toString()).toBe("0");
    });

    it("should divide two numbers", () => {
      expect(dividedBy(6)(2).toString()).toBe("3");
    });
  });

  describe("percentage", () => {
    it("should convert to percentage", () => {
      expect(percentage(0.5).toString()).toBe("50");
    });
  });

  describe("round", () => {
    it("should round a number", () => {
      expect(round(5.6).toString()).toBe("6");
    });
  });

  describe("abs", () => {
    it("should return absolute value", () => {
      expect(abs(-5).toString()).toBe("5");
    });
  });

  describe("toFixed", () => {
    it("should format number with fixed decimal places", () => {
      expect(toFixed(5.678)(2)).toBe("5.67");
    });
  });
});
