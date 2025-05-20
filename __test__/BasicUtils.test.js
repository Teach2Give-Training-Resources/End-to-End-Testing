"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicUtils_1 = require("../src/BasicUtils");
describe("BasicUtils test suite ", () => {
    it("should return the product of 3 and 2 ", () => {
        const actual = (0, BasicUtils_1.product)(3, 2);
        expect(actual).toBe(6);
    });
});
