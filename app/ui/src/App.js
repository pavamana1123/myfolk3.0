import './App.css';
import './strings.js'
import API from './api';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import { useEffect, useState } from 'react';
import Elements from './pages/elements';

function App() {

  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/elements" element={<Elements/>}></Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
