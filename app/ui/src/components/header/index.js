import { useState } from 'react';
import './index.css';


function Header(props) {
  var {children} = props

  var [menuOpen, setMenuOpen] = useState(false);
  var [contextMenuOpen, setContextMenuOpen] = useState(false);

  const toggleMenu = ()=>{
    setMenuOpen(!menuOpen)
  }

  const toggleContextMenu = ()=>{
    setContextMenuOpen(!contextMenuOpen)
  }

  const closeMenu = ()=>{
    setMenuOpen(false)
  }

  const closeContextMenu = ()=>{
    setContextMenuOpen(false)
  }

  return (
    <div className="header-holder">
      <div className='header'>
          <img src="header/menu.png" id="header-menu" onClick={toggleMenu}/>
          <img src="header/logo.png" id="header-logo"/>
          <img src="header/dots.png" id="header-dots" onClick={toggleContextMenu}/>
      </div>

      <div className={`header-menu ${menuOpen?'open':''}`}>
      </div>
      <div className={`header-contextmenu ${contextMenuOpen?'open':''}`}>
        {children}
      </div>

      <div className={`header-menuglass ${!menuOpen?'hide':''}`} onClick={closeMenu}>
      </div>
      {contextMenuOpen?<div className={`header-contextmenuglass`} onClick={closeContextMenu}>
      </div>:null}
    </div>


  );
}

export default Header;
