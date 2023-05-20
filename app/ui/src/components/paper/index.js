import { useState, useEffect } from 'react';
import './index.css';

class PaperCtl {
  constructor(){
  }
  setFunc(f){
  }
}

function Paper(props) {

  var {children, style, className} = props

  return(
    <div className={`paper ${className}`} style={style}>
      {children}
    </div>
  )
}

export { Paper, PaperCtl };
