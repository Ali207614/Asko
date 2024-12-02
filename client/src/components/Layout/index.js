import React from 'react';
import LayoutStyle from './LayoutStyle';
import Header from '../Header';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <LayoutStyle>
      <Header />
      <div className="childrenCard">{children}</div>
    </LayoutStyle>
  );
};

export default Layout;
