import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

let todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    classId: String,
    createdOn: { type: Date, default: Date.now }
});
const todoModel = mongoose.model('todos', todoSchema);

const app = express()
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
// send todo
app.post('/todo', (req, res) => {
    console.log(req.body.text);
    todoModel.create({ text: req.body.text }, (err, saved) => {
        if (!err) {
            console.log("jaraha", saved)
            res.send({
                message: "your todo is saved"
            })
        } else {
            console.log(err);
            res.status(500).send({
                message: "server error"
            })
        }
    })
})
// get all todos
app.get('/todos', (req, res) => {

    todoModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "here is you todo list",
                data: data

            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})
// delete single todo
app.delete('/todo/:id', (req, res) => {

    todoModel.deleteOne({ _id: req.params.id }, (err, data) => {
        if (!err) {
            res.send({
                message: "your todo is deleted"
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

// delete all todos
app.delete('/todos', (req, res) => {

    mongoose.connection.db.dropCollection('todos', function (err, result) {
        if (!err) {
            res.send({
                message: "all todo is deleted"
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

// start server
app.listen(port, () => {
    console.log(`Server app is listening on port ${port}`)
})


/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://dbuser:dbpassword@cluster0.flvokf8.mongodb.net/myDatabase?retryWrites=true&w=majority    ';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
