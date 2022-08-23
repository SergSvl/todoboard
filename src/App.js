import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@/App.css';
import Header from '@/components/Header';
import Main from '@/Pages/Main';

function App() {
  return (
    <div className="w-full -h-screen">
      <Header />
      {/* <div className="w-full h-full top-0 bottom-0 -absolute -bg-gray-50/50 -border border-1 -box-border backdrop-blur-sm"> */}
        <Routes>
          <Route path="/" element={ <Main /> } />
        </Routes>
      {/* </div> */}
    </div>
  );
}

export default App;
