const express = require('express');
const cors = require('cors');
require('dotenv').config();
const worldRouter = require('./routes/world');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //paths
        this.basePath = '/api/v1';
        this.worldPath = `${this.basePath}/world`;

        this.middlewares();
        this.routes();
    }
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }
    routes (){
        this.app.use(this.worldPath, worldRouter);
    }
    listen(){
        this.app.listen(this.port, () =>{
            console.log('listening on port ${this.port}');
        });
    }
}
module.exports = Server;