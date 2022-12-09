"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { generateId, writeToFile } = require("../utils/utils");
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
    async findOne(query) {
        return new Promise((resolve, reject) => {
            const key = Object.keys(query)[0];
            const value = Object.values(query)[0];
            const response = this.Model.find(data => data[key] === value);
            if (response) {
                resolve(response);
            }
            else {
                resolve(false);
            }
        });
    }
    async create(data) {
        return new Promise((resolve, reject) => {
            const id = generateId(this.Model);
            const dataToSave = { id, ...data };
            this.Model.push(dataToSave);
            writeToFile(this.Path, this.Model);
            resolve(dataToSave);
        });
    }
    async update(query, target) {
        return new Promise((resolve, reject) => {
            const id = Object.values(query)[0];
            const dataIndex = this.Model.findIndex((data) => data.id === id);
            if (dataIndex === -1) {
                resolve(false);
            }
            else {
                this.Model[dataIndex] = { ...target };
                writeToFile(this.Path, this.Model);
                resolve(this.Model[dataIndex]);
            }
        });
    }
    async remove(query) {
        return new Promise((resolve, reject) => {
            const id = Object.values(query)[0];
            this.Model = this.Model.filter((data) => data.id !== id);
            writeToFile(this.Path, this.Model);
            resolve(true);
        });
    }
}
exports.default = ModelService;
