"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelService {
    constructor(model, path) {
        this.Model = model;
        this.Path = path;
    }
    async find() {
        return new Promise((resolve, reject) => {
            resolve(this.Model);
        });
    }
    async create(data) {
    }
}
exports.default = ModelService;
