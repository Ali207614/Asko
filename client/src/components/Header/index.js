import React from 'react';
import Style from './Style';
import TopImage from '../../assets/images/logoAltitude.svg';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();


  return (
    <Style>
      <div className="main">
        <div className='container'>
          <div className='inner-container'>
            <div className='d-flex align-items'>
              <a className='display-block' href="/home">
                <img width={114} height={32} src={TopImage} alt="top logo" className="topLogo" />
              </a>
              <nav className='navbar'>
                <ul className='d-flex align-items list'>
                  <li className='list-item'>
                    <NavLink
                      to="/home"
                      className={() => {
                        const isActive = location.pathname === '/home' || location.pathname.startsWith('/order') || location.pathname.startsWith('/invoice');
                        return `list-item-link ${isActive ? 'opacity-1' : ''}`;
                      }}
                    >
                      Заказ
                    </NavLink>
                  </li>
                  <li className='list-item'>
                    <NavLink
                      to="/return"
                      className={() => {
                        const isActive = location.pathname === '/return' || location.pathname.startsWith('/return-manage') || location.pathname.startsWith('/return-invoice');
                        return `list-item-link ${isActive ? 'opacity-1' : ''}`;
                      }}
                    >
                      Возврат
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
            <div className='left-side df'>
              <span className='circle'>M</span>
              <p className='textMain'>Manager</p>
            </div>
          </div>
        </div>
      </div>


    </Style>
  );
};

export default Header;
