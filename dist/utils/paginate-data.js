"use strict";
/**
 * @description recieves a number argument to yield a offset and limit values
 * @param {Number} page_no query params
 * @return {Object} { startIndex, endIndex }
 */
Object.defineProperty(exports, "__esModule", { value: true });
const listRange = (page_no) => {
    const page = Number(page_no);
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return {
        startIndex,
        endIndex,
    };
};
exports.default = listRange;
