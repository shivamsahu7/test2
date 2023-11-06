const express = require('express')
require('dotenv').config()
const connectDB = require('./config/dbConfig')
const customerRoute = require('./routes/customerRoute')
const i18n = require('./config/langConfig')
const limiter = require('./config/rateLimit')
const log = require('./config/logConfig.js')
const cors = require('cors')
const corsOptions = require('./config/corsConfig')
const allowDartUserAgent = require('./middleware/corsMiddleware')

const app = express()

app.use(limiter);
// insert log
app.use((req,res,next)=>{
    let oldSend = res.send
    res.send = function(data){
        oldSend.apply(res,arguments)
        log.info({req:req.body,res:JSON.parse(data)})
    }
    next()
})
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
// localization for multiple language
app.use(i18n.init)

// api routes
app.use('/customer',customerRoute)

// public folder with User-Agent Dart
app.use('/public',allowDartUserAgent,express.static('public'));

app.listen(3000,()=>{
    console.log('server started on port no 3000')
})