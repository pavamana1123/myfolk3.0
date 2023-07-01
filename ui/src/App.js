import './App.css';
import './strings.js'
import API from './api';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import { useEffect, useState } from 'react';
import Elements from './pages/elements';
import Login from './pages/login';
import Buddies from './pages/buddies';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/elements" element={<Elements/>}></Route>
          <Route path="/buddies" element={<Buddies/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
    </Router>
    <ToastContainer />
    </div>
  );
}

export default App;
