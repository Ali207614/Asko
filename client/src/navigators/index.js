import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Launch, Login, Home, Order, Outgoing, Payment } from '../screens';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invoice" element={<Order />} />
        <Route path="/invoice/:id" element={<Order />} />
        <Route path="/outgoing" element={<Outgoing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/:id/:draft" element={<Payment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
