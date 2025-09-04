import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  FileText, 
  HelpCircle, 
  Search, 
  GitCompare, 
  Microscope,
  Languages,
  Sparkles,
  Brain,
  MessageSquare,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const AIGenerativePanel = () => {
  const [activeTab, setActiveTab] = useState('reports')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const generateReport = async (caseId, fraudType) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseId,
          fraud_type: fraudType,
          evidence: {
            amount: 250000,
            transactions: 45,
            period: '2025-01'
          }
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur génération rapport:', error)
    } finally {
      setLoading(false)
    }
  }

  const explainDecision = async (decisionId) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/explain-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          case_data: {
            score: 87,
            indicators: ['volume_anomaly', 'temporal_pattern', 'network_link']
          }
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur explication:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateQuestions = async (caseType) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_type: caseType,
          context: {
            severity: 'high',
            amount: 500000,
            actors: 3
          }
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur génération questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const performRAGQuery = async (query) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/rag-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          context: 'medical'
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur RAG:', error)
    } finally {
      setLoading(false)
    }
  }

  const performConfrontation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/confrontation-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_data: {
            case_id: 'CASE_2025_001',
            amount: 750000,
            actors: ['DR001', 'PH002', 'PAT003'],
            period: '2025-01'
          }
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur confrontation:', error)
    } finally {
      setLoading(false)
    }
  }

  const performBiologyDetection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/biology-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacy_id: 'PH_CAS_001',
          doctor_id: 'DR_CAS_002',
          period: 'monthly'
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur détection biologie:', error)
    } finally {
      setLoading(false)
    }
  }

  const performMultilingualAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/multilingual-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Prescription médicale: Doliprane 1000mg, 3 fois par jour pendant 7 jours. Patient: Ahmed Benali, né le 15/03/1980.',
          language: 'fr'
        })
      })
      const data = await response.json()
      setResults(data.data)
    } catch (error) {
      console.error('Erreur analyse multilingue:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>IA Générative Multi-Agents</span>
          </h2>
          <p className="text-slate-600 mt-1">Fonctionnalités avancées d'intelligence artificielle générative</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Bot className="w-4 h-4 mr-1" />
          LLM On-Premise Actif
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="reports" className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Rapports</span>
          </TabsTrigger>
          <TabsTrigger value="explanations" className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Explications</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center space-x-1">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Questions</span>
          </TabsTrigger>
          <TabsTrigger value="rag" className="flex items-center space-x-1">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">RAG</span>
          </TabsTrigger>
          <TabsTrigger value="confrontation" className="flex items-center space-x-1">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Confrontation</span>
          </TabsTrigger>
          <TabsTrigger value="specialized" className="flex items-center space-x-1">
            <Microscope className="w-4 h-4" />
            <span className="hidden sm:inline">Spécialisé</span>
          </TabsTrigger>
        </TabsList>

        {/* Génération de Rapports */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Génération Automatique de Rapports</span>
              </CardTitle>
              <CardDescription>
                Génération de rapports d'investigation détaillés par IA générative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => generateReport('CASE_2025_001', 'prescription_fraud')}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  <span>Fraude Prescription</span>
                </Button>
                <Button 
                  onClick={() => generateReport('CASE_2025_002', 'network_fraud')}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  <span>Réseau Frauduleux</span>
                </Button>
                <Button 
                  onClick={() => generateReport('CASE_2025_003', 'identity_fraud')}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  <span>Usurpation Identité</span>
                </Button>
              </div>

              {results && results.executive_summary && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Rapport Généré</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Score: {results.confidence_score}%</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Résumé Exécutif</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700">{results.executive_summary}</p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Analyse Détaillée</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Object.entries(results.detailed_analysis || {}).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-slate-600 capitalize">{key.replace('_', ' ')}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recommandations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {(results.recommendations || []).map((rec, index) => (
                            <li key={index} className="text-sm flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Explications IA */}
        <TabsContent value="explanations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Explicabilité des Décisions IA</span>
              </CardTitle>
              <CardDescription>
                Explications détaillées et compréhensibles des décisions d'IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => explainDecision('DEC_2025_001')}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                <span>Expliquer Décision Cas #001</span>
              </Button>

              {results && results.simple_explanation && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Explication Simple</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700">{results.simple_explanation}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Détails Techniques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(results.technical_explanation || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-600 capitalize">{key.replace('_', ' ')}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Indicateurs Principaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {(results.evidence_breakdown?.primary_indicators || []).map((indicator, index) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Génération de Questions */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Génération de Questions d'Investigation</span>
              </CardTitle>
              <CardDescription>
                Questions personnalisées générées automatiquement pour l'investigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => generateQuestions('prescription_fraud')}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                  <span>Fraude Prescription</span>
                </Button>
                <Button 
                  onClick={() => generateQuestions('network_fraud')}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                  <span>Réseau Frauduleux</span>
                </Button>
              </div>

              {results && results.contextual_questions && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Questions Contextuelles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.contextual_questions.map((question, index) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Questions de Vérification</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {(results.verification_questions || []).map((question, index) => (
                            <li key={index} className="text-sm flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Estimation Investigation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {results.estimated_investigation_time}
                          </div>
                          <div className="text-sm text-slate-600">Durée estimée</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Système RAG */}
        <TabsContent value="rag" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Système RAG - Connaissances Contextuelles</span>
              </CardTitle>
              <CardDescription>
                Accès intelligent aux connaissances médicales et réglementaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question ou Recherche</label>
                <Textarea 
                  placeholder="Ex: Quelles sont les bonnes pratiques pour la prescription d'antibiotiques en AMO ?"
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={() => performRAGQuery("Bonnes pratiques prescription antibiotiques AMO")}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Rechercher dans la Base de Connaissances</span>
              </Button>

              {results && results.generated_answer && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Réponse Générée</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Confiance: {results.confidence_score}%</Badge>
                        <Badge variant="outline">Temps: {results.processing_time}s</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700">{results.generated_answer}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Documents Pertinents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(results.retrieved_documents || []).map((doc, index) => (
                          <li key={index} className="flex items-center justify-between text-sm">
                            <span>{doc.title}</span>
                            <Badge variant="outline">Pertinence: {Math.round(doc.relevance * 100)}%</Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confrontation */}
        <TabsContent value="confrontation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitCompare className="w-5 h-5" />
                <span>Confrontation Déterministe vs IA Générative</span>
              </CardTitle>
              <CardDescription>
                Validation croisée entre approche traditionnelle et IA générative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={performConfrontation}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
                <span>Lancer Analyse Comparative</span>
              </Button>

              {results && results.deterministic_result && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Approche Déterministe</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Méthode</span>
                          <span className="font-medium">{results.deterministic_result.method}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Score</span>
                          <span className="font-medium">{results.deterministic_result.score}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Temps</span>
                          <span className="font-medium">{results.deterministic_result.processing_time}s</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">IA Générative</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Méthode</span>
                          <span className="font-medium">{results.ai_generative_result.method}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Score</span>
                          <span className="font-medium">{results.ai_generative_result.score}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Temps</span>
                          <span className="font-medium">{results.ai_generative_result.processing_time}s</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Analyse de Convergence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Niveau d'Accord</span>
                        <Badge variant="outline">
                          {Math.round(results.convergence_analysis.agreement_level * 100)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Score Hybride</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {results.hybrid_score}/100
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-slate-700">{results.enriched_synthesis}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Détection Spécialisée */}
        <TabsContent value="specialized" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Microscope className="w-5 h-5" />
                  <span>Détection Biologie/Médicaments</span>
                </CardTitle>
                <CardDescription>
                  Analyse spécialisée des fraudes médicamenteuses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={performBiologyDetection}
                  disabled={loading}
                  className="w-full flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Microscope className="w-4 h-4" />}
                  <span>Analyser Tuple (Pharmacie, Médecin)</span>
                </Button>

                {results && results.tuple_analysis && (
                  <div className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Force Relation</span>
                        <span className="font-medium">{Math.round(results.tuple_analysis.relationship_strength * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taux Exclusivité</span>
                        <span className="font-medium">{Math.round(results.tuple_analysis.exclusivity_rate * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Score Risque</span>
                        <Badge variant={results.risk_score > 80 ? "destructive" : "secondary"}>
                          {results.risk_score}/100
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="w-5 h-5" />
                  <span>Analyse Multilingue</span>
                </CardTitle>
                <CardDescription>
                  Traitement documents français/arabe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={performMultilingualAnalysis}
                  disabled={loading}
                  className="w-full flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                  <span>Analyser Document Médical</span>
                </Button>

                {results && results.detected_language && (
                  <div className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Langue Détectée</span>
                        <Badge variant="outline">{results.detected_language}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Confiance Langue</span>
                        <span className="font-medium">{Math.round(results.content_analysis.language_confidence * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Entités Médicales</span>
                        <span className="font-medium">{results.medical_entities?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AIGenerativePanel

