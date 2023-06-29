import { useState } from 'react';
import './index.css';
import Cookies from 'js-cookie'


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

  const getInitials = (name) => {
    const words = name.split(' ');
    
    if (words.length === 1) {
      if (words[0].length === 1) {
        return words[0].toUpperCase();
      } else {
        return words[0].substring(0, 2).toUpperCase();
      }
    } else {
      const firstInitials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());
      return firstInitials.join('');
    }
  }

  const save = JSON.parse(Cookies.get("save"))

  return (
    <div className="header-holder">
      <div className='header'>
          <img src="header/menu.png" id="header-menu" onClick={toggleMenu}/>
          <img src="header/logo.png" id="header-logo"/>
          <img src="header/dots.png" id="header-dots" onClick={toggleContextMenu}/>
      </div>

      <div className={`header-menu ${menuOpen?'open':''}`}>
        <div className='header-menu-cont'>
          <div className='header-user-det-cont'>
            <div className='header-user-det-dp-cont'>
              <div className='header-user-det-dp'>
                { getInitials(save.name) }
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
