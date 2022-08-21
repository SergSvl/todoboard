import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@/App.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Main from '@/Pages/Main';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route path="/" element={ <Main /> } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
