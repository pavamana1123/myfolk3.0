import React, { useEffect, useState } from 'react';
import "./index.css"
import Header from '../../components/header';
import API from '../../api';

function Buddies(props){

    var [buddies, setBuddies] = useState([])

    useEffect(()=>{
        new API().call("")
    }, [])

    return (
        <div className='buddies-container'>
            <Header></Header>

        </div>
    )
}

export default Buddies