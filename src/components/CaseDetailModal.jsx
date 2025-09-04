import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  User, 
  Stethoscope, 
  Building2, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Search,
  Scale,
  FileText,
  Clock
} from 'lucide-react';

const CaseDetailModal = ({ isOpen, onClose, caseData }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  if (!isOpen || !caseData) return null;

  const handleAction = async (action) => {
    setActionInProgress(true);
    setSelectedAction(action);
    
    // Simulation de l'action
    setTimeout(() => {
      setActionInProgress(false);
      alert(`Action "${action}" exécutée avec succès pour le cas ${caseData.id}`);
      onClose();
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'investigation': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 70) return 'text-orange-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Détail du Cas {caseData.id}</h2>
            <p className="text-gray-600">Investigation de fraude AMO</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-medium">{caseData.patient_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Médecin</p>
                    <p className="font-medium">{caseData.doctor_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pharmacie</p>
                    <p className="font-medium">{caseData.pharmacy_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Montant</p>
                    <p className="font-medium">{caseData.amount?.toLocaleString()} MAD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statut et Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut du Cas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Statut actuel</span>
                    <Badge className={getStatusColor(caseData.status)}>
                      {caseData.status === 'confirmed' && 'Fraude confirmée'}
                      {caseData.status === 'investigation' && 'En investigation'}
                      {caseData.status === 'pending' && 'En attente'}
                      {caseData.status === 'resolved' && 'Résolu'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Type de fraude</span>
                    <span className="font-medium">{caseData.fraud_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date de détection</span>
                    <span className="font-medium">{caseData.detection_date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score de Risque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Score global</span>
                    <span className={`text-2xl font-bold ${getRiskColor(caseData.risk_score)}`}>
                      {caseData.risk_score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        caseData.risk_score >= 90 ? 'bg-red-500' :
                        caseData.risk_score >= 70 ? 'bg-orange-500' :
                        caseData.risk_score >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${caseData.risk_score}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Niveau: {caseData.risk_score >= 90 ? 'Critique' :
                            caseData.risk_score >= 70 ? 'Élevé' :
                            caseData.risk_score >= 50 ? 'Moyen' : 'Faible'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Détails de la prescription */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de la Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Médicament prescrit</p>
                  <p className="font-medium">Humira (Adalimumab) 40mg/0.8ml</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantité</p>
                  <p className="font-medium">4 unités (dépassement: +100%)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pathologie</p>
                  <p className="font-medium">Polyarthrite rhumatoïde</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Spécialiste requis</p>
                  <p className="font-medium">Rhumatologue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyse des agents */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Multi-Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { agent: 'Agent Comportemental', result: 'Fréquence anormale détectée', score: 85 },
                  { agent: 'Agent Relationnel', result: 'Relation médecin-pharmacie suspecte', score: 78 },
                  { agent: 'Agent Temporel', result: 'Pattern temporel inhabituel', score: 72 },
                  { agent: 'Agent Scoring', result: 'Score de risque élevé', score: 87 }
                ].map((item) => (
                  <div key={item.agent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.agent}</p>
                      <p className="text-sm text-gray-600">{item.result}</p>
                    </div>
                    <Badge variant="outline">{item.score}/100</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Disponibles</CardTitle>
              <CardDescription>Choisissez l'action appropriée pour ce cas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleAction('Valider PEC')}
                  disabled={actionInProgress}
                  className="flex flex-col items-center p-6 h-auto bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <span className="font-medium">Valider PEC</span>
                  <span className="text-xs opacity-80">Prise en charge validée</span>
                </Button>

                <Button 
                  onClick={() => handleAction('Investigation')}
                  disabled={actionInProgress}
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Search className="w-8 h-8 mb-2" />
                  <span className="font-medium">Investigation</span>
                  <span className="text-xs opacity-80">Enquête approfondie</span>
                </Button>

                <Button 
                  onClick={() => handleAction('Rejeter PEC')}
                  disabled={actionInProgress}
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto border-red-300 text-red-700 hover:bg-red-50"
                >
                  <X className="w-8 h-8 mb-2" />
                  <span className="font-medium">Rejeter PEC</span>
                  <span className="text-xs opacity-80">Refuser la prise en charge</span>
                </Button>

                <Button 
                  onClick={() => handleAction('Procédure Judiciaire')}
                  disabled={actionInProgress}
                  variant="outline"
                  className="flex flex-col items-center p-6 h-auto border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Scale className="w-8 h-8 mb-2" />
                  <span className="font-medium">Procédure</span>
                  <span className="text-xs opacity-80">Assignation huissier</span>
                </Button>
              </div>

              {actionInProgress && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-800">
                      Action "{selectedAction}" en cours d'exécution...
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents associés */}
          <Card>
            <CardHeader>
              <CardTitle>Documents Associés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Ordonnance originale', type: 'PDF', size: '2.3 MB' },
                  { name: 'Rapport médical', type: 'PDF', size: '1.8 MB' },
                  { name: 'Facture pharmacie', type: 'PDF', size: '0.9 MB' }
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailModal;

