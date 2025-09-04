import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Brain, 
  Network, 
  Clock, 
  Calculator, 
  Search,
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const AgentsDetailedView = () => {
  const [selectedAgent, setSelectedAgent] = useState('collecte');
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  // Données simulées des cas de fraude détectés par agent
  const agentCases = {
    'collecte': [
      {
        id: 'COL_001',
        type: 'Format invalide',
        severity: 'medium',
        patient: 'M. Hassan B****',
        medecin: 'Dr. Ahmed T****',
        pharmacie: 'Pharmacie Al Andalous',
        montant: '2,450 MAD',
        date: '2025-01-15 14:30',
        description: 'Ordonnance avec format PDF corrompu, extraction OCR partielle',
        status: 'En cours',
        confidence: 78,
        details: {
          fichierOriginal: 'ordonnance_15012025.pdf',
          erreurOCR: 'Codes CIM-10 illisibles',
          actionRequise: 'Validation manuelle'
        }
      },
      {
        id: 'COL_002',
        type: 'Données manquantes',
        severity: 'high',
        patient: 'Mme. Fatima L****',
        medecin: 'Dr. Mohamed K****',
        pharmacie: 'Pharmacie Atlas',
        montant: '5,200 MAD',
        date: '2025-01-15 11:15',
        description: 'Facture sans codes ATC correspondants aux médicaments prescrits',
        status: 'Alerte',
        confidence: 92,
        details: {
          medicamentsManquants: ['Humira 40mg', 'Methotrexate 15mg'],
          codesATCAbsents: 3,
          actionRequise: 'Investigation approfondie'
        }
      }
    ],
    'comportemental': [
      {
        id: 'COMP_001',
        type: 'Changement brutal consommation',
        severity: 'high',
        patient: 'M. Youssef M****',
        medecin: 'Dr. Aicha B****',
        pharmacie: 'Pharmacie Centrale',
        montant: '8,900 MAD',
        date: '2025-01-15 16:45',
        description: 'Augmentation de 400% des consultations spécialisées en 2 mois',
        status: 'Investigation',
        confidence: 89,
        details: {
          consultationsAvant: 2,
          consultationsApres: 12,
          specialites: ['Cardiologie', 'Rhumatologie', 'Neurologie'],
          periodeAnalysee: '2 mois'
        }
      },
      {
        id: 'COMP_002',
        type: 'Pattern temporel suspect',
        severity: 'medium',
        patient: 'Mme. Khadija R****',
        medecin: 'Dr. Omar F****',
        pharmacie: 'Pharmacie Moderne',
        montant: '3,200 MAD',
        date: '2025-01-15 09:20',
        description: 'Consultations concentrées uniquement les vendredis après-midi',
        status: 'Surveillance',
        confidence: 74,
        details: {
          joursSemaine: ['Vendredi'],
          heuresConsultation: '14h-18h',
          frequence: 'Hebdomadaire',
          duree: '3 mois'
        }
      }
    ],
    'relationnel': [
      {
        id: 'REL_001',
        type: 'Réseau organisé détecté',
        severity: 'critical',
        patient: 'Réseau de 15 patients',
        medecin: 'Dr. Rachid A**** + 3 autres',
        pharmacie: 'Pharmacie Network (5 officines)',
        montant: '45,600 MAD',
        date: '2025-01-15 13:10',
        description: 'Réseau coordonné avec rotation systématique patient-médecin-pharmacie',
        status: 'Alerte Critique',
        confidence: 96,
        details: {
          nombrePatients: 15,
          nombreMedecins: 4,
          nombrePharmacies: 5,
          regions: ['Casablanca', 'Rabat'],
          dureeActivite: '6 mois'
        }
      }
    ],
    'temporel': [
      {
        id: 'TEMP_001',
        type: 'Concentration temporelle anormale',
        severity: 'high',
        patient: 'M. Abdellah K****',
        medecin: 'Dr. Samira H****',
        pharmacie: 'Pharmacie du Centre',
        montant: '12,300 MAD',
        date: '2025-01-15 17:30',
        description: 'Toutes les prescriptions émises entre 17h45 et 18h00',
        status: 'Investigation',
        confidence: 85,
        details: {
          creneauHoraire: '17h45-18h00',
          nombrePrescriptions: 8,
          periodeAnalysee: '1 mois',
          joursSemaine: ['Lundi', 'Mercredi', 'Vendredi']
        }
      }
    ],
    'scoring': [
      {
        id: 'SCOR_001',
        type: 'Score de risque élevé',
        severity: 'high',
        patient: 'Mme. Zineb T****',
        medecin: 'Dr. Karim L****',
        pharmacie: 'Pharmacie Nouvelle',
        montant: '7,800 MAD',
        date: '2025-01-15 12:00',
        description: 'Score composite de 94/100 basé sur multiple critères',
        status: 'Validation requise',
        confidence: 94,
        details: {
          scoreComposite: 94,
          facteursPrincipaux: ['Montant élevé', 'Fréquence anormale', 'Réseau suspect'],
          seuilAlerte: 85,
          recommandation: 'Investigation immédiate'
        }
      }
    ],
    'investigation': [
      {
        id: 'INV_001',
        type: 'Enquête approfondie',
        severity: 'critical',
        patient: 'Dossier complexe multi-patients',
        medecin: 'Dr. Nadia M**** (principal)',
        pharmacie: 'Réseau de 3 pharmacies',
        montant: '89,400 MAD',
        date: '2025-01-15 10:45',
        description: 'Investigation multi-dimensionnelle révélant un schéma de fraude organisée',
        status: 'En cours d\'investigation',
        confidence: 98,
        details: {
          dureeEnquete: '2 semaines',
          elementsAnalyses: 156,
          preuves: 'Documents falsifiés, témoignages, analyses financières',
          prochainEtape: 'Rapport final'
        }
      }
    ]
  };

  const agentConfigs = {
    'collecte': {
      name: 'Agent de Collecte',
      icon: Database,
      color: 'blue',
      description: 'Ingestion et normalisation des données AMO',
      totalCases: 103,
      activeCases: 23,
      resolvedCases: 80,
      successRate: 82
    },
    'comportemental': {
      name: 'Agent Comportemental',
      icon: Brain,
      color: 'purple',
      description: 'Analyse des patterns comportementaux',
      totalCases: 67,
      activeCases: 12,
      resolvedCases: 55,
      successRate: 84
    },
    'relationnel': {
      name: 'Agent Relationnel',
      icon: Network,
      color: 'green',
      description: 'Détection de réseaux frauduleux',
      totalCases: 34,
      activeCases: 8,
      resolvedCases: 26,
      successRate: 91
    },
    'temporel': {
      name: 'Agent Temporel',
      icon: Clock,
      color: 'orange',
      description: 'Analyse des anomalies temporelles',
      totalCases: 45,
      activeCases: 7,
      resolvedCases: 38,
      successRate: 87
    },
    'scoring': {
      name: 'Agent de Scoring',
      icon: Calculator,
      color: 'red',
      description: 'Calcul et priorisation des scores',
      totalCases: 156,
      activeCases: 31,
      resolvedCases: 125,
      successRate: 93
    },
    'investigation': {
      name: 'Agent d\'Investigation',
      icon: Search,
      color: 'cyan',
      description: 'Investigation approfondie des cas complexes',
      totalCases: 28,
      activeCases: 5,
      resolvedCases: 23,
      successRate: 96
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Activity;
      case 'low': return CheckCircle;
      default: return Activity;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const currentAgent = agentConfigs[selectedAgent];
  const currentCases = agentCases[selectedAgent] || [];
  const IconComponent = currentAgent?.icon || Database;

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'agent */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vue Détaillée des Agents</h2>
          <p className="text-slate-600">Analyse approfondie des cas de fraude détectés par agent</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="1h">Dernière heure</option>
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Sélection d'agent */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(agentConfigs).map(([key, agent]) => {
          const AgentIcon = agent.icon;
          const isSelected = selectedAgent === key;
          
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedAgent(key)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <AgentIcon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
                <div className="text-xs text-slate-600 mt-1">
                  {agent.activeCases} cas actifs
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Détails de l'agent sélectionné */}
      {currentAgent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Métriques de l'agent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconComponent className="w-5 h-5" />
                <span>{currentAgent.name}</span>
              </CardTitle>
              <CardDescription>{currentAgent.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{currentAgent.totalCases}</div>
                  <div className="text-xs text-slate-600">Total cas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentAgent.successRate}%</div>
                  <div className="text-xs text-slate-600">Taux succès</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cas actifs</span>
                  <span className="font-semibold text-orange-600">{currentAgent.activeCases}</span>
                </div>
                <Progress value={(currentAgent.activeCases / currentAgent.totalCases) * 100} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Cas résolus</span>
                  <span className="font-semibold text-green-600">{currentAgent.resolvedCases}</span>
                </div>
                <Progress value={(currentAgent.resolvedCases / currentAgent.totalCases) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Liste des cas détectés */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Cas de Fraude Détectés ({currentCases.length})</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentCases.map((cas) => {
                    const SeverityIcon = getSeverityIcon(cas.severity);
                    
                    return (
                      <Card key={cas.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <Badge className={getSeverityColor(cas.severity)}>
                                <SeverityIcon className="w-3 h-3 mr-1" />
                                {cas.severity.toUpperCase()}
                              </Badge>
                              <span className="font-semibold text-slate-900">{cas.id}</span>
                              <span className="text-sm text-slate-600">{cas.type}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-900">{cas.montant}</div>
                              <div className="text-xs text-slate-600">{cas.date}</div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-700 mb-3">{cas.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-slate-600">Patient:</span>
                              <div className="font-medium">{cas.patient}</div>
                            </div>
                            <div>
                              <span className="text-slate-600">Médecin:</span>
                              <div className="font-medium">{cas.medecin}</div>
                            </div>
                            <div>
                              <span className="text-slate-600">Pharmacie:</span>
                              <div className="font-medium">{cas.pharmacie}</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline">{cas.status}</Badge>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-slate-600">Confiance:</span>
                                <span className="text-xs font-semibold">{cas.confidence}%</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {currentCases.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun cas détecté pour cet agent dans la période sélectionnée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsDetailedView;

