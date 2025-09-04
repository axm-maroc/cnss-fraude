import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  X, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  User, 
  MapPin, 
  DollarSign,
  Settings,
  Brain,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react'

const AgentDetailModal = ({ agent, isOpen, onClose }) => {
  const [selectedCase, setSelectedCase] = useState(null)

  if (!isOpen || !agent) return null

  // Données simulées des dossiers par agent
  const agentCases = {
    'Agent de Collecte': [
      {
        id: 'COL_001',
        type: 'Anomalie Format',
        patient: 'Ahmed BENALI',
        medecin: 'Dr. Fatima ALAOUI',
        pharmacie: 'Pharmacie Centrale',
        montant: '2,500 MAD',
        score: 78,
        status: 'resolved',
        date: '2025-01-15',
        description: 'Format ordonnance non conforme détecté par OCR',
        regles: [
          'Validation format PDF/JPG obligatoire',
          'OCR avec confiance > 85%',
          'Métadonnées complètes requises',
          'Signature numérique vérifiée'
        ],
        documents: ['ordonnance_scan.pdf', 'metadata.json']
      },
      {
        id: 'COL_002',
        type: 'Données Manquantes',
        patient: 'Khadija TAZI',
        medecin: 'Dr. Hassan IDRISSI',
        pharmacie: 'Pharmacie Atlas',
        montant: '1,200 MAD',
        score: 65,
        status: 'investigation',
        date: '2025-01-14',
        description: 'Champs obligatoires manquants dans la prescription',
        regles: [
          'Nom patient obligatoire',
          'Date prescription < 30 jours',
          'Cachet médecin requis',
          'Posologie complète'
        ],
        documents: ['prescription_incomplete.pdf']
      }
    ],
    'Agent Comportemental': [
      {
        id: 'COMP_001',
        type: 'Méga-consommateur',
        patient: 'Youssef ALAMI',
        medecin: 'Dr. Amina BENNANI',
        pharmacie: 'Pharmacie Al Andalous',
        montant: '45,000 MAD',
        score: 92,
        status: 'confirmed',
        date: '2025-01-15',
        description: 'Consommation 400% supérieure à la moyenne mensuelle',
        regles: [
          'Seuil mensuel: 5,000 MAD/patient',
          'Écart-type: > 3σ = alerte',
          'Historique: 6 mois minimum',
          'Pathologie cohérente requise'
        ],
        documents: ['historique_patient.pdf', 'analyse_comportementale.json']
      },
      {
        id: 'COMP_002',
        type: 'Pattern Suspect',
        patient: 'Fatima ZAHRA',
        medecin: 'Dr. Mohamed CHAKIR',
        pharmacie: 'Pharmacie Moderne',
        montant: '18,500 MAD',
        score: 87,
        status: 'investigation',
        date: '2025-01-13',
        description: 'Changement brutal de comportement de consommation',
        regles: [
          'Variation > 200% = suspect',
          'Nouveau médecin = vérification',
          'Médicaments onéreux = contrôle',
          'Fréquence anormale détectée'
        ],
        documents: ['pattern_analysis.pdf', 'medical_history.json']
      }
    ],
    'Agent Relationnel': [
      {
        id: 'REL_001',
        type: 'Réseau Organisé',
        patient: 'Réseau BENALI (15 patients)',
        medecin: 'Dr. Rachid ALAMI + 3 autres',
        pharmacie: 'Pharmacie Central + 2 autres',
        montant: '2,300,000 MAD',
        score: 98,
        status: 'confirmed',
        date: '2025-01-12',
        description: 'Réseau frauduleux multi-régional détecté',
        regles: [
          'Cluster > 10 patients = réseau',
          'Médecins connectés > 2 = suspect',
          'Pharmacies liées > 1 = alerte',
          'Montant total > 1M MAD = critique'
        ],
        documents: ['network_graph.json', 'fraud_report.pdf', 'investigation_summary.pdf']
      }
    ],
    'Agent Temporel': [
      {
        id: 'TEMP_001',
        type: 'Concentration Temporelle',
        patient: 'Hassan IDRISSI',
        medecin: 'Dr. Aicha FASSI',
        pharmacie: 'Pharmacie Nouvelle',
        montant: '12,000 MAD',
        score: 84,
        status: 'investigation',
        date: '2025-01-14',
        description: 'Concentration anormale de consultations 18h-20h',
        regles: [
          'Horaires normaux: 8h-18h',
          'Concentration > 60% = suspect',
          'Weekend anormal = alerte',
          'Jours fériés = vérification'
        ],
        documents: ['temporal_analysis.json', 'schedule_report.pdf']
      }
    ],
    'Agent de Scoring': [
      {
        id: 'SCOR_001',
        type: 'Score Critique',
        patient: 'Amina BENALI',
        medecin: 'Dr. Ahmed TAZI',
        pharmacie: 'Pharmacie Al Andalous',
        montant: '18,000 MAD',
        score: 95,
        status: 'confirmed',
        date: '2025-01-15',
        description: 'Score de risque critique - Prescription excessive Humira',
        regles: [
          'Score > 90 = critique',
          'Score 70-90 = élevé',
          'Score 50-70 = moyen',
          'Score < 50 = faible'
        ],
        documents: ['scoring_details.json', 'risk_assessment.pdf']
      }
    ],
    'Agent d\'Investigation': [
      {
        id: 'INV_001',
        type: 'Investigation Complexe',
        patient: 'Khadija BENNANI',
        medecin: 'Dr. Youssef ALAMI',
        pharmacie: 'Pharmacie Atlas',
        montant: '1,200,000 MAD',
        score: 89,
        status: 'investigation',
        date: '2025-01-13',
        description: 'Usurpation identité médicale suspectée',
        regles: [
          'Vérification identité médecin',
          'Contrôle cabinet médical',
          'Validation patients réels',
          'Audit prescriptions'
        ],
        documents: ['investigation_report.pdf', 'identity_verification.json', 'field_audit.pdf']
      }
    ]
  }

  const cases = agentCases[agent.name] || []

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'destructive'
      case 'investigation': return 'orange'
      case 'resolved': return 'green'
      default: return 'secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Fraude Confirmée'
      case 'investigation': return 'Investigation'
      case 'resolved': return 'Résolu'
      default: return 'En attente'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Méga-consommateur': return User
      case 'Réseau Organisé': return Shield
      case 'Anomalie Format': return FileText
      case 'Score Critique': return Target
      default: return AlertTriangle
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{agent.name}</h2>
            <p className="text-slate-600">{agent.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Métriques de l'agent */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{agent.metrics?.casesProcessed || cases.length}</div>
                <div className="text-sm text-slate-600">Cas Traités</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{agent.metrics?.successRate || '87%'}</div>
                <div className="text-sm text-slate-600">Taux Succès</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{cases.filter(c => c.status === 'investigation').length}</div>
                <div className="text-sm text-slate-600">En Investigation</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{cases.filter(c => c.status === 'confirmed').length}</div>
                <div className="text-sm text-slate-600">Fraudes Confirmées</div>
              </CardContent>
            </Card>
          </div>

          {/* Règles métier de l'agent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Règles Métier Configurées</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.name === 'Agent de Collecte' && (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Validation Format</h4>
                      <p className="text-sm text-blue-700">PDF/JPG obligatoire, OCR > 85% confiance</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Métadonnées</h4>
                      <p className="text-sm text-blue-700">Signature numérique et horodatage requis</p>
                    </div>
                  </>
                )}
                {agent.name === 'Agent Comportemental' && (
                  <>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Seuils Consommation</h4>
                      <p className="text-sm text-purple-700">5,000 MAD/mois max, écart-type > 3σ</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Patterns Suspects</h4>
                      <p className="text-sm text-purple-700">Variation > 200% = alerte automatique</p>
                    </div>
                  </>
                )}
                {agent.name === 'Agent Relationnel' && (
                  <>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Détection Réseaux</h4>
                      <p className="text-sm text-green-700">Cluster > 10 patients = réseau suspect</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Montants Critiques</h4>
                      <p className="text-sm text-green-700">> 1M MAD = investigation immédiate</p>
                    </div>
                  </>
                )}
                {agent.name === 'Agent Temporel' && (
                  <>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900">Horaires Normaux</h4>
                      <p className="text-sm text-orange-700">8h-18h, concentration > 60% = suspect</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900">Périodes Spéciales</h4>
                      <p className="text-sm text-orange-700">Weekend/fériés = vérification requise</p>
                    </div>
                  </>
                )}
                {agent.name === 'Agent de Scoring' && (
                  <>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900">Échelle Scoring</h4>
                      <p className="text-sm text-red-700">> 90 critique, 70-90 élevé, 50-70 moyen</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900">Pondération</h4>
                      <p className="text-sm text-red-700">Montant 40%, Pattern 30%, Historique 30%</p>
                    </div>
                  </>
                )}
                {agent.name === 'Agent d\'Investigation' && (
                  <>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <h4 className="font-semibold text-cyan-900">Vérifications</h4>
                      <p className="text-sm text-cyan-700">Identité médecin, cabinet, patients réels</p>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <h4 className="font-semibold text-cyan-900">Audit Terrain</h4>
                      <p className="text-sm text-cyan-700">Contrôle physique si score > 85</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Liste des dossiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <span>Dossiers d'Anomalies Détectées ({cases.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.map((caseItem) => {
                  const TypeIcon = getTypeIcon(caseItem.type)
                  return (
                    <div key={caseItem.id} className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer"
                         onClick={() => setSelectedCase(selectedCase === caseItem.id ? null : caseItem.id)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <TypeIcon className="w-5 h-5 text-slate-600" />
                            <h4 className="font-semibold">{caseItem.id} - {caseItem.type}</h4>
                            <Badge variant={getStatusColor(caseItem.status)}>
                              {getStatusText(caseItem.status)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{caseItem.patient}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{caseItem.medecin}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{caseItem.montant}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700">{caseItem.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">{caseItem.score}/100</div>
                          <div className="text-xs text-slate-500">{caseItem.date}</div>
                        </div>
                      </div>

                      {/* Détails étendus */}
                      {selectedCase === caseItem.id && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          {/* Règles appliquées */}
                          <div>
                            <h5 className="font-semibold mb-2 flex items-center space-x-2">
                              <Brain className="w-4 h-4 text-blue-600" />
                              <span>Règles Appliquées</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {caseItem.regles.map((regle, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span>{regle}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Documents associés */}
                          <div>
                            <h5 className="font-semibold mb-2 flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-slate-600" />
                              <span>Documents Associés ({caseItem.documents.length})</span>
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {caseItem.documents.map((doc, index) => (
                                <Button key={index} variant="outline" size="sm" className="text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {doc}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            <Button size="sm" variant="default">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir Détails
                            </Button>
                            <Button size="sm" variant="outline">
                              Valider PEC
                            </Button>
                            <Button size="sm" variant="outline">
                              Investigation
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AgentDetailModal

