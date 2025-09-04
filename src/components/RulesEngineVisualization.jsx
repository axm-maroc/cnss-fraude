import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Play, 
  Pause, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Target,
  Zap,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Code,
  GitBranch,
  Layers,
  Workflow
} from 'lucide-react';

const RulesEngineVisualization = () => {
  const [selectedCategory, setSelectedCategory] = useState('detection');
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Configuration des règles par catégorie
  const rulesCategories = {
    detection: {
      name: 'Règles de Détection',
      icon: Target,
      color: 'blue',
      description: 'Règles principales de détection de fraude',
      rules: [
        {
          id: 'DET_001',
          name: 'Montant Prescription Élevé',
          status: 'active',
          priority: 'high',
          condition: 'montant_prescription > 5000 MAD',
          action: 'Alerte automatique + Investigation',
          threshold: 5000,
          confidence: 95,
          lastTriggered: '2025-01-15 14:30',
          triggerCount: 23,
          description: 'Détecte les prescriptions avec montant anormalement élevé'
        },
        {
          id: 'DET_002',
          name: 'Fréquence Consultation Anormale',
          status: 'active',
          priority: 'medium',
          condition: 'consultations_mois > 15',
          action: 'Surveillance renforcée',
          threshold: 15,
          confidence: 87,
          lastTriggered: '2025-01-15 11:20',
          triggerCount: 12,
          description: 'Identifie les patients avec fréquence de consultation excessive'
        },
        {
          id: 'DET_003',
          name: 'Réseau Médecin-Pharmacie',
          status: 'active',
          priority: 'critical',
          condition: 'prescriptions_croisees > 10 AND distance_geo < 500m',
          action: 'Investigation immédiate',
          threshold: 10,
          confidence: 92,
          lastTriggered: '2025-01-15 09:45',
          triggerCount: 7,
          description: 'Détecte les réseaux organisés médecin-pharmacie'
        }
      ]
    },
    scoring: {
      name: 'Règles de Scoring',
      icon: BarChart3,
      color: 'green',
      description: 'Algorithmes de calcul des scores de risque',
      rules: [
        {
          id: 'SCO_001',
          name: 'Score Composite Patient',
          status: 'active',
          priority: 'high',
          condition: 'WEIGHTED_SUM(montant*0.3, frequence*0.4, historique*0.3)',
          action: 'Calcul score 0-100',
          threshold: 85,
          confidence: 94,
          lastTriggered: '2025-01-15 16:15',
          triggerCount: 156,
          description: 'Calcule le score de risque global du patient'
        },
        {
          id: 'SCO_002',
          name: 'Score Médecin Prescripteur',
          status: 'active',
          priority: 'medium',
          condition: 'AVG(prescriptions_montant) * deviation_standard',
          action: 'Score médecin 0-100',
          threshold: 75,
          confidence: 89,
          lastTriggered: '2025-01-15 13:30',
          triggerCount: 89,
          description: 'Évalue le risque associé au médecin prescripteur'
        }
      ]
    },
    temporal: {
      name: 'Règles Temporelles',
      icon: Activity,
      color: 'orange',
      description: 'Détection des patterns temporels suspects',
      rules: [
        {
          id: 'TMP_001',
          name: 'Concentration Horaire',
          status: 'active',
          priority: 'medium',
          condition: 'prescriptions_17h_18h > 60% total_journalier',
          action: 'Alerte pattern temporel',
          threshold: 60,
          confidence: 78,
          lastTriggered: '2025-01-15 18:05',
          triggerCount: 34,
          description: 'Détecte la concentration anormale sur certaines heures'
        },
        {
          id: 'TMP_002',
          name: 'Pic Fin de Mois',
          status: 'active',
          priority: 'low',
          condition: 'prescriptions_j25_j31 > 40% total_mensuel',
          action: 'Surveillance',
          threshold: 40,
          confidence: 65,
          lastTriggered: '2025-01-14 20:30',
          triggerCount: 18,
          description: 'Identifie les pics suspects en fin de mois'
        }
      ]
    },
    validation: {
      name: 'Règles de Validation',
      icon: CheckCircle,
      color: 'purple',
      description: 'Validation et conformité des données',
      rules: [
        {
          id: 'VAL_001',
          name: 'Cohérence Diagnostic-Prescription',
          status: 'active',
          priority: 'high',
          condition: 'MATCH(diagnostic_cim10, medicament_atc)',
          action: 'Validation automatique',
          threshold: 95,
          confidence: 98,
          lastTriggered: '2025-01-15 15:45',
          triggerCount: 203,
          description: 'Vérifie la cohérence entre diagnostic et prescription'
        },
        {
          id: 'VAL_002',
          name: 'Dosage Réglementaire',
          status: 'active',
          priority: 'medium',
          condition: 'dosage <= dosage_max_autorise',
          action: 'Contrôle conformité',
          threshold: 100,
          confidence: 99,
          lastTriggered: '2025-01-15 14:20',
          triggerCount: 178,
          description: 'Contrôle le respect des dosages réglementaires'
        }
      ]
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      testing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.active;
  };

  const currentCategory = rulesCategories[selectedCategory];
  const filteredRules = currentCategory?.rules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditRule = (rule) => {
    setEditingRule(rule);
  };

  const handleSaveRule = () => {
    // Logique de sauvegarde
    setEditingRule(null);
  };

  const handleDeleteRule = (ruleId) => {
    // Logique de suppression
    console.log('Suppression règle:', ruleId);
  };

  const handleTestRule = (rule) => {
    // Logique de test de règle
    console.log('Test règle:', rule.id);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Moteur de Règles</h2>
          <p className="text-slate-600">Configuration et visualisation des règles de détection de fraude</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Règle
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-slate-600">Règles Totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">21</div>
                <div className="text-sm text-slate-600">Actives</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-slate-600">Déclenchements/24h</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-slate-600">Précision</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par catégories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(rulesCategories).map(([key, category]) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === key;
          
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedCategory(key)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <IconComponent className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{category.name}</h3>
                <div className="text-xs text-slate-600 mt-1">
                  {category.rules.length} règles
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interface principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des règles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {currentCategory && <currentCategory.icon className="w-5 h-5" />}
                    <span>{currentCategory?.name}</span>
                  </CardTitle>
                  <CardDescription>{currentCategory?.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Rechercher une règle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRules.map((rule) => (
                  <Card key={rule.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={getPriorityColor(rule.priority)}>
                            {rule.priority.toUpperCase()}
                          </Badge>
                          <span className="font-semibold text-slate-900">{rule.id}</span>
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleTestRule(rule)}>
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{rule.name}</h3>
                      <p className="text-sm text-slate-700 mb-3">{rule.description}</p>
                      
                      <div className="bg-slate-50 p-3 rounded-lg mb-3">
                        <div className="text-xs text-slate-600 mb-1">Condition:</div>
                        <code className="text-sm font-mono text-slate-900">{rule.condition}</code>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-600">Action:</span>
                          <div className="font-medium">{rule.action}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Seuil:</span>
                          <div className="font-medium">{rule.threshold}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Confiance:</span>
                          <div className="font-medium">{rule.confidence}%</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Déclenchements:</span>
                          <div className="font-medium">{rule.triggerCount}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-slate-500">
                        Dernier déclenchement: {rule.lastTriggered}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau de configuration */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuration Avancée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Paramètres Globaux</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mode Debug</span>
                    <Button variant="outline" size="sm">OFF</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-apprentissage</span>
                    <Button variant="outline" size="sm">ON</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Seuil global</span>
                    <Input className="w-16 h-8" defaultValue="85" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Temps moyen d'exécution</span>
                    <span className="font-medium">2.3ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Règles/seconde</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taux de succès</span>
                    <span className="font-medium text-green-600">94.2%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Actions Rapides</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recharger Règles
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Logs d'Exécution
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistiques
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RulesEngineVisualization;

