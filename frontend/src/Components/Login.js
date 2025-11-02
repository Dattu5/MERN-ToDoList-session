 import { Link, useNavigate } from "react-router-dom";
import "./Form.css";
 import React, { useState } from 'react';
 

function Login() {

 const [name, setName] = useState('');
  const [email, setEmail] = useState('');
const navigate=useNavigate();
    
async function Submit() {
const response = await fetch('https://mern-todolist-session.onrender.com/login', {
  method: 'POST',
    credentials: 'include',   // <-- important for session

  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({email})
});
const data=await  response.json();
if(data.success){
    alert("loged in");
navigate('/todo')
}
    else{
        alert('cannot log in ')
     }



}

  return (
     <div className="form-container">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Name" required  value={name} autoComplete="name"

          onChange={(e) => setName(e.target.value)}/>
        <input type="email" placeholder="Email" required   value={email} autoComplete="email"

          onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" onClick={(e)=>{ e.preventDefault(); Submit()}}>Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/">Signup</Link>
      </p>
    </div>
  )
}

export default Login