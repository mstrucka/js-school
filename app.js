import express from 'express'
import fetch from 'node-fetch'
import swaggerJSDoc from 'swagger-jsdoc'  
import swaggerUI from 'swagger-ui-express'
import fs from 'fs/promises'
import yaml from 'js-yaml'

// exercise for parsing
const json_data = await fs.readFile('text.json', {encoding: 'utf8'});
const xml_data = await fs.readFile('text.xml', {encoding: 'utf8'});
const yml_data = await fs.readFile('text.yml', {encoding: 'utf8'});

console.log(json_data);
console.log(xml_data);
console.log(yml_data);

const app = express()

// swagger docs generation
const swaggerOptions = {  
    swaggerDefinition: {  
        info: {  
            title:'Current date as a timestamp API'
        }  
    },  
    apis:['app.js'],  
}  
const swaggerDocs = swaggerJSDoc(swaggerOptions);  
app.use('/docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));  

// endpoints for retrieving file contents + their swagger docs 
/** 
 * @swagger 
 * /yml: 
 *   get: 
 *     description: Get Content of a yaml file 
 */
app.get("/yml", async (req, res) => {
    res.json(yaml.load(yml_data))
})
/** 
 * @swagger 
 * /xml: 
 *   get: 
 *     description: Get Content of an xml file
 */
app.get("/xml", async (req, res) => {
    res.json(xml_data)
})
/** 
 * @swagger 
 * /json: 
 *   get: 
 *     description: Get Content of a json file
 */
app.get("/json", async (req, res) => {
    res.json(json_data)
})
// timestamp endpoint + swagger info 

/** 
 * @swagger 
 * /timestamp: 
 *   get: 
 *     description: Get Current Timestamp 
 */  
app.get("/timestamp", (req, res) => {
    res.send(new Date())
})

// Python timestamp endpoint + swagger info

/** 
 * @swagger 
 * /python/timestamp: 
 *   get: 
 *     description: Get Timestamp From Python server  
 *   
 */ 
app.get("/get/timestamp", async (req, res) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/timestamp")
        const dateObject = new Date(await response.json())
        res.send(dateObject.toString())
    } catch (err) {
        console.log('Python server response failed')
    }
})

app.listen(3000, () => {
	console.log(`Current date as a timestamp API listening on port 3000`)
})