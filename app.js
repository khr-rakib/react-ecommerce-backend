require('dotenv').config()
const fs = require('fs')
const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


// app 
const app = express()

// database
mongoose.connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log('database connected'))

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
// if (process.env.NODE_ENV === 'development') {
//     app.use(cors({origin: `${process.env.CLIENT_URL}`}))
// }

// routes
fs.readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)))


// port + listen
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log('server is running on port ' + port)
})