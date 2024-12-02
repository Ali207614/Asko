import React, { useEffect } from 'react';
import LaunchStyle from './LaunchStyle';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/big_logo.png';
import { useSelector } from 'react-redux';
import { get } from 'lodash';

const Launch = () => {
  const navigate = useNavigate();
  const { getMe } = useSelector(state => state.main);
  useEffect(() => {
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  }, []);

  return (
    <LaunchStyle>
      <div className="container">
        <img src={Logo} alt="logo" className="img" />
      </div>
    </LaunchStyle>
  );
};

export default Launch;
