const express = require("express")
const mongodb = require("mongodb")
const app = express()
const fs = require('fs');
const cors = require('cors')

app.use(cors()); //Permite las llamadas desde el navegador
app.use(express.json())

const connectionString = "mongodb://root:123456@localhost:27017/?authMechanism=DEFAULT"
const client = new mongodb.MongoClient(connectionString)
client.connect()
    .then(() => console.log("Database connection succeful"))
    .catch((error) => console.log(error))
const db = client.db("Restaurantes")
const repositorioDeMensajes = db.collection("mensajes")

app.get("", express.static("public"))

//guardar mensajes
app.post("/api/mensajes", (req, res, next) => {
    mensaje = req.body
    repositorioDeMensajes.insertOne(mensaje)
        .then((data) => {
            console.log(data)
            res.status(201).send({ id: data.insertedId, mensaje: "Datos registrados" })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
})

//Obtener todo los mensajes x cada restaurante
app.get("/api/restaurantes/:restaurante/mensajes", (req, res, next) => {
    const restaurante = req.params.restaurante

    repositorioDeMensajes.find({ 'restaurante': restaurante })
        .toArray()
        .then((data) => res.status(200).json(data))
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
})

const port = 8000
app.listen(port, () => {
    console.log("El servidor esta corriendo")
    console.log("http://127.0.0.1:" + port)
})