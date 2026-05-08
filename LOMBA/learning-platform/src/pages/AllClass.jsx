import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

const AllClass = () => {
  const allClasses = [
    {
      title: 'Android Developer',
      description: 'Belajar membuat aplikasi Android dengan Java/Kotlin',
      color: 'bg-green-500',
      link: 'android-developer'
    },
    {
      title: 'Front End Website',
      description: 'Kuasai HTML, CSS, JavaScript, dan React',
      color: 'bg-blue-500',
      link: 'front-end'
    },
    {
      title: 'Back End Developer',
      description: 'Server-side development dengan Node.js',
      color: 'bg-purple-500',
      link: 'back-end'
    },
    {
      title: 'Machine Learning',
      description: 'AI dan ML dengan Python dan TensorFlow',
      color: 'bg-red-500',
      link: 'machine-learning'
    }
  ];

  return (
    <>
      <HeroSection 
        title="All Classes"
        description="Akses semua kelas pembelajaran programming dan teknologi dalam satu tempat. Mulai journey Anda menjadi developer profesional"
        backgroundImage="/images/Header.png"
      />
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Semua Kelas Tersedia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allClasses.map((course, index) => (
              <Link
                key={index}
                to={`/${course.link}`}
                className="bg-gray-50 rounded-lg p-6 border hover:shadow-md transition-shadow block hover:bg-gray-100"
              >
                <h4 className="text-lg font-semibold mb-2 text-gray-800">{course.title}</h4>
                <p className="text-gray-600">{course.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllClass;
