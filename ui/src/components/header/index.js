import { useState } from 'react';
import './index.css';
import Cookies from 'js-cookie'
import _ from "../../_"


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

  const save = JSON.parse(Cookies.get("save"))

  return (
    <div className="header-holder">
      <div className='header'>
          <img src="img/header/menu.png" id="header-menu" onClick={toggleMenu}/>
          <img src="img/header/logo.png" id="header-logo"/>
          <img src="img/header/dots.png" id="header-dots" onClick={toggleContextMenu}/>
      </div>

      <div className={`header-menu ${menuOpen?'open':''}`}>
        <div className='header-menu-cont'>
          
          <div className='header-user-det-cont'>
            <div className='header-user-det-dp-cont'>
              <div className='header-user-det-dp'>
                { _.getInitials(save.name) }
              </div>
            </div>
            <div className='header-user-det'>
              <div className='header-user-det-name'>
                {save.name}
              </div>
              <div className='header-user-det-id'>
                {`@${save.username} | ${save.roleInfo.sort((r1, r2)=>{
                  return r1.roleIndex>r2.roleIndex?-1:1
                })[0].roleName}`}
              </div>
            </div>
          </div>

          <div className='header-menu-items-cont'>
            <div className='header-menu-items'>
                <hr className='menu-items-sep'/>
                <a className='header-menu-item menu-selected' href='/home' target='_self'>
                  {`Home`}
                </a>
                <a className='header-menu-item' href='/buddies' target='_self'>
                  {`Buddies`}
                </a>
            </div>
            <div className='header-settings-cont'>
                <hr className='menu-items-sep'/>
                <a className='header-menu-item' href='/settings' target='_self'>
                  {`Settings`}
                </a>
                <div className='header-menu-item'>
                  {`Sign Out`}
                </div>
            </div>
          </div>

        </div>
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
