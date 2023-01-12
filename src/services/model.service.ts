const { generateId, writeToFile } = require("../utils/utils");

interface Finder {
  id?: number;
  email?: string;
}

class ModelService {
  private Model: any[];
  private Path: string;

  constructor(model: any[], path: string) {
    this.Model = model;
    this.Path = path;
  }

  async find(
    query: Record<any, string>,
    page: { startIndex: number; endIndex: number }
  ) {
    return new Promise((resolve, reject) => {
      let name = "";
      const keys = Object.keys(query);

      if (!keys.length)
        resolve(this.Model.slice(page.startIndex, page.endIndex));
      let arr: any[] = this.Model;

      for (const key of keys) {
        if (key !== "name" && key !== "rating") {
          arr = arr.filter(
            (prod) =>
              prod[key].toLocaleLowerCase() == query[key].toLocaleLowerCase()
          );
        } else if (key === "rating") {
          arr = arr.filter(
            (prod) => prod[key] >= Math.floor(Number(query[key]))
          );
        } else {
          name = query[key];
        }
      }

      if (name) {
        for (const el in arr) {
          const productName = arr[el].name;
          if (!productName.includes(name)) arr.splice(Number(el), 1);
        }
      }

      resolve(arr.slice(page.startIndex, page.endIndex));
    });
  }

  async findOne(query: Finder) {
    return new Promise((resolve, reject) => {
      const key = Object.keys(query)[0];
      const value = Object.values(query)[0];

      const response = this.Model.find((data) => data[key] === value);
      if (response) {
        resolve(response);
      } else {
        resolve(false);
      }
    });
  }

  async create(data: Record<string, any>) {
    return new Promise((resolve, reject) => {
      const id = generateId(this.Model);
      const dataToSave = { id, ...data };
      this.Model.push(dataToSave);

      writeToFile(this.Path, this.Model);
      resolve(dataToSave);
    });
  }

  async update(query: { id: number }, target: Record<string, any>) {
    return new Promise((resolve, reject) => {
      const id = Object.values(query)[0];
      const dataIndex = this.Model.findIndex((data) => data.id === id);

      if (dataIndex === -1) {
        resolve(false);
      } else {
        this.Model[dataIndex] = { ...target };

        writeToFile(this.Path, this.Model);
        resolve(this.Model[dataIndex]);
      }
    });
  }

  async remove(query: { id: number }) {
    return new Promise((resolve, reject) => {
      const id = Object.values(query)[0];
      this.Model = this.Model.filter((data) => data.id !== id);

      writeToFile(this.Path, this.Model);
      resolve(true);
    });
  }

  async count(): Promise<number> {
    return new Promise((resolve, reject) => {
      resolve(this.Model.length);
    });
  }
}

export default ModelService;
