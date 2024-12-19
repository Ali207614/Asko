import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Launch, Login, Home, Order } from '../screens';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invoice" element={<Order />} />
        <Route path="/invoice/:id" element={<Order />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
