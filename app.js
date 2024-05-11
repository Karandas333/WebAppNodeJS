require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT;
const mongoose = require('mongoose');

const userModel = require('./models/user');

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(error);
    process.exit(1);
  }
}

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/read',async function (req, res) {
  let users = await userModel.find();
  res.render('read',{users})
});

app.get('/edit/:userid',async function (req, res) {
  let user = await userModel.findOne({_id:req.params.userid});
  res.render('edit',{user})
});

app.post('/update/:userid', async function (req, res) {
  let { name, email, image } = req.body;

  let user = await userModel.findOneAndUpdate({_id: req.params.userid},{name,email,image},{new:true});
  res.redirect('/read')
});

app.get('/delete/:id',async function (req, res) {
  await userModel.findOneAndDelete({_id:req.params.id});
  res.redirect('/read')
});

app.post('/create',async (req, res) => {
  let { name, email, image } = req.body;

  let createdUser = await userModel.create({
    name,
    email,
    image
  });
  res.redirect('/read');
});


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
})