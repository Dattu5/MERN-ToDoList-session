 import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Form.css";
 import { useNavigate } from "react-router-dom";


function Signup() {
  // Separate state for each input
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const navigate=useNavigate();

    
async function Submit() {
const response = await fetch('http://localhost:5000/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({name,email,password})
});
const data=await  response.json();
if(data.success){
    alert("submitted");
    navigate('/todo')

}
    else{
        alert('not submitted')
     }



}

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
            autoComplete="name"

        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
            autoComplete="email"

        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
            autoComplete="current-password"

        />
        <button type="submit " onClick={(e)=>{ e.preventDefault(); Submit()}}>Signup</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
