const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const peopleRoutes = require('./routes/people.routes');
const coordRoutes = require('./routes/coords.routes')
const app = express()

// parse body params and attach them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));

// app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
// app.use(cors())
app.set('view engine', 'ejs');
var whitelist = ['http://localhost:3000', 'http://localhost:3001']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true };

app.use(cors(corsOptions));
// Use the below method when testing on postman
// app.use(cors());
// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', coordRoutes)
// app.use('/', storeRoutes)
// app.use('/', customersRoutes)
// app.use('/', ordersRoutes)

app.use('/', peopleRoutes);


app.listen(process.env.PORT || 5000 , (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', process.env.PORT || 5000 )
})

module.exports = app;
