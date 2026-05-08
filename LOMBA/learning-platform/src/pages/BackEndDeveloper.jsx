import React from 'react';
import HeroSection from '../components/HeroSection';
import ProgressCards from '../components/ProgressCards';

const BackEndDeveloper = () => {
  const backEndCards = [
    { title: 'JavaScript Dasar', progress: 100, type: 'backend' },
    { title: 'Setup Node.js', progress: 90, type: 'backend' },
    { title: 'Desain Memakai React', progress: 75, type: 'backend' },
    { title: 'Web Server', progress: 60, type: 'backend' }
  ];

  return (
    <>
      <HeroSection 
        title="Back End Developer"
        description="Kuasai pengembangan server-side dengan Node.js, database management, API development, dan deployment ke cloud"
        backgroundImage="/images/Header.png"
      />
      <ProgressCards cards={backEndCards} badgeTitle="Backend" />
    </>
  );
};

export default BackEndDeveloper;