import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Filter, 
  ArrowLeft, 
  ExternalLink,
  Calendar,
  User,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const DrillDownPanel = () => {
  const [currentView, setCurrentView] = useState('kpis'); // kpis, dossiers, detail, document
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [kpiData, setKpiData] = useState({});
  const [dossiers, setDossiers] = useState([]);
  const [dossierDetail, setDossierDetail] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const kpis = [
    {
      id: 'taux_detection',
      title: 'Taux de Détection',
      icon: Search,
      color: 'bg-blue-500',
      description: 'Pourcentage de fraudes détectées'
    },
    {
      id: 'faux_positifs',
      title: 'Faux Positifs',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      description: 'Alertes incorrectes générées'
    },
    {
      id: 'transactions_min',
      title: 'Transactions/Min',
      icon: Activity,
      color: 'bg-green-500',
      description: 'Volume de transactions traitées'
    },
    {
      id: 'montant_detecte',
      title: 'Montant Détecté',
      icon: DollarSign,
      color: 'bg-purple-500',
      description: 'Montants frauduleux identifiés'
    }
  ];

  const fetchKpiData = async (kpiType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/drill-down/kpi/${kpiType}`);
      const data = await response.json();
      if (data.success) {
        setKpiData(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement KPI:', error);
    }
    setLoading(false);
  };

  const fetchDossiers = async (kpiType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/drill-down/dossiers/${kpiType}`);
      const data = await response.json();
      if (data.success) {
        setDossiers(data.dossiers);
      }
    } catch (error) {
      console.error('Erreur chargement dossiers:', error);
    }
    setLoading(false);
  };

  const fetchDossierDetail = async (dossierId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/drill-down/dossier/${dossierId}`);
      const data = await response.json();
      if (data.success) {
        setDossierDetail(data.dossier);
      }
    } catch (error) {
      console.error('Erreur chargement détail dossier:', error);
    }
    setLoading(false);
  };

  const fetchDocumentPreview = async (dossierId, documentName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/drill-down/preview/${dossierId}/${documentName}`);
      const data = await response.json();
      if (data.success) {
        setDocumentPreview(data.preview);
      }
    } catch (error) {
      console.error('Erreur chargement aperçu document:', error);
    }
    setLoading(false);
  };

  const handleKpiClick = async (kpi) => {
    setSelectedKpi(kpi);
    await fetchKpiData(kpi.id);
    await fetchDossiers(kpi.id);
    setCurrentView('dossiers');
  };

  const handleDossierClick = async (dossier) => {
    setSelectedDossier(dossier);
    await fetchDossierDetail(dossier.id);
    setCurrentView('detail');
  };

  const handleDocumentClick = async (document) => {
    setSelectedDocument(document);
    await fetchDocumentPreview(selectedDossier.id, document);
    setCurrentView('document');
  };

  const goBack = () => {
    if (currentView === 'document') {
      setCurrentView('detail');
      setSelectedDocument(null);
      setDocumentPreview(null);
    } else if (currentView === 'detail') {
      setCurrentView('dossiers');
      setSelectedDossier(null);
      setDossierDetail(null);
    } else if (currentView === 'dossiers') {
      setCurrentView('kpis');
      setSelectedKpi(null);
      setDossiers([]);
      setKpiData({});
    }
  };

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'fraude confirmée':
      case 'fraude confirmee':
        return 'bg-red-100 text-red-800';
      case 'investigation en cours':
        return 'bg-orange-100 text-orange-800';
      case 'validée':
      case 'validee':
        return 'bg-green-100 text-green-800';
      case 'alerte générée':
      case 'alerte generee':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMontant = (montant) => {
    if (montant >= 1000000) {
      return `${(montant / 1000000).toFixed(1)}M MAD`;
    } else if (montant >= 1000) {
      return `${(montant / 1000).toFixed(0)}K MAD`;
    }
    return `${montant} MAD`;
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
      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentView('kpis')}
          className="p-0 h-auto font-normal"
        >
          KPIs
        </Button>
        {selectedKpi && (
          <>
            <span>/</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('dossiers')}
              className="p-0 h-auto font-normal"
            >
              {selectedKpi.title}
            </Button>
          </>
        )}
        {selectedDossier && (
          <>
            <span>/</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('detail')}
              className="p-0 h-auto font-normal"
            >
              {selectedDossier.id}
            </Button>
          </>
        )}
        {selectedDocument && (
          <>
            <span>/</span>
            <span className="text-gray-900">{selectedDocument}</span>
          </>
        )}
      </div>

      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentView !== 'kpis' && (
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentView === 'kpis' && 'Analyse Détaillée des KPIs'}
              {currentView === 'dossiers' && `Dossiers - ${selectedKpi?.title}`}
              {currentView === 'detail' && `Détail Dossier - ${selectedDossier?.id}`}
              {currentView === 'document' && `Document - ${selectedDocument}`}
            </h2>
            <p className="text-gray-600">
              {currentView === 'kpis' && 'Cliquez sur un KPI pour explorer les dossiers détaillés'}
              {currentView === 'dossiers' && `${dossiers.length} dossiers trouvés`}
              {currentView === 'detail' && 'Informations complètes et documents associés'}
              {currentView === 'document' && 'Aperçu et métadonnées du document'}
            </p>
          </div>
        </div>
        
        {currentView === 'dossiers' && (
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Rechercher dans les dossiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        )}
      </div>

      {/* Vue KPIs */}
      {currentView === 'kpis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const IconComponent = kpi.icon;
            return (
              <Card 
                key={kpi.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleKpiClick(kpi)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{kpi.title}</CardTitle>
                  <CardDescription>{kpi.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    Cliquez pour explorer
                  </div>
                  <p className="text-sm text-gray-600">
                    Voir les dossiers détaillés et documents associés
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vue Liste des Dossiers */}
      {currentView === 'dossiers' && (
        <div className="space-y-4">
          {/* Résumé KPI */}
          {kpiData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Valeur Actuelle</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedKpi?.id === 'montant_detecte' 
                        ? formatMontant(kpiData.valeur_actuelle)
                        : `${kpiData.valeur_actuelle}${selectedKpi?.id.includes('taux') || selectedKpi?.id.includes('positifs') ? '%' : ''}`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Objectif</p>
                    <p className="text-lg font-semibold">
                      {selectedKpi?.id === 'montant_detecte' 
                        ? formatMontant(kpiData.objectif)
                        : `${kpiData.objectif}${selectedKpi?.id.includes('taux') || selectedKpi?.id.includes('positifs') ? '%' : ''}`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tendance</p>
                    <p className="text-lg font-semibold text-green-600">{kpiData.tendance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Dossiers</p>
                    <p className="text-lg font-semibold">{dossiers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des dossiers */}
          <div className="grid gap-4">
            {dossiers.map((dossier, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDossierClick(dossier)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="font-mono">
                        {dossier.id}
                      </Badge>
                      <Badge className={getStatutColor(dossier.statut)}>
                        {dossier.statut}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{dossier.date_detection || dossier.date_alerte || dossier.timestamp || dossier.periode}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Patient/Entité</p>
                      <p className="font-semibold">{dossier.patient || dossier.type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Médecin/Source</p>
                      <p className="font-semibold">{dossier.medecin || dossier.methode_recuperation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant</p>
                      <p className="font-semibold text-green-600">
                        {formatMontant(dossier.montant)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score/Indicateur</p>
                      <p className="font-semibold">
                        {dossier.score_risque ? `${dossier.score_risque}/100` : 
                         dossier.nombre_cas ? `${dossier.nombre_cas} cas` :
                         dossier.temps_traitement || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {dossier.documents?.length || 0} document(s)
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vue Détail Dossier */}
      {currentView === 'detail' && dossierDetail && (
        <div className="space-y-6">
          {/* En-tête du dossier */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Dossier {dossierDetail.id}</CardTitle>
                  <CardDescription>
                    {dossierDetail.type_fraude || dossierDetail.type || 'Dossier CNSS'}
                  </CardDescription>
                </div>
                <Badge className={getStatutColor(dossierDetail.statut)}>
                  {dossierDetail.statut}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Informations Patient
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Nom:</span> {dossierDetail.patient}</p>
                    <p><span className="text-gray-600">Médecin:</span> {dossierDetail.medecin}</p>
                    <p><span className="text-gray-600">Pharmacie:</span> {dossierDetail.pharmacie}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Métriques
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Score risque:</span> {dossierDetail.score_risque || dossierDetail.score_initial}/100</p>
                    <p><span className="text-gray-600">Montant:</span> {formatMontant(dossierDetail.montant)}</p>
                    <p><span className="text-gray-600">Date:</span> {dossierDetail.date_detection || dossierDetail.date_alerte}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Actions
                  </h4>
                  <div className="space-y-2">
                    {dossierDetail.actions_disponibles?.map((action, index) => (
                      <Button key={index} variant="outline" size="sm" className="w-full justify-start">
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents associés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents Associés ({dossierDetail.documents?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dossierDetail.documents?.map((document, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDocumentClick(document)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{document}</h4>
                      <p className="text-xs text-gray-600">
                        {document.includes('ordonnance') ? 'Ordonnance médicale' :
                         document.includes('rapport') ? 'Rapport d\'investigation' :
                         document.includes('facture') ? 'Facture' :
                         'Document administratif'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historique */}
          {dossierDetail.historique && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Historique du Dossier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dossierDetail.historique.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{event.action}</p>
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.details}</p>
                        <p className="text-xs text-gray-500">Par: {event.utilisateur}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Vue Document */}
      {currentView === 'document' && documentPreview && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {selectedDocument}
                  </CardTitle>
                  <CardDescription>
                    {documentPreview.type} - Aperçu simulé
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ouvrir
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-white p-6 rounded border shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-center border-b pb-2">
                    {documentPreview.type}
                  </h3>
                  
                  {documentPreview.type === 'Ordonnance médicale' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Médecin:</strong> {documentPreview.medecin}</p>
                          <p><strong>Patient:</strong> {documentPreview.patient}</p>
                        </div>
                        <div>
                          <p><strong>Date:</strong> {documentPreview.date}</p>
                          <p><strong>Cachet:</strong> {documentPreview.cachet}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Prescriptions:</h4>
                        <div className="space-y-2">
                          {documentPreview.prescriptions?.map((prescription, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                              <p><strong>{prescription.medicament}</strong></p>
                              <p>Quantité: {prescription.quantite}</p>
                              <p>Posologie: {prescription.posologie}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center pt-4 border-t">
                        <p className="text-sm text-green-600">✓ {documentPreview.signature}</p>
                      </div>
                    </div>
                  )}
                  
                  {documentPreview.type === 'Rapport d\'investigation' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Enquêteur:</strong> {documentPreview.enqueteur}</p>
                          <p><strong>Date:</strong> {documentPreview.date}</p>
                        </div>
                        <div>
                          <p><strong>Résumé:</strong> {documentPreview.resume}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Conclusions:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {documentPreview.conclusions?.map((conclusion, index) => (
                            <li key={index} className="text-sm">{conclusion}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Recommandations:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {documentPreview.recommandations?.map((recommandation, index) => (
                            <li key={index} className="text-sm text-orange-700">{recommandation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {documentPreview.type === 'Document administratif' && (
                    <div className="space-y-4">
                      <p><strong>Description:</strong> {documentPreview.description}</p>
                      <p><strong>Statut:</strong> {documentPreview.statut}</p>
                      <p><strong>Référence:</strong> {documentPreview.reference}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {documentPreview.message}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DrillDownPanel;

