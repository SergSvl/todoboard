import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@/App.css';
import Header from '@/components/Header';
import Main from '@/Pages/Main';

function App() {
  return (
    <div className="w-full -h-screen">
      <Header />
      <Routes>
        <Route path="/" element={ <Main /> } />
      </Routes>
    </div>
  );
}

export default App;
