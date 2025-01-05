import React from 'react';
import Style from './Style';
import TopImage from '../../assets/images/logoAltitude.svg';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { Link, NavLink, useLocation } from 'react-router-dom';
import formatterCurrency from '../../helpers/currency';
import { useSelector } from 'react-redux';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { getMe } = useSelector(state => state.main);


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

                      Продажа
                    </NavLink>
                  </li>
                  {/* <li className='list-item'>
                    <NavLink
                      to="/outgoing"
                      className={() => {
                        const isActive = location.pathname.startsWith('/outgoing') || location.pathname.startsWith('/payment');
                        return `list-item-link ${isActive ? 'opacity-1' : ''}`;
                      }}
                    >
                      Исходящий платеж
                    </NavLink>
                  </li> */}
                </ul>
              </nav>
            </div>

            <div className='df'>
              <div className='right-head' style={{ justifyContent: 'space-between', marginRight: '20px' }}>
                <div className='footer-block' style={{ background: "#F7F8F9" }}>
                  <p className='footer-text'>Курс доллара: <span className='footer-text-spn'>
                    {
                      (formatterCurrency(Number(get(getMe, 'currency.Rate', 1) || 1), 'UZS'))
                    }</span></p>
                </div>
              </div>
              <div className='left-side df'>
                <span className='circle'>M</span>
                <p className='textMain'>Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </Style>
  );
};

export default Header;
