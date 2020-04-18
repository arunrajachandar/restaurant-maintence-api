const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT;
const apiRouter = require('./api/api');
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'))
app.listen(PORT,()=>{
  console.log(`Server running on ${PORT}`)
})

app.use('/api',apiRouter);

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
  }

module.exports = app;