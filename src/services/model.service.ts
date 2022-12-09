const { generateId, writeToFile } = require("../utils/utils");

interface Finder {
    id?: number;
    email?: string;
}

class ModelService {
    private Model: any[];
    private Path: string;

    constructor(model: any[], path: string) {
        this.Model = model
        this.Path = path
    }

    async find() {
        return new Promise((resolve, reject) => {
            resolve(this.Model)
        })
    }

    async findOne(query: Finder) {
        return new Promise((resolve, reject) => {
            const key = Object.keys(query)[0]
            const value = Object.values(query)[0]

            const response = this.Model.find(data => data[key] === value)
            if (response) {
                resolve(response)
            } else {
                resolve(false)
            }
        })
    }

    async create(data: Record<string, any>) {
        return new Promise((resolve, reject) => {
            const id = generateId(this.Model)
            const dataToSave = { id, ...data }
            this.Model.push(dataToSave)

            writeToFile(this.Path, this.Model)
            resolve(dataToSave)
        })
    }

    async update(query: { id: number }, target: Record<string, any>) {
        return new Promise((resolve, reject) => {
            const id = Object.values(query)[0]
            const dataIndex = this.Model.findIndex((data) => data.id === id)

            if (dataIndex === -1) {
                resolve(false)
            } else {
                this.Model[dataIndex] = {...target}

                writeToFile(this.Path, this.Model)
                resolve(this.Model[dataIndex])
            }
        })
    }

    async remove(query: { id: number }) {
        return new Promise((resolve, reject) => {
            const id = Object.values(query)[0]
            this.Model = this.Model.filter((data) => data.id !== id)

            writeToFile(this.Path, this.Model)
            resolve(true)
        })
    }
}

export default ModelService;