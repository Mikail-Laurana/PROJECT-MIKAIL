import React from 'react';
import HeroSection from '../components/HeroSection';
import ProgressCards from '../components/ProgressCards';

const MachineLearning = () => {
  const mlCards = [
    { title: 'Pengenalan Python', progress: 100, type: 'ml' ,link: '/python-orientation'},
    { title: 'Inisialisasi Data', progress: 80, type: 'ml',link: '/data-processing' },
    { title: 'Function Pada Python', progress: 65, type: 'ml',link: '/function-python' },
    { title: 'Array Python', progress: 40, type: 'ml',link : '/array-python' }
  ];

  return (
    <>
      <HeroSection 
        title="Machine Learning"
        description="Jelajahi dunia AI dan machine learning dengan Python, TensorFlow, dan implementasi model untuk solving real-world problems"
        backgroundImage="/images/Header.png"
      />
      <ProgressCards cards={mlCards} badgeTitle="Machine Learning" />
    </>
  );
};

export default MachineLearning;