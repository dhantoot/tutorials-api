const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dayjs = require('dayjs');

const { uuid } = require('uuidv4');
const port = process.env.PORT || 3000;

// apply middlewares for express
app.use(cors());
app.use(morgan('dev'));

// Cookies
app.use(cookieParser());

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

let appleList = [];

// localhost:8080/
app.get('/', (req, res) => res.send('Hello World!'));


// localhost:8080/api/tutorials
app.get('/api/tutorials', (req, res) => {
    console.log('req.query', req.query);
    const { query } = req;
    if (!query.title) {
        //get all
        return res.send(appleList)
    } else {
        //get by searchkey: title
        const filtered = appleList.filter(e => {
            return e.title == query.title;
        });
        return res.send(filtered);
    }
});

app.get('/api/tutorials/:id', (req, res) => {
    console.log(req.params);
    const {id } = req.params;
    let foundItem = appleList.find(e => e.id==id);
    console.log({foundItem})
    return res.send(foundItem);
});

app.post('/api/tutorials', (req, res) => {
    let { body } = req;
    body.id = uuid();
    appleList.push(body);
    return res.send(body.id);
});

app.put('/api/tutorials/:id', (req, res) => {
    const { id } = req.params;
    let { body } = req;
    console.log('req.params', req.params)
    console.log({
        body,
        id
    });
    const appleIndexToUpdate = appleList.map(e => e.id).indexOf(id);
    body.id = id;
    appleList[appleIndexToUpdate] = body;
    return res.send(body);
});

//delete one
app.delete('/api/tutorials/:id', (req, res) => {
    const { id } = req.params;
    const appleIndexToUpdate = appleList.map(e => e.id).indexOf(id);
    delete appleList[appleIndexToUpdate];
    return res.send(id);
});

//delete all
app.delete('/api/tutorials', (req, res) => {
    appleList = [];
    return res.send([]);
});

app.listen(port, () => console.log(`Tutorial api listening at http://localhost:${port}`))