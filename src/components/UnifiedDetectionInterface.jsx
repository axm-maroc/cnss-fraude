import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  FileText, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Stethoscope,
  Building2,
  DollarSign,
  Target,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  Settings,
  Activity,
  Brain,
  Shield
} from 'lucide-react';

const UnifiedDetectionInterface = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [detectionResults, setDetectionResults] = useState(null);
  const [protocolResults, setProtocolResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Étapes du processus de détection
  const detectionSteps = [
    { id: 1, title: "Upload Documents", icon: Upload, description: "Injection des documents médicaux" },
    { id: 2, title: "Analyse Multi-Agents", icon: Brain, description: "Traitement par les 5 agents IA" },
    { id: 3, title: "Protocoles Thérapeutiques", icon: Stethoscope, description: "Validation contre les protocoles" },
    { id: 4, title: "Scoring & Validation", icon: Target, description: "Calcul du score de risque" },
    { id: 5, title: "Décision & Actions", icon: Shield, description: "Validation finale et actions" }
  ];

  // Protocoles thérapeutiques simulés
  const therapeuticProtocols = [
    {
      id: 1,
      pathology: "Polyarthrite rhumatoïde",
      medication: "Humira (Adalimumab)",
      dosage: "40mg/0.8ml",
      maxMonthly: 2,
      unitPrice: 2500,
      riskThreshold: 85,
      specialist: "Rhumatologue"
    },
    {
      id: 2,
      pathology: "Maladie de Crohn",
      medication: "Remicade (Infliximab)",
      dosage: "100mg",
      maxMonthly: 1,
      unitPrice: 3200,
      riskThreshold: 90,
      specialist: "Gastro-entérologue"
    },
    {
      id: 3,
      pathology: "Cancer du sein",
      medication: "Herceptin (Trastuzumab)",
      dosage: "440mg",
      maxMonthly: 3,
      unitPrice: 5200,
      riskThreshold: 95,
      specialist: "Oncologue"
    }
  ];

  // Gestion de l'upload de fichiers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toLocaleTimeString()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Simulation du processus de détection
  const startDetectionProcess = async () => {
    if (uploadedFiles.length === 0) {
      alert("Veuillez d'abord uploader des documents");
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);

    // Simulation des étapes
    for (let step = 2; step <= 5; step++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(step);
      
      if (step === 3) {
        // Simulation des résultats de protocoles
        setProtocolResults({
          matchedProtocol: therapeuticProtocols[0],
          compliance: 75,
          riskFactors: ["Dosage supérieur à la normale", "Fréquence élevée"],
          recommendation: "Investigation requise"
        });
      }
      
      if (step === 4) {
        // Simulation des résultats de détection
        setDetectionResults({
          riskScore: 87,
          fraudProbability: "Élevée",
          amount: 18000,
          patient: "Amina BENALI",
          doctor: "Dr. Ahmed TAZI",
          pharmacy: "Pharmacie Al Andalous",
          alerts: [
            "Prescription excessive détectée",
            "Pattern temporel suspect",
            "Relation médecin-pharmacie inhabituelle"
          ]
        });
      }
    }

    setIsProcessing(false);
  };

  // Reset du processus
  const resetProcess = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setDetectionResults(null);
    setProtocolResults(null);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <span>Processus de Détection de Fraude - Bout en Bout</span>
          </CardTitle>
          <CardDescription>
            Interface unifiée pour la détection complète avec upload de fichiers et moteur de protocoles thérapeutiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barre de progression des étapes */}
          <div className="flex items-center justify-between mb-6">
            {detectionSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < detectionSteps.length - 1 && (
                  <div className={`w-16 h-0.5 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Contrôles du processus */}
          <div className="flex space-x-4 justify-center">
            <Button 
              onClick={startDetectionProcess} 
              disabled={isProcessing || uploadedFiles.length === 0}
              className="flex items-center space-x-2"
            >
              {isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isProcessing ? 'Traitement en cours...' : 'Démarrer Détection'}</span>
            </Button>
            <Button variant="outline" onClick={resetProcess}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Upload de Fichiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>1. Upload de Documents Externes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Zone de drop */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">Glissez vos fichiers ici ou cliquez pour sélectionner</p>
              <p className="text-sm text-gray-500">Ordonnances, factures, rapports médicaux (PDF, JPG, PNG)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Liste des fichiers uploadés */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Fichiers uploadés ({uploadedFiles.length})</h4>
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB • Uploadé à {file.uploadTime}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Prêt
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Moteur de Protocoles Thérapeutiques */}
      {currentStep >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5" />
              <span>3. Moteur de Protocoles Thérapeutiques</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Protocoles disponibles */}
              <div>
                <h4 className="font-medium mb-4">Protocoles Configurés</h4>
                <div className="space-y-3">
                  {therapeuticProtocols.map(protocol => (
                    <div key={protocol.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{protocol.pathology}</div>
                      <div className="text-sm text-gray-600">{protocol.medication}</div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Max/mois: {protocol.maxMonthly}</span>
                        <span>Prix: {protocol.unitPrice} MAD</span>
                        <span>Seuil: {protocol.riskThreshold}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résultats de validation */}
              {protocolResults && (
                <div>
                  <h4 className="font-medium mb-4">Résultats de Validation</h4>
                  <div className="p-4 border rounded-lg space-y-3">
                    <div>
                      <div className="font-medium">Protocole Correspondant</div>
                      <div className="text-sm text-gray-600">{protocolResults.matchedProtocol.pathology}</div>
                    </div>
                    <div>
                      <div className="font-medium">Conformité</div>
                      <Progress value={protocolResults.compliance} className="mt-1" />
                      <div className="text-sm text-gray-600">{protocolResults.compliance}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Facteurs de Risque</div>
                      {protocolResults.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                    <Badge variant={protocolResults.recommendation === "Investigation requise" ? "destructive" : "default"}>
                      {protocolResults.recommendation}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Résultats de Détection */}
      {detectionResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>4. Résultats de Détection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Score de risque */}
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{detectionResults.riskScore}/100</div>
                <div className="text-sm text-gray-600">Score de Risque</div>
                <Badge variant="destructive" className="mt-2">{detectionResults.fraudProbability}</Badge>
              </div>

              {/* Informations du cas */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Patient:</span>
                  <span>{detectionResults.patient}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4" />
                  <span className="font-medium">Médecin:</span>
                  <span>{detectionResults.doctor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">Pharmacie:</span>
                  <span>{detectionResults.pharmacy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Montant:</span>
                  <span>{detectionResults.amount.toLocaleString()} MAD</span>
                </div>
              </div>

              {/* Alertes */}
              <div>
                <div className="font-medium mb-3">Alertes Détectées</div>
                <div className="space-y-2">
                  {detectionResults.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Actions Finales */}
      {currentStep >= 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>5. Décision & Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Valider Transaction</span>
              </Button>
              <Button variant="destructive" className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Déclencher Investigation</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Générer Rapport</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedDetectionInterface;

