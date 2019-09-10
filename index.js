//Invoking express
const express = require('express')
const appConfig = require('./config/config')
const fs = require('fs')

//Declaring instance or creating instance of application
const app = express()
const routesPath = "./routes"

//HTTP
const http=require('http')

//Logger
const logger=require('./libs/loggerLib')

//Invoking error handler
const errorHandler=require('./middlewares/appErrorHandler')
const routerLogger=require('./middlewares/routerLogger')

//Invoking mongoDB library
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const cookieParser=require('cookie-parser')

//Helmet
const helmet=require('helmet')

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(errorHandler.globalErrorHandler)
app.use(routerLogger.logIp)
app.use(helmet())

//Bootstrap Routes
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routesPath + '/' + file)
        route.setRoutes(app)
    }
})


const modelsPath = './models'
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file)
})
//End bootstrap route
app.use(errorHandler.globalNotFoundHandler)

const server=http.createServer(app)
//Start listening to http server
console.log(appConfig)
server.listen(appConfig.port)
server.on('error',onError)
server.on('listening',onListening)
//end server listening code

//Event listening for HTTP server "error" event

function onError(error){
    if(error.syscall !=='listen'){
        logger.error(error.code + ':elevated privileges required' , 'serverOnErrorHandler',10)
        throw error
    }

    //handle specific listen errors with friendly messages
    switch(error.code){
        case 'EACCES':
            logger.error(error.code + 'elevated priveleges required' , 'serverOnErrorHandler' , 10)
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.' , 'serverOnErrorHandler' , 10)
            process.exit(1)
            break
        default:
            logger.error(error.code + ':some unknown error occured' , 'serverOnErrorHandler' , 10)
            throw error
    }
}

//Event listner for HTTP server "listening" event
function onListening(){
    var addr = server.address()
    var bind = typeof addr === 'string'
    ? 'pipe' +addr
    : 'port' + addr.port;
    ('Listening on ' + bind)
    logger.info('server listening on port' + addr.port, 'serverOnListeningHandler' , 10)
    let db = mongoose.connect(appConfig.db.uri, {useMongoClient: true})
}

process.on('unhandledRejection', (reason, p)=>{
    console.log('Unhandled Rejection at: Promise' , p ,'reason:' ,reson)
})

//handling mongoose connection error
mongoose.connection.on('error', function (err) {
    console.log("Database connection error")
    console.log(err)
})

//handling mongoose success event
mongoose.connection.on('open', function (err) {
    if (err) {
        console.log("Database error")
        console.log(err)
    }
    else {
        console.log("Database connection open success")
    }
})





