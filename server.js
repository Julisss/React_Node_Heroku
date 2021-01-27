const express = require('express')
const cors = require('cors')
const path = require('path');
const mysql = require('mysql');
const app = express();



// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000', 'http://localhost:8080', ''];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

const conn = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'todo_list',
    password: ''
})


// conn.connect(err => {
//     if(err){
//         console.log(err)
//         return err
//     } else {
//         console.log('Database --- ok')
//     }
// })

app.use(express.json())


// GET
app.get('/', (req, res) => {
    let query = "SELECT * from items";

    conn.query(query, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.status(200).json(result)
        }
    })

})
// POST
app.post('/', (req, res) => {
    const {text} = req.body;
    const {id} = req.body;

    const item = {
        id,
        text
    }

    let query = `INSERT into items(id, text)values('${id}', '${text}')`;
    conn.query(query, (err, result) => {
        if(err){
            console.log(err)
        } else {
            console.log('1 item added')
        }
    })
    res.status(201).json(item);
})

// DELETE
app.delete('/:id', (req, res) => {
    console.log(req.params.id)
    let query = `DELETE from items WHERE id = '${req.params.id}'`;
    conn.query(query, (err, result) => {
        if(err){
            console.log(err)
        } else {
            console.log('1 item delete')
            res.status(200).json(true)
        }
    })
    
})

// PUT
app.put('/:id', (req, res) => {
    let {text} = req.body;
    console.log(req.body)
    let query = `UPDATE items SET text = '${text}' WHERE id = '${req.params.id}'`;
    conn.query(query, (err, result) => {
        if(err){
            console.log(err)
        } else {
            console.log('1 item updated')
            res.status(200).json('updated')
        }
    })
})


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'todo-list/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'todo-list/build', 'index.html'));
    });
  }

app.listen(3000, () => console.log('Served has been started on port 3000'));