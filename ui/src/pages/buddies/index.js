import React, { useEffect, useState } from 'react';
import "./index.css"
import Header from '../../components/header';
import API from '../../api';
import _ from "../../_"

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

const Buddy = (props)=>{

    var { buddy } = props

    return (
        <div className='buddy-container' key={buddy.username}>
            <div className='buddy-status-color' style={{ backgroundColor: statusColors[buddy.status]?`#${statusColors[buddy.status]}`:`#${statusColors.NA}` }}></div>
            <div className='buddy-display'>
                <div className='buddy-det-cont'>
                    <div className='buddy-dp-holder'>
                        <div className='buddy-dp-text'>
                            {_.getInitials(buddy.name)}
                        </div>
                    </div>
                    <div className='buddy-details'>
                        <div className='buddy-row-1'>
                            <div className='buddy-basic'>
                                <div className='buddy-name'>{buddy.name}</div>
                                <div className='buddy-phone'>{buddy.phone}</div>
                            </div>
                            <div className='buddy-contact'>
                                <a href={`tel:+91${buddy.phone}`} target='_blank'><img className='buddy-contact-img buddy-call' src='img/buddy/call.png'/></a>
                                <a href={`https://wa.me/91${buddy.phone}`} target='_blank'><img className='buddy-contact-img buddy-wa' src='img/buddy/wa.png'/></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='buddy-stats-cont'>
                    <div className='buddy-stat buddy-stat-even'>
                        {buddy.status}
                    </div>
                    <div className='buddy-stat buddy-stat-odd'>
                        {buddy.program}
                    </div>
                    <div className='buddy-stat buddy-stat-even'>
                        {buddy.attendance}
                    </div>
                    <div className='buddy-stat buddy-stat-odd'>
                        {buddy.regularity}
                    </div>
                    <div className='buddy-stat buddy-stat-even'>
                        {buddy.lastSeen}
                    </div>
                    <div className='buddy-stat buddy-stat-odd'>
                        {buddy.dob}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Buddies(props){

    var [buddies, setBuddies] = useState([])

    useEffect(()=>{
        new API().call("/buddies").then((buddies)=>{
            setBuddies(buddies.data)
        })
    }, [])

    return (
        <div className='buddies-page-container'>
            <Header></Header>
            <div id="buddies-container">
                {
                    buddies.map(buddy=>{
                        return <Buddy buddy={buddy}/>
                    })
                }
            </div>
        </div>
    )
}

export default Buddies