import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock, FileText, User, Building, MapPin, Calendar, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import CaseDetailModal from './CaseDetailModal';

const SupabaseSearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    case_type: '',
    min_amount: '',
    max_amount: '',
    region: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    has_more: false
  });
  const [statistics, setStatistics] = useState({
    total_cases: 0,
    confirmed_cases: 0,
    total_amount_mad: 0,
    detection_rate: 0
  });

  // Données simulées pour démonstration
  const mockCases = [
    {
      id: 'DET_001',
      type: 'Prescription excessive',
      status: 'confirmed',
      complexity_score: 95,
      amount_mad: 18000.00,
      detection_date: '2025-01-15T10:30:00Z',
      patient: { name: 'Amina BENALI' },
      doctor: { name: 'Dr. Ahmed TAZI' },
      pharmacy: { name: 'Pharmacie Al Andalous' },
      metrics: { prescription_count: 1, document_count: 3 }
    },
    {
      id: 'DET_002',
      type: 'Réseau organisé',
      status: 'investigation',
      complexity_score: 98,
      amount_mad: 2300000.00,
      detection_date: '2025-01-14T14:20:00Z',
      patient: { name: 'Hassan IDRISSI' },
      doctor: { name: 'Dr. Fatima ALAOUI' },
      pharmacy: { name: 'Pharmacie Atlas' },
      metrics: { prescription_count: 15, document_count: 47 }
    },
    {
      id: 'DET_003',
      type: 'Usurpation identité',
      status: 'confirmed',
      complexity_score: 94,
      amount_mad: 1200000.00,
      detection_date: '2025-01-13T16:45:00Z',
      patient: { name: 'Khadija BENNANI' },
      doctor: { name: 'Dr. Youssef ALAMI' },
      pharmacy: { name: 'Pharmacie Centrale' },
      metrics: { prescription_count: 8, document_count: 12 }
    },
    {
      id: 'DET_004',
      type: 'Fraude temporelle',
      status: 'confirmed',
      complexity_score: 92,
      amount_mad: 950000.00,
      detection_date: '2025-01-12T11:15:00Z',
      patient: { name: 'Youssef ALAMI' },
      doctor: { name: 'Dr. Hassan BENALI' },
      pharmacy: { name: 'Pharmacie Moderne' },
      metrics: { prescription_count: 5, document_count: 8 }
    },
    {
      id: 'DET_005',
      type: 'Fraude biologique',
      status: 'investigation',
      complexity_score: 91,
      amount_mad: 1100000.00,
      detection_date: '2025-01-11T09:30:00Z',
      patient: { name: 'Fatima ZAHRA' },
      doctor: { name: 'Dr. Aicha IDRISSI' },
      pharmacy: { name: 'Pharmacie du Centre' },
      metrics: { prescription_count: 12, document_count: 18 }
    }
  ];

  // Simulation de l'API Supabase
  const fetchCases = async (searchQuery = '', appliedFilters = {}, page = 1) => {
    setLoading(true);
    
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockCases];
    
    // Application de la recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(case_ => 
        case_.id.toLowerCase().includes(query) ||
        case_.patient.name.toLowerCase().includes(query) ||
        case_.doctor.name.toLowerCase().includes(query) ||
        case_.pharmacy.name.toLowerCase().includes(query) ||
        case_.type.toLowerCase().includes(query)
      );
    }
    
    // Application des filtres
    if (appliedFilters.status) {
      filtered = filtered.filter(case_ => case_.status === appliedFilters.status);
    }
    if (appliedFilters.case_type) {
      filtered = filtered.filter(case_ => case_.type === appliedFilters.case_type);
    }
    if (appliedFilters.min_amount) {
      filtered = filtered.filter(case_ => case_.amount_mad >= parseFloat(appliedFilters.min_amount));
    }
    if (appliedFilters.max_amount) {
      filtered = filtered.filter(case_ => case_.amount_mad <= parseFloat(appliedFilters.max_amount));
    }
    
    // Pagination simulée
    const startIndex = (page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedCases = filtered.slice(startIndex, endIndex);
    
    setCases(paginatedCases);
    setFilteredCases(paginatedCases);
    setPagination(prev => ({
      ...prev,
      page,
      total: filtered.length,
      has_more: endIndex < filtered.length
    }));
    
    setLoading(false);
  };

  // Chargement initial
  useEffect(() => {
    fetchCases();
    // Simulation des statistiques
    setStatistics({
      total_cases: 127,
      confirmed_cases: 89,
      total_amount_mad: 12300000,
      detection_rate: 94.2
    });
  }, []);

  // Recherche en temps réel
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        fetchCases(searchTerm, filters, 1);
      } else {
        fetchCases('', filters, 1);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    fetchCases(searchTerm, newFilters, 1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      case_type: '',
      min_amount: '',
      max_amount: '',
      region: ''
    });
    fetchCases(searchTerm, {}, 1);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'investigation': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'detected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'investigation': return 'Investigation';
      case 'detected': return 'Détecté';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'investigation': return 'bg-yellow-100 text-yellow-800';
      case 'detected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (caseData) => {
    // Adapter les données pour le modal
    const adaptedCase = {
      ...caseData,
      patient_name: caseData.patient.name,
      doctor_name: caseData.doctor.name,
      pharmacy_name: caseData.pharmacy.name,
      amount: caseData.amount_mad,
      risk_score: caseData.complexity_score,
      fraud_type: caseData.type,
      detection_date: formatDate(caseData.detection_date)
    };
    setSelectedCase(adaptedCase);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Base de Données Supabase - Cas de Fraude</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Connecté à Supabase</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Cas</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total_cases}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Cas Confirmés</p>
                <p className="text-2xl font-bold text-green-900">{statistics.confirmed_cases}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Montant Total</p>
                <p className="text-2xl font-bold text-purple-900">{formatAmount(statistics.total_amount_mad)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Taux Détection</p>
                <p className="text-2xl font-bold text-orange-900">{statistics.detection_rate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par ID, patient, médecin, pharmacie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            
            <button
              onClick={() => fetchCases(searchTerm, filters, 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
        
        {/* Panneau de filtres */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous</option>
                  <option value="detected">Détecté</option>
                  <option value="investigation">Investigation</option>
                  <option value="confirmed">Confirmé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de Cas</label>
                <select
                  value={filters.case_type}
                  onChange={(e) => handleFilterChange('case_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous</option>
                  <option value="Prescription excessive">Prescription excessive</option>
                  <option value="Réseau organisé">Réseau organisé</option>
                  <option value="Usurpation identité">Usurpation identité</option>
                  <option value="Fraude temporelle">Fraude temporelle</option>
                  <option value="Fraude biologique">Fraude biologique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant Min (MAD)</label>
                <input
                  type="number"
                  value={filters.min_amount}
                  onChange={(e) => handleFilterChange('min_amount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant Max (MAD)</label>
                <input
                  type="number"
                  value={filters.max_amount}
                  onChange={(e) => handleFilterChange('max_amount', e.target.value)}
                  placeholder="∞"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des cas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Résultats de Recherche ({filteredCases.length} cas trouvés)
            </h3>
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Chargement...</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredCases.map((case_) => (
            <div key={case_.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* En-tête du cas */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-blue-600">{case_.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                      {getStatusLabel(case_.status)}
                    </span>
                    <span className="text-sm text-gray-500">{case_.type}</span>
                  </div>
                  
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Patient:</span>
                      <span className="font-medium">{case_.patient.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Médecin:</span>
                      <span className="font-medium">{case_.doctor.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Pharmacie:</span>
                      <span className="font-medium">{case_.pharmacy.name}</span>
                    </div>
                  </div>
                  
                  {/* Métriques */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Détecté:</span>
                      <span>{formatDate(case_.detection_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-semibold text-red-600">{formatAmount(case_.amount_mad)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Score:</span>
                      <span className="font-semibold">{case_.complexity_score}/100</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{case_.metrics.prescription_count} prescriptions</span>
                      <span>{case_.metrics.document_count} documents</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => handleViewDetails(case_)}>
                    <Eye className="w-4 h-4" />
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message si aucun résultat */}
        {!loading && filteredCases.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cas trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche ou vos filtres.</p>
          </div>
        )}
      </div>

      {/* Modal de détail */}
      <CaseDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caseData={selectedCase}
      />
    </div>
  );
};

export default SupabaseSearchPanel;

