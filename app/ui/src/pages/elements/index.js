import { useRef, useState } from 'react';
import './index.css';

function Elements(props) {

  return (
    <div className='elements'>
      <div className='contact'>
        <div className='contact-status'>
        </div>
        <div className='contact-details'>
          <div className='contact-basic-details'>
            <div className='contact-basic-details-left'>
              <div className='contact-name'>Some Name S K</div>
              <div className='contact-phone'>9035249059</div>
            </div>
            <div className='contact-basic-details-right'>
              <div>Dropping-Out (SOS ✅) | PVPD</div>
              <div>👥 Sanjeev Krishnan</div>
            </div>
          </div>
          <div className='contact-stats'>
            <div className='contact-stats-item odd' id="contact-stats-attendance">
              <div className='contact-stats-item-icon'>Attendance</div>
              <div className='contact-stats-item-value'>45</div>
            </div>
            <div className='contact-stats-item even' id="contact-stats-lastSeen">
              <div className='contact-stats-item-icon'>Last Seen</div>
              <div className='contact-stats-item-value'>3</div>
            </div>
            <div className='contact-stats-item odd' id="contact-stats-regularity">
              <div className='contact-stats-item-icon'>Regularity</div>
              <div className='contact-stats-item-value'>75%</div>
            </div>
            <div className='contact-stats-item even' id="contact-stats-calls">
              <div className='contact-stats-item-icon'>Calls</div>
              <div className='contact-stats-item-value'>30</div>
            </div>
            <div className='contact-stats-item odd' id="contact-stats-lastCalled">
              <div className='contact-stats-item-icon'>Last Called</div>
              <div className='contact-stats-item-value'>1</div>
            </div>
            <div className='contact-stats-item even' id="contact-stats-callRegularity">
              <div className='contact-stats-item-icon'>Call Regularity</div>
              <div className='contact-stats-item-value'>25%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Elements;