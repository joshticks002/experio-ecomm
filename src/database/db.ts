import fs from "fs";

const dbService = () => {
    try {
        fs.readFileSync('./products.json')
        fs.readFileSync('./users.json')
        console.log("Database connected")
    } catch (err) {
        fs.writeFileSync("./products.json", JSON.stringify([], null, 2))
        fs.writeFileSync("./users.json", JSON.stringify([], null, 2))
        console.log("Database created")
    }
}

export default dbService;