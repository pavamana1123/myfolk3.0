import { MainMenu, MainMenuCtl } from '../mainMenu';
import './index.css';

var mainMenu = new MainMenuCtl()

function Header(props) {
  var {onPageMenuClick, hideOptions, title} = props
  return (
    <div>
        {!hideOptions && <MainMenu ctl={mainMenu} list={[1,2,3,4]}/>}
        <div className="appHeader">
          {!hideOptions && <i className="bi bi-list clickable clickableIcon" id="slideMenuButton" onClick={()=>{mainMenu.show()}}></i>}
          <span>{title}</span>
          {!hideOptions && <i className="bi bi-three-dots-vertical clickable clickableIcon" id="menuButton" onClick={onPageMenuClick}></i>}
        </div>
    </div>

  );
}

export default Header;
