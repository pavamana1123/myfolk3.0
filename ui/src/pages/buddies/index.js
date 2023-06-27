import React, { useEffect, useState } from 'react';
import "./index.css"
import Header from '../../components/header';
import API from '../../api';

function Buddies(props){

    var [buddies, setBuddies] = useState([])

    useEffect(()=>{
        new API().call("/buddies").then((buddies)=>{
            setBuddies(buddies.data)
        })
    }, [])

    const statusColors = {
        "Regular": "43A047",
        "Irregular": "FFEB3B",
        "Beginner": "1976D2",
        "Dropping-Out": "FB8C00",
        "Long-Absence": "E65100",
        "Non-Responsive": "FBC02D",
        "Follow-Up": "FFF59D",
        "New": "BBDEFB",
        "Dropped-Out": "BF360C",
        "Snoozed": "BCAAA4",
        "NA": "B0BEC5"
    }

    return (
        <div className='buddies-page-container'>
            <Header></Header>
            <div id="buddies-container">
                {
                    buddies.map(buddy=>{
                        return <div className='buddy-container' key={buddy.username}>
                            <div className='buddy-status-color' style={{ backgroundColor: statusColors[buddy.status]?`#${statusColors[buddy.status]}`:`#${statusColors.NA}` }}></div>
                                <div className='buddy-display'>
                                    <div className='buddy-dp-holder'>
                                        <div className='buddy-dp-text'>
                                            {buddy.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className='buddy-details'>
                                    <div className='buddy-row-1'>
                                        <div className='buddy-basic'>
                                            <div className='buddy-name'>{buddy.name}</div>
                                            <div className='buddy-phone'>{buddy.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Buddies