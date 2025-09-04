import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Play, Pause, Settings, Database, FileText, Brain, Search, Network, Clock, Calculator, Eye, Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import AgentDetailModal from './AgentDetailModal';

const AgentsSpecializedPanelEnriched = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [agentResults, setAgentResults] = useState({});
  const [isProcessing, setIsProcessing] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgentForModal, setSelectedAgentForModal] = useState(null);

  // Configuration des agents spécialisés avec leurs règles métier
  const agentConfigs = {
    'collecte': {
      id: 'collecte',
      name: 'Agent de Collecte',
      icon: Database,
      color: 'blue',
      description: 'Ingestion et normalisation des données AMO',
      casesProcessed: 103,
      successRate: '82%',
      rules: [
        'Validation format des ordonnances (PDF, JPG, PNG)',
        'Extraction OCR des données médicales',
        'Normalisation codes CIM-10 et ATC',
        'Vérification intégrité des données',
        'Enrichissement avec référentiels CNSS'
      ],
      dataTypes: ['Ordonnances', 'Factures', 'Rapports médicaux', 'Certificats'],
      apiEndpoint: '/api/agents/collecte',
      status: 'active',
      metrics: {
        casesProcessed: 103,
        successRate: '82%',
        anomaliesDetected: 8,
        avgProcessingTime: '2.3s'
      }
    },
    'comportemental': {
      id: 'comportemental',
      name: 'Agent Comportemental',
      icon: Brain,
      color: 'purple',
      description: 'Analyse des patterns comportementaux individuels',
      casesProcessed: 53,
      successRate: '84%',
      rules: [
        'Détection changements brutaux de consommation',
        'Analyse fréquence consultations par spécialité',
        'Identification patterns temporels suspects',
        'Scoring comportement patient/médecin',
        'Comparaison avec profils similaires'
      ],
      dataTypes: ['Historique consultations', 'Profils patients', 'Données temporelles'],
      apiEndpoint: '/api/agents/comportemental',
      status: 'active',
      metrics: {
        casesProcessed: 53,
        successRate: '84%',
        anomaliesDetected: 12,
        avgProcessingTime: '4.7s'
      }
    },
    'relationnel': {
      id: 'relationnel',
      name: 'Agent Relationnel',
      icon: Network,
      color: 'green',
      description: 'Détection de réseaux frauduleux organisés',
      casesProcessed: 62,
      successRate: '85%',
      rules: [
        'Analyse graphes de relations médecin-patient-pharmacie',
        'Détection clusters suspects',
        'Identification réseaux multi-régionaux',
        'Scoring complexité réseau',
        'Alerte réseaux organisés'
      ],
      dataTypes: ['Relations médecin-patient', 'Réseaux pharmacies', 'Données géographiques'],
      apiEndpoint: '/api/agents/relationnel',
      status: 'active',
      metrics: {
        casesProcessed: 62,
        successRate: '85%',
        anomaliesDetected: 3,
        avgProcessingTime: '8.2s'
      }
    },
    'temporel': {
      id: 'temporel',
      name: 'Agent Temporel',
      icon: Clock,
      color: 'orange',
      description: 'Analyse des anomalies temporelles',
      casesProcessed: 51,
      successRate: '99%',
      rules: [
        'Détection concentrations horaires anormales',
        'Analyse patterns saisonniers',
        'Identification consultations post-décès',
        'Vérification cohérence temporelle',
        'Alerte activité nocturne/weekend'
      ],
      dataTypes: ['Horodatage consultations', 'Calendriers médicaux', 'Données temporelles'],
      apiEndpoint: '/api/agents/temporel',
      status: 'active',
      metrics: {
        casesProcessed: 51,
        successRate: '99%',
        anomaliesDetected: 7,
        avgProcessingTime: '1.8s'
      }
    },
    'scoring': {
      id: 'scoring',
      name: 'Agent de Scoring',
      icon: Calculator,
      color: 'red',
      description: 'Calcul et priorisation des scores de risque',
      casesProcessed: 100,
      successRate: '86%',
      rules: [
        'Calcul score composite multi-critères',
        'Pondération selon type de fraude',
        'Priorisation automatique des cas',
        'Seuils adaptatifs par région',
        'Scoring prédictif ML'
      ],
      dataTypes: ['Données consolidées', 'Historiques scoring', 'Référentiels risque'],
      apiEndpoint: '/api/agents/scoring',
      status: 'active',
      metrics: {
        casesProcessed: 100,
        successRate: '86%',
        anomaliesDetected: 15,
        avgProcessingTime: '3.1s'
      }
    },
    'investigation': {
      id: 'investigation',
      name: 'Agent d\'Investigation',
      icon: Search,
      color: 'cyan',
      description: 'Investigation approfondie des cas complexes',
      casesProcessed: 144,
      successRate: '89%',
      rules: [
        'Investigation multi-sources',
        'Vérification identités médicales',
        'Contrôle existence cabinets',
        'Validation patients réels',
        'Génération rapports investigation'
      ],
      dataTypes: ['Dossiers complexes', 'Sources externes', 'Rapports terrain'],
      apiEndpoint: '/api/agents/investigation',
      status: 'active',
      metrics: {
        casesProcessed: 144,
        successRate: '89%',
        anomaliesDetected: 22,
        avgProcessingTime: '12.5s'
      }
    }
  };

  const handleFileUpload = (agentId, files) => {
    setUploadedFiles(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), ...files]
    }));
  };

  const handleProcessAgent = async (agentId) => {
    setIsProcessing(prev => ({ ...prev, [agentId]: true }));
    
    // Simulation du traitement
    setTimeout(() => {
      setAgentResults(prev => ({
        ...prev,
        [agentId]: {
          status: 'completed',
          anomalies: Math.floor(Math.random() * 10) + 1,
          score: Math.floor(Math.random() * 40) + 60,
          processedAt: new Date().toLocaleTimeString()
        }
      }));
      setIsProcessing(prev => ({ ...prev, [agentId]: false }));
    }, 3000);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      purple: 'border-purple-200 bg-purple-50',
      green: 'border-green-200 bg-green-50',
      orange: 'border-orange-200 bg-orange-50',
      red: 'border-red-200 bg-red-50',
      cyan: 'border-cyan-200 bg-cyan-50'
    };
    return colors[color] || colors.blue;
  };

  const getBadgeColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      cyan: 'bg-cyan-100 text-cyan-800'
    };
    return colors[color] || colors.blue;
  };

  const handleViewDetails = (agent) => {
    setSelectedAgentForModal(agent);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agents Spécialisés</h2>
          <p className="text-slate-600">Gestion et configuration des agents IA avec règles métier spécifiques</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          6 Agents Actifs
        </Badge>
      </div>

      {/* Grille des agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(agentConfigs).map((agent) => {
          const IconComponent = agent.icon;
          const result = agentResults[agent.id];
          const isProcessingAgent = isProcessing[agent.id];
          const files = uploadedFiles[agent.id] || [];

          return (
            <Card key={agent.id} className={`${getColorClasses(agent.color)} transition-all hover:shadow-lg`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getBadgeColor(agent.color)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge variant="outline" className={`text-xs ${getBadgeColor(agent.color)}`}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(agent)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Métriques */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{agent.casesProcessed}</div>
                    <div className="text-xs text-slate-600">Cas traités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{agent.successRate}</div>
                    <div className="text-xs text-slate-600">Taux succès</div>
                  </div>
                </div>

                {/* Règles métier (aperçu) */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                    <Settings className="w-4 h-4 mr-1" />
                    Règles Métier ({agent.rules.length})
                  </h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    {agent.rules.slice(0, 2).map((rule, index) => (
                      <div key={index} className="flex items-start space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{rule}</span>
                      </div>
                    ))}
                    {agent.rules.length > 2 && (
                      <div className="text-blue-600 cursor-pointer hover:underline"
                           onClick={() => handleViewDetails(agent)}>
                        +{agent.rules.length - 2} autres règles...
                      </div>
                    )}
                  </div>
                </div>

                {/* Zone d'upload */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-600 mb-2">Upload dossiers</div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id={`upload-${agent.id}`}
                    onChange={(e) => handleFileUpload(agent.id, Array.from(e.target.files))}
                  />
                  <label
                    htmlFor={`upload-${agent.id}`}
                    className="text-xs text-blue-600 cursor-pointer hover:underline"
                  >
                    {files.length} fichier(s)
                  </label>
                </div>

                {/* Résultats */}
                {result && (
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Résultats</span>
                      <Badge variant={result.score > 80 ? 'destructive' : result.score > 60 ? 'orange' : 'green'}>
                        Score: {result.score}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Anomalies détectées: {result.anomalies}</div>
                      <div>Traité à: {result.processedAt}</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleProcessAgent(agent.id)}
                    disabled={isProcessingAgent}
                    className="flex-1"
                  >
                    {isProcessingAgent ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Analyser
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(agent)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Barre de progression */}
                {isProcessingAgent && (
                  <div className="space-y-2">
                    <Progress value={66} className="h-2" />
                    <div className="text-xs text-slate-600 text-center">
                      Analyse en cours...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistiques globales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-slate-600" />
            <span>Performance Globale des Agents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">513</div>
              <div className="text-sm text-slate-600">Total Cas Traités</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-slate-600">Taux Succès Moyen</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">67</div>
              <div className="text-sm text-slate-600">Anomalies Détectées</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">5.1s</div>
              <div className="text-sm text-slate-600">Temps Moyen</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de détail */}
      <AgentDetailModal
        agent={selectedAgentForModal}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAgentForModal(null);
        }}
      />
    </div>
  );
};

export default AgentsSpecializedPanelEnriched;

