import React, { useState } from 'react';
import { Calendar, Clock, Users, Link as LinkIcon, Globe, Lock, AlertCircle } from 'lucide-react';

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', domain: 'youtube.com' },
  { name: 'Google Meet', domain: 'meet.google.com' },
  { name: 'Zoom', domain: 'zoom.us' },
  { name: 'Microsoft Teams', domain: 'teams.microsoft.com' },
  { name: 'Telegram', domain: 't.me' }
];

export function CreateWatchParty() {
  const [isPublic, setIsPublic] = useState(true);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (inputUrl: string) => {
    if (!inputUrl) {
      setUrlError('URL é obrigatória');
      return false;
    }

    try {
      const urlObj = new URL(inputUrl);
      const isSupported = SUPPORTED_PLATFORMS.some(platform => 
        urlObj.hostname.includes(platform.domain)
      );

      if (!isSupported) {
        setUrlError('URL não suportada. Use YouTube, Google Meet, Zoom, Teams ou Telegram');
        return false;
      }

      setUrlError('');
      return true;
    } catch {
      setUrlError('URL inválida');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;
    // Processar o formulário
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Criar Nova Watch Party</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título do Evento
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ex: Maratona Marvel"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Descreva o evento..."
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL do Vídeo/Reunião
              </label>
              <div className="mt-1">
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) validateUrl(e.target.value);
                    }}
                    className={`block w-full rounded-md pr-10 ${
                      urlError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    } shadow-sm`}
                    placeholder="https://"
                    required
                  />
                  <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {urlError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {urlError}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Plataformas suportadas: YouTube, Google Meet, Zoom, Microsoft Teams, Telegram
                </p>
              </div>
            </div>
          </div>

          {/* Agendamento e Participantes */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="date"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Hora
                </label>
                <div className="mt-1 relative">
                  <input
                    type="time"
                    id="time"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Limite de Participantes
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  id="capacity"
                  min="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Ex: 10"
                />
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Deixe em branco para não ter limite
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Dicas:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Para YouTube: Use a URL do vídeo ou playlist</li>
                <li>• Para Meet/Zoom/Teams: Use o link do convite da reunião</li>
                <li>• Para Telegram: Use o link do grupo ou canal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacidade e Botões */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsPublic(true)}
              className={`flex items-center px-4 py-2 rounded-md ${
                isPublic
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Público
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={`flex items-center px-4 py-2 rounded-md ${
                !isPublic
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Privado
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Criar Watch Party
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}