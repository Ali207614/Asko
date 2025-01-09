let express = require('express')
let cookieParser = require('cookie-parser')
let cors = require('cors')
var bodyParser = require("body-parser");
const { connectDB, connectHana } = require('./config');
const router = require('./router');
const errorMiddleware = require('./middlewares/errorMiddleware');


const app = express()
const port = process.env.port || 5001;


app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('C:\\FOTO SAP'))

connectDB()
connectHana()

app.use(router);
app.use(errorMiddleware);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})