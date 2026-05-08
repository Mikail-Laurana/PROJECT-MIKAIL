import React from 'react';
import HeroSection from '../components/HeroSection';
import ProgressCards from '../components/ProgressCards';

const AndroidDeveloper = () => {
  return (
    <>
      <HeroSection 
        title="Android Developer"
        description="Dalam kelas ini akan dipelajari tentang cara membuat aplikasi android dengan berbagai bahasa seperti Java/Kotlin dan Flutter"
        backgroundImage="/images/Header.png"
      />
      <ProgressCards />
    </>
  );
};

export default AndroidDeveloper;