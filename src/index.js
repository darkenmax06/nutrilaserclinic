require("dotenv").config()
const cors = require("cors")
const express = require("express");
const sendEmail = require("./sendEmail")

const app = express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hola mundo")
})

app.post("/",(req,response)=>{
    const {name,number,service,date} = req.body
    console.log(req.body)

    if (!name) res.status(400).json({message: "El nombre es necesario para rellenar la solicitud"})
    if (!number) res.status(400).json({message: "El numer es necesario para rellenar la solicitud"})
    if (!service) res.status(400).json({message: "El servicio es necesario para rellenar la solicitud"})
    if (!date) res.status(400).json({message: "La fecha de reservacion es necesario para rellenar la solicitud"})


    sendEmail({name,number,service,date})
    .then(res =>{
        response.status(200).json({message: "Cita enviada"})
    })
    .catch(err => {
        console.log(err)
        response.status(400).json({message: err.message})
    })
})

const port = 3000

app.listen(port,()=>{
    console.log("server online")
})