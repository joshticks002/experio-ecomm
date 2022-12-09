import ModelService from "../services/model.service"
const productDatabase = require('../../products.json')

const productModel = new ModelService(productDatabase, "./products.json")

export default productModel;