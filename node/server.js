 const express = require('express'); 
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cors = require('cors');

const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 1️⃣ CORS
app.use(cors({
  origin: 'https://mern-to-do-list-session-uh1d.vercel.app', // your frontend URL
  credentials: true
}));

// 2️⃣ Trust proxy for Render HTTPS
app.set('trust proxy', 1);

// 3️⃣ Sessions
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://dattatreyagokhale_db_user:MAkO0xrpeCxp3FP2@cluster0.ixnbsd0.mongodb.net/mydb?retryWrites=true&w=majority',
    collectionName: 'sessions'
  }),
  cookie: { 
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: true,           // must be HTTPS
    sameSite: 'none'        // required for cross-domain
  }
}));

// 4️⃣ MongoDB
mongoose.connect('mongodb+srv://dattatreyagokhale_db_user:MAkO0xrpeCxp3FP2@cluster0.ixnbsd0.mongodb.net/mydb?retryWrites=true&w=majority')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 5️⃣ Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}, { collection: 'user' });
const User = mongoose.model('User', userSchema);

const todoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  name: String,
  email: String
});
const Todo = mongoose.model('Todo', todoSchema);

// 6️⃣ Routes

// Signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({ name, email, password });

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };

    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Email already exists" });
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add todo
app.post('/add', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Not logged in" });

  const { task } = req.body;
  const newTodo = await Todo.create({
    text: task,
    name: req.session.user.name,
    email: req.session.user.email
  });

  res.json({ success: true, todo: newTodo });
});

// Delete todo
app.delete('/delete/:id', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Not logged in" });

  const todoId = req.params.id;
  await Todo.deleteOne({ _id: todoId, email: req.session.user.email });
  res.json({ success: true });
});

// Test backend
app.get('/', (req, res) => res.send("Backend working"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
