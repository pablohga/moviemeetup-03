import React, { useState } from 'react';
import { RecommendedContent } from '../components/discover/RecommendedContent';
import { ExploreWatchParties } from '../components/discover/ExploreWatchParties';
import { ContentRatings } from '../components/discover/ContentRatings';
import { Search, Filter } from 'lucide-react';

export function Discover() {
  const [activeTab, setActiveTab] = useState('recommended');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Descobrir</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Encontre novos conteúdos e watch parties para participar
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              className="input pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommended'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Recomendados
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'explore'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Explorar
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ratings'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Avaliações
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'recommended' && <RecommendedContent />}
        {activeTab === 'explore' && <ExploreWatchParties />}
        {activeTab === 'ratings' && <ContentRatings />}
      </div>
    </div>
  );
}