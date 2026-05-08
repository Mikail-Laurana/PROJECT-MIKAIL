import React from 'react';
import { Code, Database, Globe, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgressCards = ({ cards, badgeTitle = 'Kotlin' }) => {
  const defaultCards = [
    { title: 'Instalasi Kotlin', progress: 100, type: 'kotlin', link: '/kotlin/instalasi' },
    { title: 'Inisialisasi Data', progress: 100, type: 'data', link: '/kotlin/data' },
    { title: 'Pemrograman Dasar', progress: 0, type: 'kotlin', link: '/kotlin/dasar' },
    { title: 'Pemograman Lanjut', progress: 0, type: 'kotlin', link: '#' }
  ];

  const progressCards = cards || defaultCards;

  const getIcon = (type) => {
    switch (type) {
      case 'kotlin':
      case 'backend':
        return <Code className="w-5 h-5 text-white" />;
      case 'data':
        return <Database className="w-5 h-5 text-white" />;
      case 'frontend':
        return <Globe className="w-5 h-5 text-white" />;
      case 'ml':
        return <Brain className="w-5 h-5 text-white" />;
      default:
        return <Code className="w-5 h-5 text-white" />;
    }
  };

  const getBadgeIcon = (title) => {
    switch (title) {
      case 'Frontend':
        return <Globe className="w-4 h-4 text-white" />;
      case 'Backend':
        return <Database className="w-4 h-4 text-white" />;
      case 'Machine Learning':
        return <Brain className="w-4 h-4 text-white" />;
      default:
        return <Code className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
            {getBadgeIcon(badgeTitle)}
          </div>
          <span className="font-semibold text-gray-800">{badgeTitle}</span>
        </div>

        {/* Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressCards.map((card, index) => (
            <Link to={card.link} key={index}>
              <div className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                    {getIcon(card.type)}
                  </div>
                  <span className="font-medium text-gray-800">{card.title}</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressCards;
