import connects from "./db/connection";
import router from "./router/routers";

const express = require('express')
const cors = require("cors");

const port = 8000 ||  process.env.PORT
const app = express()

app.use(express.json())
app.use(cors());

app.use('/',router)
connects()

app.listen(port,()=>{
    console.log(`port listining a ${port}`);
    
})

