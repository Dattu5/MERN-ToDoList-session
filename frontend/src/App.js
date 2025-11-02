 import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Todo from "./Components/Todo";
 import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



 function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
         <Route path="/todo" element={<Todo />} />
       </Routes>
    </Router>
    
     
    
    
    
    
    
    
    
    </>
   );
}

export default App;
