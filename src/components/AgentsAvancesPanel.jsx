import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, Search, Activity, TrendingUp, Clock, MapPin, Stethoscope, AlertCircle } from 'lucide-react';

const AgentsAvancesPanel = () => {
  const [agentComportemental, setAgentComportemental] = useState(null);
  const [agentInvestigation, setAgentInvestigation] = useState(null);
  const [analyseTempsReel, setAnalyseTempsReel] = useState(null);
  const [coordination, setCoordination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comportementalRes, investigationRes, analyseRes, coordRes] = await Promise.all([
          fetch('/api/agents/agent-comportemental/status'),
          fetch('/api/agents/agent-investigation/status'),
          fetch('/api/agents/agent-comportemental/analyse-temps-reel'),
          fetch('/api/agents/agents-coordination')
        ]);

        const [comportemental, investigation, analyse, coord] = await Promise.all([
          comportementalRes.json(),
          investigationRes.json(),
          analyseRes.json(),
          coordRes.json()
        ]);

        setAgentComportemental(comportemental.agent);
        setAgentInvestigation(investigation.agent);
        setAnalyseTempsReel(analyse.analyse);
        setCoordination(coord.coordination);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement agents avancés:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Mise à jour toutes les 15s
    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (value) => {
    const numValue = parseFloat(value);
    if (numValue >= 90) return 'text-green-600';
    if (numValue >= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case 'Critique': return 'bg-red-100 text-red-800';
      case 'Élevé': return 'bg-orange-100 text-orange-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agents IA Avancés</h2>
          <p className="text-gray-600">Agent Comportemental et Agent d'Investigation - Nouvelle génération</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Activity className="w-4 h-4 mr-1" />
          Coordination Active
        </Badge>
      </div>

      {/* Coordination des Agents */}
      {coordination && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Brain className="w-5 h-5 mr-2" />
              Coordination Agents IA
            </CardTitle>
            <CardDescription>Synchronisation temps réel et performance combinée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Taux Détection</p>
                <p className={`font-bold text-lg ${getPerformanceColor(coordination.performance_combinee.taux_detection)}`}>
                  {coordination.performance_combinee.taux_detection}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Faux Positifs</p>
                <p className={`font-bold text-lg ${getPerformanceColor(100 - parseFloat(coordination.performance_combinee.faux_positifs))}`}>
                  {coordination.performance_combinee.faux_positifs}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps Résolution</p>
                <p className="font-bold text-lg text-blue-600">{coordination.performance_combinee.temps_resolution}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className={`font-bold text-lg ${getPerformanceColor(coordination.performance_combinee.satisfaction_enqueteurs)}`}>
                  {coordination.performance_combinee.satisfaction_enqueteurs}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="comportemental" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comportemental">
            <Brain className="w-4 h-4 mr-2" />
            Agent Comportemental
          </TabsTrigger>
          <TabsTrigger value="investigation">
            <Search className="w-4 h-4 mr-2" />
            Agent Investigation
          </TabsTrigger>
          <TabsTrigger value="analyse">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyse Temps Réel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comportemental" className="space-y-4">
          {agentComportemental && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    {agentComportemental.nom}
                  </CardTitle>
                  <CardDescription>Version {agentComportemental.version} - Détection patterns comportementaux</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <Badge className="bg-green-100 text-green-800">{agentComportemental.statut}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dernière Analyse</p>
                      <p className="font-semibold text-sm">{agentComportemental.derniere_analyse}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patterns Surveillés</p>
                      <p className="font-bold text-lg text-purple-600">{agentComportemental.patterns_surveilles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Technologies Actives</p>
                      <p className="font-bold text-lg text-purple-600">{agentComportemental.technologies_actives}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Précision</p>
                            <p className={`font-bold text-xl ${getPerformanceColor(agentComportemental.performance.precision)}`}>
                              {agentComportemental.performance.precision}
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Rappel</p>
                            <p className={`font-bold text-xl ${getPerformanceColor(agentComportemental.performance.rappel)}`}>
                              {agentComportemental.performance.rappel}
                            </p>
                          </div>
                          <Activity className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">F1-Score</p>
                            <p className={`font-bold text-xl ${getPerformanceColor(agentComportemental.performance.f1_score)}`}>
                              {agentComportemental.performance.f1_score}
                            </p>
                          </div>
                          <Brain className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Activité 24h</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Analyses Total</p>
                        <p className="font-bold text-lg">{agentComportemental.analyses_24h.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Anomalies Détectées</p>
                        <p className="font-bold text-lg text-orange-600">{agentComportemental.analyses_24h.anomalies_detectees}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Taux Anomalie</p>
                        <p className="font-bold text-lg">{agentComportemental.analyses_24h.taux_anomalie}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fraudes Confirmées</p>
                        <p className="font-bold text-lg text-red-600">{agentComportemental.analyses_24h.confirmees_fraude}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="investigation" className="space-y-4">
          {agentInvestigation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  {agentInvestigation.nom}
                </CardTitle>
                <CardDescription>Version {agentInvestigation.version} - Investigation automatisée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <Badge className="bg-green-100 text-green-800">{agentInvestigation.statut}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Investigations Actives</p>
                    <p className="font-bold text-lg text-blue-600">{agentInvestigation.investigations_actives}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Terminées 24h</p>
                    <p className="font-bold text-lg text-green-600">{agentInvestigation.investigations_terminees_24h}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taux Confirmation</p>
                    <p className={`font-bold text-lg ${getPerformanceColor(agentInvestigation.taux_confirmation_fraude)}`}>
                      {agentInvestigation.taux_confirmation_fraude}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Délai Moyen</p>
                          <p className="font-bold text-xl text-blue-600">{agentInvestigation.delai_moyen_investigation}</p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Récupéré ce Mois</p>
                          <p className="font-bold text-xl text-green-600">
                            {(agentInvestigation.montant_recupere_mois / 1000000).toFixed(1)}M MAD
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Enquêteurs</p>
                          <p className="font-bold text-xl text-blue-600">{agentInvestigation.enqueteurs_assignes}</p>
                        </div>
                        <Search className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Performance Investigation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Outils Actifs</p>
                      <p className="font-bold text-lg">{agentInvestigation.outils_actifs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Charge Travail Moyenne</p>
                      <p className="font-bold text-lg text-orange-600">{agentInvestigation.charge_travail_moyenne}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Enquêteurs Assignés</p>
                      <p className="font-bold text-lg">{agentInvestigation.enqueteurs_assignes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analyse" className="space-y-4">
          {analyseTempsReel && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Analyse Comportementale Temps Réel
                </CardTitle>
                <CardDescription>Détection automatique de patterns suspects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Patient Analysé</p>
                    <p className="font-semibold">{analyseTempsReel.patient_analyse}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score Global</p>
                    <Badge className={getScoreColor(analyseTempsReel.score_global)}>
                      {analyseTempsReel.score_global}/100
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recommandation</p>
                    <Badge className="bg-red-100 text-red-800">{analyseTempsReel.recommandation}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Patterns Détectés
                    </h4>
                    <div className="space-y-3">
                      {analyseTempsReel.patterns_detectes?.map((pattern, index) => (
                        <Card key={index} className="bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {pattern.type === 'Temporel' && <Clock className="w-4 h-4 mr-2 text-blue-600" />}
                                {pattern.type === 'Géographique' && <MapPin className="w-4 h-4 mr-2 text-green-600" />}
                                {pattern.type === 'Médical' && <Stethoscope className="w-4 h-4 mr-2 text-purple-600" />}
                                <span className="font-medium">{pattern.type}</span>
                              </div>
                              <Badge className={getNiveauColor(pattern.niveau)}>
                                {pattern.niveau} ({pattern.score}/100)
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{pattern.anomalie}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Actions Automatiques Déclenchées</h4>
                    <div className="space-y-2">
                      {analyseTempsReel.actions_automatiques?.map((action, index) => (
                        <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                          <Activity className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentsAvancesPanel;

