import './App.css';
import './strings.js'
import API from './api';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import { useEffect, useState } from 'react';
import Login from './pages/login';

function App() {

  var [data, setData] = useState({})
  var [dates, setDates] = useState([])
  var [isLoading, setIsLoading] = useState(true)

  var init = ()=>{
    new API()
    .setFunc("getData").setParams("1wkRjAARt8vKGpwWQwGt66tivKKFscHgfsttPdh7kf9I").call()
    .then((data)=>{
      setData(data)
      var d = {}
      data.services.forEach(s => {
        d[s.date]=null
      });
      setDates(Object.keys(d).map(d=>{ return d }).filter(d=>{ return d!="" }).sort())
      setIsLoading(false)
    })
    .catch(()=>{})
  }

  useEffect(()=>{
    init()
    setInterval(init,60*1000)
  },[])

  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
