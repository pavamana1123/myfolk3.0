import { useState, useEffect } from 'react';
import './index.css';

class SpinnerCtl {
  constructor(){
    this.show = ()=>{}
    this.hide = ()=>{}
  }
  setShowFunc(f){
    this.show=f
  }
  setHideFunc(f){
    this.hide=f
  }
}

function Spinner(props) {

  var [show, setShow] = useState(props.show)
  const self = this

  var {style}=props

  useEffect(()=>{
    if(props.ctl){
      props.ctl.setShowFunc(()=>{setShow.bind(self)(true)})
      props.ctl.setHideFunc(()=>{setShow.bind(self)(false)})
    }
  },[])

  return (
    <div
      className={`spinner-bg-circle ${show || !props.ctl ?"spinner-show":"spinner-hide"}`}
      style={{...{width:`${props.size||2}vw`, height:`${props.size||2}vw`},...style}}>
    </div>
  );
}

export { Spinner, SpinnerCtl };
