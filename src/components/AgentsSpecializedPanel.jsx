import React, { useState, useEffect } from 'react';
import { Upload, Play, Pause, Settings, Database, FileText, Brain, Search, Network, Clock, Calculator, Eye, Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AgentsSpecializedPanel = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [agentResults, setAgentResults] = useState({});
  const [isProcessing, setIsProcessing] = useState({});

  // Configuration des agents spécialisés avec leurs règles métier
  const agentConfigs = {
    'collecte': {
      id: 'collecte',
      name: 'Agent de Collecte',
      icon: Database,
      color: 'blue',
      description: 'Ingestion et normalisation des données AMO',
      rules: [
        'Validation format des ordonnances (PDF, JPG, PNG)',
        'Extraction OCR des données médicales',
        'Normalisation codes CIM-10 et ATC',
        'Vérification intégrité des données',
        'Enrichissement avec référentiels CNSS'
      ],
      dataTypes: ['Ordonnances', 'Factures', 'Rapports médicaux', 'Certificats'],
      apiEndpoint: '/api/agents/collecte',
      status: 'active'
    },
    'comportemental': {
      id: 'comportemental',
      name: 'Agent Comportemental',
      icon: Brain,
      color: 'purple',
      description: 'Analyse des patterns comportementaux individuels',
      rules: [
        'Détection changements brutaux de consommation',
        'Analyse fréquence consultations par spécialité',
        'Identification patterns temporels suspects',
        'Scoring comportement patient/médecin',
        'Comparaison avec profils similaires'
      ],
      dataTypes: ['Historique consultations', 'Profils patients', 'Données temporelles'],
      apiEndpoint: '/api/agents/comportemental',
      status: 'active'
    },
    'relationnel': {
      id: 'relationnel',
      name: 'Agent Relationnel',
      icon: Network,
      color: 'green',
      description: 'Détection de réseaux frauduleux organisés',
      rules: [
        'Analyse graphe relations médecin-pharmacie',
        'Détection clusters suspects',
        'Identification patients fictifs',
        'Analyse géolocalisation anormale',
        'Scoring force des relations'
      ],
      dataTypes: ['Réseaux relationnels', 'Données géographiques', 'Graphes de connexions'],
      apiEndpoint: '/api/agents/relationnel',
      status: 'active'
    },
    'temporel': {
      id: 'temporel',
      name: 'Agent Temporel',
      icon: Clock,
      color: 'orange',
      description: 'Analyse des anomalies temporelles',
      rules: [
        'Détection prescriptions simultanées',
        'Analyse fenêtres temporelles suspectes',
        'Identification patterns saisonniers',
        'Vérification délais réglementaires',
        'Scoring urgence temporelle'
      ],
      dataTypes: ['Séries temporelles', 'Calendriers médicaux', 'Données de timing'],
      apiEndpoint: '/api/agents/temporel',
      status: 'active'
    },
    'scoring': {
      id: 'scoring',
      name: 'Agent de Scoring',
      icon: Calculator,
      color: 'red',
      description: 'Calcul et priorisation des scores de risque',
      rules: [
        'Agrégation scores des autres agents',
        'Application pondérations métier',
        'Calcul score global de risque',
        'Priorisation des alertes',
        'Génération recommandations'
      ],
      dataTypes: ['Scores partiels', 'Règles de pondération', 'Seuils de décision'],
      apiEndpoint: '/api/agents/scoring',
      status: 'active'
    },
    'investigation': {
      id: 'investigation',
      name: 'Agent d\'Investigation',
      icon: Search,
      color: 'indigo',
      description: 'Investigation approfondie des cas complexes',
      rules: [
        'Analyse croisée multi-sources',
        'Génération hypothèses de fraude',
        'Recherche preuves complémentaires',
        'Validation expertise métier',
        'Préparation dossiers juridiques'
      ],
      dataTypes: ['Dossiers complexes', 'Preuves documentaires', 'Expertises'],
      apiEndpoint: '/api/agents/investigation',
      status: 'active'
    }
  };

  useEffect(() => {
    // Initialisation des agents
    const initialAgents = Object.values(agentConfigs).map(config => ({
      ...config,
      lastRun: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      processedCases: Math.floor(Math.random() * 100) + 50,
      successRate: Math.floor(Math.random() * 20) + 80,
      avgProcessingTime: Math.floor(Math.random() * 300) + 60
    }));
    setAgents(initialAgents);
  }, []);

  const handleFileUpload = (agentId, files) => {
    setUploadedFiles(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), ...Array.from(files)]
    }));
  };

  const handleRunAgent = async (agentId) => {
    setIsProcessing(prev => ({ ...prev, [agentId]: true }));
    
    // Simulation du traitement
    setTimeout(() => {
      const mockResult = {
        status: 'completed',
        processedFiles: uploadedFiles[agentId]?.length || 0,
        detectedAnomalies: Math.floor(Math.random() * 10) + 1,
        score: Math.floor(Math.random() * 40) + 60,
        recommendations: [
          'Investigation approfondie recommandée',
          'Vérification documents complémentaires',
          'Validation expertise médicale'
        ],
        timestamp: new Date().toISOString()
      };
      
      setAgentResults(prev => ({ ...prev, [agentId]: mockResult }));
      setIsProcessing(prev => ({ ...prev, [agentId]: false }));
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAgentColor = (color) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50',
      purple: 'border-purple-500 bg-purple-50',
      green: 'border-green-500 bg-green-50',
      orange: 'border-orange-500 bg-orange-50',
      red: 'border-red-500 bg-red-50',
      indigo: 'border-indigo-500 bg-indigo-50'
    };
    return colors[color] || 'border-gray-500 bg-gray-50';
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agents Spécialisés</h2>
          <p className="text-gray-600 mt-1">Gestion et configuration des agents IA avec règles métier spécifiques</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            6 Agents Actifs
          </span>
        </div>
      </div>

      {/* Vue d'ensemble des agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          const isProcessingAgent = isProcessing[agent.id];
          const result = agentResults[agent.id];
          
          return (
            <div
              key={agent.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${getAgentColor(agent.color)} ${
                selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedAgent(agent)}
            >
              {/* En-tête de l'agent */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${agent.color}-100`}>
                    <IconComponent className={`w-6 h-6 text-${agent.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunAgent(agent.id);
                  }}
                  disabled={isProcessingAgent}
                  className={`p-2 rounded-lg transition-colors ${
                    isProcessingAgent
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {isProcessingAgent ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

              {/* Métriques */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{agent.processedCases}</div>
                  <div className="text-xs text-gray-500">Cas traités</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{agent.successRate}%</div>
                  <div className="text-xs text-gray-500">Taux succès</div>
                </div>
              </div>

              {/* Zone d'upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(agent.id, e.target.files)}
                  className="hidden"
                  id={`upload-${agent.id}`}
                />
                <label
                  htmlFor={`upload-${agent.id}`}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload dossiers</span>
                  <span className="text-xs text-gray-500">
                    {uploadedFiles[agent.id]?.length || 0} fichier(s)
                  </span>
                </label>
              </div>

              {/* Résultat du dernier traitement */}
              {result && (
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Dernier résultat</span>
                    <span className={`text-sm font-bold ${result.score >= 80 ? 'text-red-600' : result.score >= 60 ? 'text-orange-600' : 'text-green-600'}`}>
                      Score: {result.score}/100
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {result.detectedAnomalies} anomalie(s) détectée(s)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Détail de l'agent sélectionné */}
      {selectedAgent && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-${selectedAgent.color}-100`}>
                <selectedAgent.icon className={`w-8 h-8 text-${selectedAgent.color}-600`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedAgent.name}</h3>
                <p className="text-gray-600">{selectedAgent.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Règles métier */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Règles Métier</h4>
              <div className="space-y-2">
                {selectedAgent.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Types de données */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Types de Données</h4>
              <div className="space-y-2">
                {selectedAgent.dataTypes.map((dataType, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{dataType}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration et actions */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  Configurer
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Play className="w-4 h-4" />
                  Exécuter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Exporter Résultats
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Dernière exécution: {new Date(selectedAgent.lastRun).toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsSpecializedPanel;

