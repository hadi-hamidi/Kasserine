import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import HeroSimple from './components/HeroSimple';
import Gallery from './components/Gallery';
import MenuSection from './components/MenuSection';
import OpeningHours from './components/OpeningHours';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HeroSimple />
        <Gallery />
        <MenuSection />
        <OpeningHours />
        <CTA />
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}

export default App;
