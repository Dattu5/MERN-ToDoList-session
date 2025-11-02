 const express = require('express'); 
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cors = require('cors');

const app = express(); 
const PORT = 5000; 
app.use(express.json());
app.use(cors({
  origin: 'https://mern-to-do-list-session-uh1d.vercel.app', // React app URL
  credentials: true
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://dattatreyagokhale_db_user:MAkO0xrpeCxp3FP2@cluster0.ixnbsd0.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.get("/", (req, res) => res.send("Backend working and MongoDB connected!"));

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'user' }); // explicitly use "user" collection

// User model
const User = mongoose.model('User', userSchema);
app.set('trust proxy', 1);

// Configure session
app.use(session({
  secret: 'mysecretkey', // change this in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://dattatreyagokhale_db_user:MAkO0xrpeCxp3FP2@cluster0.ixnbsd0.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0', // store sessions in same DB
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60, cookie: { 
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: true,            // required for cross-site cookies
    sameSite: 'none'         // required for cross-site cookies
  } } // 1 hour
}));


//todo schema
const todoSchema = new mongoose.Schema({
     text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  name: String,
  email: String
});
const todo = mongoose.model("Todo", todoSchema);


//put signup
app.post('/signup', async(req, res) => {
  const { name, email, password } = req.body;


 try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password
    });

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };

    res.json({ success: true });
  } catch (err) {
    console.error("Signup error full:", err); // <-- log full error object
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }

 });


 //login
 app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // Find user in DB
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Store user info in session 
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({ success: true, message: "Logged in successfully" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//todo add
 app.post('/add', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  const { task } = req.body;

  // Save to DB and get the created document
  const newTodo = await todo.create({
    name: req.session.user.name,
    email: req.session.user.email,
    text: task
  });

  // Return the created todo to frontend
  res.json({ success: true, todo: newTodo });
});



//todo delete
 app.delete('/delete/:id', async (req, res) => {
  const todoId = req.params.id;

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  await todo.deleteOne({ 
    _id: todoId, 
    email: req.session.user.email  // ensures only owner deletes their own task
  });

  res.json({ success: true });
});


// Start Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
