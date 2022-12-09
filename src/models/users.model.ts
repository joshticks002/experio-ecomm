import ModelService from "../services/model.service"
const userDatabase = require('../../users.json')

const userModel = new ModelService(userDatabase, "./users.json")

export default userModel;