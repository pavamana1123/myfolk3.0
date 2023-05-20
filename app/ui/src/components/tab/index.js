import './index.css';
import { useState, useEffect, useRef } from 'react';

function Tab(props) {
  var [activeTab, setActiveTab] = useState(0)
  var self=this
  const {tabs, onTabChange} = props
  return (
    <div className='tab'>
      <div className='tabHeader'>
        <div className='tabHeaderItems '>
          {
            tabs.map((tab, i)=>{
              return (
                <div className='tabHeaderItem' key={i} onClick={()=>{
                  setActiveTab.bind(self)(i)
                  onTabChange(i)
                }}>{tab.title}</div>
              )
            })
          }
        </div>
        <div className='tabUnderline' style={{
          width:`${100/tabs.length}%`,
          left: `${activeTab*(100/tabs.length)}%`
          }}></div>
      </div>

      <div className='tabChildren'>
        {tabs[activeTab].component}
      </div>

    </div>
  )
}

export default Tab;
