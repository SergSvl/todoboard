import React from 'react';
import Logo from '@/assets/icons/logo.svg';

export const Header = () => {
  return (
    <header className="w-full bg-cyan-600 h-12 fixed top-0">
      <img src={Logo} className="" width="70" alt="logo" />
    </header>
  )
}