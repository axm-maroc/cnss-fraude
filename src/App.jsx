import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Bell, 
  Bot, 
  Brain,
  CheckCircle, 
  Clock, 
  Download, 
  ExternalLink, 
  Eye, 
  Filter, 
  GitBranch, 
  LineChart, 
  MapPin, 
  PieChart, 
  Search, 
  Settings,
  Shield, 
  TrendingUp, 
  Users, 
  Zap,
  DollarSign,
  Target,
  Database,
  Network,
  Sparkles
} from 'lucide-react'
import './App.css'
import AIGenerativePanel from './components/AIGenerativePanel'
import InvestigationPanel from './components/InvestigationPanel'
import AgentsAvancesPanel from './components/AgentsAvancesPanel'
import DrillDownPanel from './components/DrillDownPanel'
import SupabaseSearchPanel from './components/SupabaseSearchPanel'
import UnifiedDetectionInterface from './components/UnifiedDetectionInterface'
import AgentsSpecializedPanelEnriched from './components/AgentsSpecializedPanelEnriched'
import AgentsDetailedView from './components/AgentsDetailedView'
import RulesEngineVisualization from './components/RulesEngineVisualization'
import ProtocolesTherapeutiquesPanel from './components/ProtocolesTherapeutiquesPanel'
// Import des assets
import architectureImg from './assets/axm_architecture_technique_cnss.png'
import processusImg from './assets/axm_processus_metier_cnss.png'
import deploiementImg from './assets/axm_deploiement_progressif.png'
import avantagesImg from './assets/axm_avantages_concurrentiels.png'
import kpisImg from './assets/axm_kpis_performance.png'

function App() {
  const [activeTab, setActiveTab] = useState('detection')
  const [realTimeData, setRealTimeData] = useState({
    detectionRate: 90,
    falsePositives: 12,
    transactionsPerMin: 10000,
    amountDetected: 300,
    systemUptime: 99.5
  })

  // Simulation de données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        transactionsPerMin: Math.floor(Math.random() * 2000) + 9000,
        detectionRate: Math.floor(Math.random() * 5) + 88,
        falsePositives: Math.floor(Math.random() * 3) + 10
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const agents = [
    {
      id: 1,
      name: "Agent de Collecte",
      icon: Download,
      status: "active",
      description: "Ingestion et normalisation des données AMO en temps réel",
      metrics: {
        transactionsPerSec: 167,
        successRate: 99.8
      }
    },
    {
      id: 2,
      name: "Agent Comportemental",
      icon: Users,
      status: "active",
      description: "Analyse des patterns comportementaux individuels",
      metrics: {
        profilesAnalyzed: 1247,
        anomaliesDetected: 23
      }
    },
    {
      id: 3,
      name: "Agent Relationnel",
      icon: Network,
      status: "active",
      description: "Détection de réseaux frauduleux et analyse de liens",
      metrics: {
        networksIdentified: 7,
        connectionsAnalyzed: 15432
      }
    },
    {
      id: 4,
      name: "Agent Temporel",
      icon: Clock,
      status: "active",
      description: "Analyse des patterns temporels et saisonnalités",
      metrics: {
        sequencesAnalyzed: 892,
        suspiciousPatterns: 12
      }
    },
    {
      id: 5,
      name: "Agent de Scoring",
      icon: BarChart3,
      status: "active",
      description: "Calcul de scores de risque et priorisation des alertes",
      metrics: {
        scoresCalculated: 2156,
        alertsGenerated: 47
      }
    }
  ]

  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Réseau frauduleux détecté",
      description: "Détection d'un réseau organisé impliquant 7 prescripteurs et 3 pharmacies",
      score: 95,
      amount: "2.3M MAD",
      region: "Casablanca",
      time: "Il y a 5 min"
    },
    {
      id: 2,
      type: "high",
      title: "Prescription anormale détectée",
      description: "Volume de prescriptions 400% supérieur à la moyenne pour ce praticien",
      score: 87,
      amount: "450K MAD",
      region: "Dr. M****",
      time: "Il y a 12 min"
    },
    {
      id: 3,
      type: "medium",
      title: "Pattern temporel suspect",
      description: "Concentration anormale de consultations en fin de journée",
      score: 72,
      amount: "180K MAD",
      region: "18h-20h",
      time: "Il y a 25 min"
    }
  ]

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'destructive'
      case 'high': return 'orange'
      case 'medium': return 'yellow'
      default: return 'secondary'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return AlertTriangle
      case 'high': return AlertTriangle
      case 'medium': return AlertTriangle
      default: return AlertTriangle
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AXM</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Solution IA Multi-Agents</h1>
                  <p className="text-sm text-slate-600">Détection de Fraude CNSS</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">Système Opérationnel</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                3
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="detection" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Détection Unifiée</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Agents Spécialisés</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Moteur de Règles</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <LineChart className="w-4 h-4" />
              <span>Tableau de Bord</span>
            </TabsTrigger>
            <TabsTrigger value="supabase" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Base de Données</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Agents Spécialisés Tab */}
          <TabsContent value="agents" className="space-y-6">
            <Tabs defaultValue="detailed" className="space-y-4">
              <TabsList>
                <TabsTrigger value="detailed">Vue Détaillée</TabsTrigger>
                <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
                <TabsTrigger value="protocols">Protocoles Thérapeutiques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detailed">
                <AgentsDetailedView />
              </TabsContent>
              
              <TabsContent value="overview">
                <AgentsSpecializedPanelEnriched />
              </TabsContent>
              
              <TabsContent value="protocols">
                <ProtocolesTherapeutiquesPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Detection Tab */}
          <TabsContent value="detection" className="space-y-6">
            <UnifiedDetectionInterface />
          </TabsContent>

          {/* Rules Engine Tab */}
          <TabsContent value="rules" className="space-y-6">
            <RulesEngineVisualization />
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Tableau de Bord - Détection en Temps Réel</h2>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Surveillance Active</span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Détection</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.detectionRate}%</div>
                  <div className="flex items-center space-x-2 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+25% vs précédent</span>
                  </div>
                  <Progress value={realTimeData.detectionRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Objectif: 90%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faux Positifs</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.falsePositives}%</div>
                  <div className="flex items-center space-x-2 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 rotate-180" />
                    <span>-8% vs précédent</span>
                  </div>
                  <Progress value={realTimeData.falsePositives} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Objectif: &lt;15%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions/Min</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.transactionsPerMin.toLocaleString()}</div>
                  <div className="flex items-center space-x-2 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+15% vs précédent</span>
                  </div>
                  <Progress value={100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Capacité maximale</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Montant Détecté</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.amountDetected}M</div>
                  <div className="text-xs text-muted-foreground">MAD/an</div>
                  <Progress value={85} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">vs 180M précédent</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Architecture Multi-Agents</CardTitle>
                  <CardDescription>
                    5 agents spécialisés coordonnés par un orchestrateur central
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src={architectureImg} 
                    alt="Architecture AXM" 
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processus de Détection</CardTitle>
                  <CardDescription>
                    Workflow optimisé pour la détection temps réel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src={processusImg} 
                    alt="Processus AXM" 
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Activité en Temps Réel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Transaction validée</p>
                      <p className="text-xs text-muted-foreground">Score: 15/100 - Prescription normale détectée</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 2s</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Alerte générée</p>
                      <p className="text-xs text-muted-foreground">Score: 78/100 - Pattern suspect identifié</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 15s</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Agent mis à jour</p>
                      <p className="text-xs text-muted-foreground">Agent Comportemental - Nouveau modèle déployé</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 1m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drill-Down Tab */}
          <TabsContent value="drill-down" className="space-y-6">
            <DrillDownPanel />
          </TabsContent>

          {/* Supabase Search Tab */}
          <TabsContent value="supabase" className="space-y-6">
            <SupabaseSearchPanel />
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Agents IA Spécialisés</h2>
              <p className="text-slate-600">Architecture multi-agents pour une détection optimale</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => {
                const IconComponent = agent.icon
                return (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {agent.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">{agent.description}</p>
                      <div className="space-y-2">
                        {Object.entries(agent.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              {key === 'transactionsPerSec' && 'Transactions/sec'}
                              {key === 'successRate' && 'Taux de succès'}
                              {key === 'profilesAnalyzed' && 'Profils analysés'}
                              {key === 'anomaliesDetected' && 'Anomalies détectées'}
                              {key === 'networksIdentified' && 'Réseaux identifiés'}
                              {key === 'connectionsAnalyzed' && 'Connexions analysées'}
                              {key === 'sequencesAnalyzed' && 'Séquences analysées'}
                              {key === 'suspiciousPatterns' && 'Patterns suspects'}
                              {key === 'scoresCalculated' && 'Scores calculés'}
                              {key === 'alertsGenerated' && 'Alertes générées'}
                            </span>
                            <span className="font-medium">
                              {typeof value === 'number' && value > 1000 
                                ? value.toLocaleString() 
                                : value}{key === 'successRate' ? '%' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Architecture Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Architecture Technique Détaillée</CardTitle>
                <CardDescription>
                  Schéma complet de l'architecture multi-agents AXM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src={architectureImg} 
                  alt="Architecture technique AXM" 
                  className="w-full h-auto rounded-lg border"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Alertes de Fraude</h2>
                <div className="flex space-x-4 mt-2">
                  <Badge variant="destructive">3 Critiques</Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">12 Élevées</Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">28 Moyennes</Badge>
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type)
                return (
                  <Card key={alert.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alert.type === 'critical' ? 'bg-red-100' :
                          alert.type === 'high' ? 'bg-orange-100' : 'bg-yellow-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            alert.type === 'critical' ? 'text-red-600' :
                            alert.type === 'high' ? 'text-orange-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                            <span className="text-sm text-slate-500">{alert.time}</span>
                          </div>
                          <p className="text-slate-600 mb-3">{alert.description}</p>
                          <div className="flex space-x-4 text-sm">
                            <span className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>Score: {alert.score}/100</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Montant: {alert.amount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{alert.region}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Investiguer
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics Avancées</h2>
              <p className="text-slate-600">Insights et tendances de la détection de fraude</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KPIs Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>KPIs de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={kpisImg} 
                    alt="KPIs Performance AXM" 
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>

              {/* Déploiement */}
              <Card>
                <CardHeader>
                  <CardTitle>Planning de Déploiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={deploiementImg} 
                    alt="Déploiement AXM" 
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>

              {/* Avantages Concurrentiels */}
              <Card>
                <CardHeader>
                  <CardTitle>Avantages Concurrentiels</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={avantagesImg} 
                    alt="Avantages AXM" 
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>

              {/* ROI Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>ROI et Impact Financier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">127M</div>
                      <div className="text-sm text-slate-600">Gains Annuels (MAD)</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">406%</div>
                      <div className="text-sm text-slate-600">ROI Annuel</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">18M</div>
                      <div className="text-sm text-slate-600">Économies (MAD)</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">2.7</div>
                      <div className="text-sm text-slate-600">Délai Retour (mois)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Répartition Géographique */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition Géographique des Détections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: 'Casablanca', percentage: 85 },
                    { region: 'Rabat', percentage: 72 },
                    { region: 'Marrakech', percentage: 68 },
                    { region: 'Fès', percentage: 61 },
                    { region: 'Tanger', percentage: 55 }
                  ].map((item) => (
                    <div key={item.region} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium">{item.region}</div>
                      <div className="flex-1">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <div className="w-12 text-sm text-right">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interface de Détection Unifiée */}
          <TabsContent value="detection" className="space-y-6">
            <UnifiedDetectionInterface />
          </TabsContent>

          {/* Tableau de Bord */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs en temps réel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Détection</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.detectionRate}%</div>
                  <p className="text-xs text-muted-foreground">+25% vs précédent</p>
                  <div className="text-xs text-green-600">Objectif: 90%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faux Positifs</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.falsePositives}%</div>
                  <p className="text-xs text-muted-foreground">-8% vs précédent</p>
                  <div className="text-xs text-green-600">Objectif: &lt;15%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions/Min</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.transactionsPerMin.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+15% vs précédent</p>
                  <div className="text-xs text-blue-600">Capacité maximale</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Montant Détecté</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{realTimeData.amountDetected}M</div>
                  <p className="text-xs text-muted-foreground">MAD/an</p>
                  <div className="text-xs text-green-600">vs 180M précédent</div>
                </CardContent>
              </Card>
            </div>

            {/* Tableau de Bord par Agent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détection par Agent IA</CardTitle>
                  <CardDescription>Performance des 5 agents spécialisés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { agent: 'Agent Collecte', detections: 127, accuracy: 98, status: 'Actif' },
                      { agent: 'Agent Comportemental', detections: 89, accuracy: 94, status: 'Actif' },
                      { agent: 'Agent Relationnel', detections: 76, accuracy: 91, status: 'Actif' },
                      { agent: 'Agent Temporel', detections: 65, accuracy: 88, status: 'Actif' },
                      { agent: 'Agent Scoring', detections: 127, accuracy: 96, status: 'Actif' }
                    ].map((item) => (
                      <div key={item.agent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bot className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">{item.agent}</div>
                            <div className="text-sm text-gray-500">{item.detections} détections</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.accuracy}%</div>
                          <Badge variant="outline" className="text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Détection par Typologie</CardTitle>
                  <CardDescription>Répartition des fraudes par type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Réseau organisé', count: 23, amount: '45.2M MAD', color: 'bg-red-500' },
                      { type: 'Prescription excessive', count: 34, amount: '28.7M MAD', color: 'bg-orange-500' },
                      { type: 'Usurpation identité', count: 18, amount: '15.3M MAD', color: 'bg-yellow-500' },
                      { type: 'Fraude temporelle', count: 29, amount: '22.1M MAD', color: 'bg-blue-500' },
                      { type: 'Fraude coordonnée', count: 23, amount: '18.9M MAD', color: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${item.color}`}></div>
                          <div>
                            <div className="font-medium">{item.type}</div>
                            <div className="text-sm text-gray-500">{item.count} cas détectés</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.amount}</div>
                          <Button variant="outline" size="sm" className="mt-1">
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Base de Données */}
          <TabsContent value="supabase" className="space-y-6">
            <SupabaseSearchPanel />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition Géographique des Détections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: 'Casablanca', percentage: 85 },
                    { region: 'Rabat', percentage: 72 },
                    { region: 'Marrakech', percentage: 68 },
                    { region: 'Fès', percentage: 61 },
                    { region: 'Tanger', percentage: 55 }
                  ].map((item) => (
                    <div key={item.region} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium">{item.region}</div>
                      <div className="flex-1">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <div className="w-12 text-sm text-right">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-600">
                © 2025 AXM - Solution IA Multi-Agents pour la Détection de Fraude CNSS
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Développé avec expertise pour la transformation digitale de la protection sociale marocaine
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">Documentation</Button>
              <Button variant="ghost" size="sm">Support</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

