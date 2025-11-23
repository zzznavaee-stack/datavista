 import Users from "./pages/Users/Users";
 import Licenses from "./pages/Licenses";
 import Logs from "./pages/Logs"
 import Dashboard from "./pages/Users/Dashbord";
 import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

 function App(){
  return <>
    <Router>
      <Routes>
       <Route path="/" element={<Dashboard />} />  
       <Route path="/users" element={<Users />} />
        <Route path="/ilcenses " element={<Licenses />} />
        <Route path="/logs" element={<Logs />} />

      </Routes>
    </Router>
  </>

 }

export default App;
