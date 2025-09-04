import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Upload, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  FileText, 
  Brain,
  Network,
  Timer,
  Calculator,
  UserCheck,
  Gavel,
  Activity,
  TrendingUp,
  Settings
} from 'lucide-react';

const WorkflowPanel = () => {
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulation des données de workflow actifs
  const mockActiveWorkflows = [
    {
      workflow_id: 1,
      case_id: 'DET_001',
      workflow_status: 'processing',
      current_step: 3,
      total_steps: 7,
      priority_level: 'high',
      assigned_to: 'Dr. Sarah BENALI',
      assigned_role: 'doctor',
      patient_name: 'Amina BENALI',
      doctor_name: 'Dr. Ahmed TAZI',
      amount_mad: 18000,
      initiated_at: '2025-01-15T10:30:00Z'
    },
    {
      workflow_id: 2,
      case_id: 'DET_002',
      workflow_status: 'investigation',
      current_step: 6,
      total_steps: 7,
      priority_level: 'critical',
      assigned_to: 'Investigateur ALAMI',
      assigned_role: 'investigator',
      patient_name: 'Hassan IDRISSI',
      doctor_name: 'Dr. Fatima ALAOUI',
      amount_mad: 2300000,
      initiated_at: '2025-01-14T14:15:00Z'
    },
    {
      workflow_id: 3,
      case_id: 'DET_003',
      workflow_status: 'legal_action',
      current_step: 7,
      total_steps: 7,
      priority_level: 'high',
      assigned_to: 'Huissier BENNANI',
      assigned_role: 'bailiff',
      patient_name: 'Khadija BENNANI',
      doctor_name: 'Dr. Youssef CHAKIR',
      amount_mad: 1200000,
      initiated_at: '2025-01-13T09:45:00Z'
    }
  ];

  // Simulation des protocoles thérapeutiques
  const mockProtocols = [
    {
      protocol_id: 1,
      pathology_name: 'Polyarthrite rhumatoïde',
      medication_name: 'Humira (Adalimumab)',
      standard_dosage: '40mg/0.8ml',
      max_monthly_quantity: 2,
      max_annual_quantity: 24,
      unit_price_mad: 2500.00,
      risk_threshold_score: 85,
      requires_specialist: true,
      specialist_type: 'Rhumatologue'
    },
    {
      protocol_id: 2,
      pathology_name: 'Maladie de Crohn',
      medication_name: 'Remicade (Infliximab)',
      standard_dosage: '100mg',
      max_monthly_quantity: 1,
      max_annual_quantity: 8,
      unit_price_mad: 3200.00,
      risk_threshold_score: 90,
      requires_specialist: true,
      specialist_type: 'Gastro-entérologue'
    },
    {
      protocol_id: 3,
      pathology_name: 'Cancer du sein',
      medication_name: 'Herceptin (Trastuzumab)',
      standard_dosage: '440mg',
      max_monthly_quantity: 3,
      max_annual_quantity: 18,
      unit_price_mad: 5200.00,
      risk_threshold_score: 95,
      requires_specialist: true,
      specialist_type: 'Oncologue'
    }
  ];

  useEffect(() => {
    setActiveWorkflows(mockActiveWorkflows);
    setProtocols(mockProtocols);
  }, []);

  const getStepIcon = (stepNumber, agentType) => {
    const iconMap = {
      1: Upload,
      2: Brain,
      3: Network,
      4: Timer,
      5: Calculator,
      6: UserCheck,
      7: Gavel
    };
    const IconComponent = iconMap[stepNumber] || Activity;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStepName = (stepNumber) => {
    const stepNames = {
      1: 'Injection Documents',
      2: 'Analyse Comportementale',
      3: 'Analyse Relationnelle',
      4: 'Analyse Temporelle',
      5: 'Calcul Score',
      6: 'Validation Médicale',
      7: 'Décision Finale'
    };
    return stepNames[stepNumber] || `Étape ${stepNumber}`;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      initiated: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      investigation: 'bg-orange-100 text-orange-800',
      legal_action: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.initiated;
  };

  const initiateNewWorkflow = () => {
    const newWorkflow = {
      workflow_id: activeWorkflows.length + 1,
      case_id: `DET_${String(activeWorkflows.length + 1).padStart(3, '0')}`,
      workflow_status: 'initiated',
      current_step: 1,
      total_steps: 7,
      priority_level: 'medium',
      assigned_to: 'Système AXM',
      assigned_role: 'system',
      patient_name: 'Nouveau Patient',
      doctor_name: 'Dr. À déterminer',
      amount_mad: 0,
      initiated_at: new Date().toISOString()
    };
    
    setActiveWorkflows([newWorkflow, ...activeWorkflows]);
    setSelectedWorkflow(newWorkflow);
  };

  const processWorkflowStep = (workflowId, stepNumber) => {
    setActiveWorkflows(prev => prev.map(wf => 
      wf.workflow_id === workflowId 
        ? { ...wf, current_step: Math.min(stepNumber + 1, wf.total_steps) }
        : wf
    ));
  };

  const validateWorkflow = (workflowId, decision) => {
    const statusMap = {
      approve: 'completed',
      investigate: 'investigation',
      legal: 'legal_action',
      reject: 'rejected'
    };
    
    setActiveWorkflows(prev => prev.map(wf => 
      wf.workflow_id === workflowId 
        ? { ...wf, workflow_status: statusMap[decision] || wf.workflow_status }
        : wf
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Actif de Détection</h2>
          <p className="text-gray-600">Gestion complète du processus de détection de fraude</p>
        </div>
        <Button onClick={initiateNewWorkflow} className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" />
          Nouveau Workflow
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Workflows Actifs</TabsTrigger>
          <TabsTrigger value="protocols">Protocoles Thérapeutiques</TabsTrigger>
          <TabsTrigger value="process">Processus de Détection</TabsTrigger>
          <TabsTrigger value="validation">Validation & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeWorkflows.map((workflow) => (
              <Card key={workflow.workflow_id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedWorkflow(workflow)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workflow.case_id}</CardTitle>
                      <CardDescription>
                        Patient: {workflow.patient_name} | Médecin: {workflow.doctor_name}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(workflow.priority_level)}>
                        {workflow.priority_level}
                      </Badge>
                      <Badge className={getStatusColor(workflow.workflow_status)}>
                        {workflow.workflow_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      Étape {workflow.current_step}/{workflow.total_steps}: {getStepName(workflow.current_step)}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {workflow.amount_mad.toLocaleString()} MAD
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(workflow.current_step / workflow.total_steps) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {workflow.assigned_to} ({workflow.assigned_role})
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(workflow.initiated_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {workflow.current_step < workflow.total_steps && (
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          processWorkflowStep(workflow.workflow_id, workflow.current_step);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Traiter Étape
                      </Button>
                      {workflow.current_step >= 5 && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            validateWorkflow(workflow.workflow_id, 'investigate');
                          }}
                        >
                          Investigation
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration des Protocoles Thérapeutiques
              </CardTitle>
              <CardDescription>
                Paramétrage des seuils et règles de détection par médicament
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocols.map((protocol) => (
                  <Card key={protocol.protocol_id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{protocol.medication_name}</h4>
                          <p className="text-sm text-gray-600">{protocol.pathology_name}</p>
                          <p className="text-xs text-gray-500">Dosage: {protocol.standard_dosage}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-600">Max mensuel:</span> 
                            <span className="font-medium ml-1">{protocol.max_monthly_quantity}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Max annuel:</span> 
                            <span className="font-medium ml-1">{protocol.max_annual_quantity}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Prix unitaire:</span> 
                            <span className="font-medium ml-1">{protocol.unit_price_mad} MAD</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Seuil risque:</span>
                            <Badge className={protocol.risk_threshold_score >= 85 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {protocol.risk_threshold_score}/100
                            </Badge>
                          </div>
                          {protocol.requires_specialist && (
                            <div className="text-sm">
                              <span className="text-gray-600">Spécialiste:</span> 
                              <span className="font-medium ml-1">{protocol.specialist_type}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Processus de Détection Multi-Agents
              </CardTitle>
              <CardDescription>
                Workflow opérationnel depuis l'injection jusqu'à la validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div key={step} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{getStepName(step)}</h4>
                      <p className="text-sm text-gray-600">
                        {step === 1 && "Upload et traitement OCR des documents médicaux"}
                        {step === 2 && "Analyse des patterns comportementaux individuels"}
                        {step === 3 && "Détection des réseaux et relations suspectes"}
                        {step === 4 && "Analyse des anomalies temporelles et fréquentielles"}
                        {step === 5 && "Calcul du score de risque global avec protocoles"}
                        {step === 6 && "Validation par expert médical ou agent CNSS"}
                        {step === 7 && "Décision finale et actions (investigation/légal)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">
                        {step <= 5 ? 'Automatique' : 'Manuel'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step <= 5 ? '< 5 min' : 'Variable'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          {selectedWorkflow && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Validation du Cas {selectedWorkflow.case_id}
                </CardTitle>
                <CardDescription>
                  Patient: {selectedWorkflow.patient_name} | Montant: {selectedWorkflow.amount_mad.toLocaleString()} MAD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Informations du Cas</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">ID Cas:</span> <span className="font-medium">{selectedWorkflow.case_id}</span></div>
                        <div><span className="text-gray-600">Patient:</span> <span className="font-medium">{selectedWorkflow.patient_name}</span></div>
                        <div><span className="text-gray-600">Médecin:</span> <span className="font-medium">{selectedWorkflow.doctor_name}</span></div>
                        <div><span className="text-gray-600">Montant:</span> <span className="font-medium text-red-600">{selectedWorkflow.amount_mad.toLocaleString()} MAD</span></div>
                        <div><span className="text-gray-600">Statut:</span> 
                          <Badge className={`ml-2 ${getStatusColor(selectedWorkflow.workflow_status)}`}>
                            {selectedWorkflow.workflow_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Score de Risque Simulé</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Agent Comportemental</span>
                          <Badge className="bg-orange-100 text-orange-800">85/100</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Agent Relationnel</span>
                          <Badge className="bg-yellow-100 text-yellow-800">78/100</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Agent Temporel</span>
                          <Badge className="bg-red-100 text-red-800">91/100</Badge>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Score Global</span>
                            <Badge className="bg-red-100 text-red-800 text-lg">85/100</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Actions de Validation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Button 
                        onClick={() => validateWorkflow(selectedWorkflow.workflow_id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                      <Button 
                        onClick={() => validateWorkflow(selectedWorkflow.workflow_id, 'investigate')}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Investigation
                      </Button>
                      <Button 
                        onClick={() => validateWorkflow(selectedWorkflow.workflow_id, 'legal')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Action Légale
                      </Button>
                      <Button 
                        onClick={() => validateWorkflow(selectedWorkflow.workflow_id, 'reject')}
                        variant="outline"
                      >
                        Rejeter
                      </Button>
                    </div>
                  </div>

                  {selectedWorkflow.workflow_status === 'investigation' && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-orange-800 mb-2">Investigation Complémentaire</h5>
                      <p className="text-sm text-orange-700 mb-3">
                        Ce cas nécessite une investigation approfondie. Assigné à: <strong>Investigateur ALAMI</strong>
                      </p>
                      <div className="text-xs text-orange-600">
                        Délai: 30 jours | Type: Audit terrain | Priorité: Élevée
                      </div>
                    </div>
                  )}

                  {selectedWorkflow.workflow_status === 'legal_action' && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2">Procédure Légale Initiée</h5>
                      <p className="text-sm text-red-700 mb-3">
                        Dossier transmis à: <strong>Huissier BENNANI - Étude BENNANI & Associés</strong>
                      </p>
                      <div className="text-xs text-red-600">
                        Montant à recouvrer: {selectedWorkflow.amount_mad.toLocaleString()} MAD | 
                        Contact: +212 522 123 456
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedWorkflow && (
            <Card>
              <CardContent className="text-center py-12">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun Workflow Sélectionné</h3>
                <p className="text-gray-600">
                  Sélectionnez un workflow dans l'onglet "Workflows Actifs" pour voir les options de validation
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowPanel;

