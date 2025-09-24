import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [agentsSubTab, setAgentsSubTab] = useState('vue-ensemble');
  const [protocolesSubTab, setProtocolesSubTab] = useState('actifs');
  const [moteurSubTab, setMoteurSubTab] = useState('regles-actives');
  const [databaseSubTab, setDatabaseSubTab] = useState('dossiers');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Données des 5 agents selon PowerPoint CNSS
  const agents = [
    {
      id: 1,
      nom: "Agent de Détection",
      description: "Analyse temps réel avec seuils dynamiques",
      icon: "🔍",
      couleur: "bg-blue-500",
      casTraites: 1247,
      tauxSucces: 94.2,
      documentsUploades: 23,
      reglesMetier: [
        "Chiffre d'affaires anormal > 200% moyenne",
        "Réseaux de connivence détectés",
        "Profils de prescription suspects",
        "Fréquence anormale consultations",
        "Validation documents temps réel"
      ]
    },
    {
      id: 2,
      nom: "Agent d'Analyse",
      description: "Investigation approfondie et scoring précis",
      icon: "📊",
      couleur: "bg-green-500",
      casTraites: 892,
      tauxSucces: 96.8,
      documentsUploades: 34,
      reglesMetier: [
        "Scoring fraude multi-critères",
        "Analyse comportementale avancée",
        "Corrélation données externes",
        "Investigation approfondie",
        "Validation croisée sources"
      ]
    },
    {
      id: 3,
      nom: "Agent de Reporting",
      description: "Rapports explicables en langage naturel",
      icon: "📋",
      couleur: "bg-purple-500",
      casTraites: 567,
      tauxSucces: 98.1,
      documentsUploades: 45,
      reglesMetier: [
        "Génération rapports automatiques",
        "Explicabilité IA en français",
        "Synthèse exécutive",
        "Recommandations actions",
        "Conformité réglementaire"
      ]
    },
    {
      id: 4,
      nom: "Agent de Réseau",
      description: "Détection fraudes organisées et collusion",
      icon: "🕸️",
      couleur: "bg-red-500",
      casTraites: 234,
      tauxSucces: 91.7,
      documentsUploades: 28,
      reglesMetier: [
        "Détection réseaux organisés",
        "Analyse collusion prestataires",
        "Cartographie connexions",
        "Fraudes coordonnées",
        "Intelligence artificielle réseau"
      ]
    },
    {
      id: 5,
      nom: "Agent d'Apprentissage",
      description: "Amélioration continue des modèles",
      icon: "🧠",
      couleur: "bg-orange-500",
      casTraites: 1456,
      tauxSucces: 89.3,
      documentsUploades: 67,
      reglesMetier: [
        "Apprentissage automatique continu",
        "Adaptation nouveaux schémas",
        "Optimisation modèles IA",
        "Feedback boucle fermée",
        "Évolution algorithmes"
      ]
    }
  ];

  // Données des dossiers avec assurés et bénéficiaires
  const dossiersDetailles = [
    {
      id: "FR001",
      assure: {
        nom: "Ahmed Benali",
        cin: "BK123456",
        age: 45,
        adresse: "Casablanca, Maroc",
        numeroAffiliation: "CNSS789123"
      },
      beneficiaires: [
        { nom: "Fatima Benali", relation: "Épouse", age: 42, cin: "BK123457" },
        { nom: "Omar Benali", relation: "Fils", age: 16, cin: "BK123458" },
        { nom: "Aicha Benali", relation: "Fille", age: 14, cin: "BK123459" }
      ],
      montantFraude: 15420,
      decompositionMontant: {
        parPrestataire: {
          "Dr. Hassan Alami": 8500,
          "Pharmacie Al Baraka": 4200,
          "Laboratoire Central": 2720
        },
        parBeneficiaire: {
          "Ahmed Benali": 9200,
          "Fatima Benali": 3800,
          "Omar Benali": 1420,
          "Aicha Benali": 1000
        }
      },
      typeFraude: "Fraudes de santé",
      scoreConfiance: 94.2,
      statut: "Confirmé",
      agentDetecteur: "Agent de Détection",
      conformiteDocumentaire: {
        cachetMedical: true,
        signatureAssuré: false,
        codesBarres: true,
        scoreConformite: 67
      },
      historique: [
        { date: "2024-01-15", action: "Détection initiale", agent: "Agent de Détection", details: "Montant anormalement élevé détecté" },
        { date: "2024-01-16", action: "Analyse approfondie", agent: "Agent d'Analyse", details: "Confirmation du schéma frauduleux" },
        { date: "2024-01-17", action: "Investigation terrain", agent: "Agent de Réseau", details: "Vérification auprès des prestataires" },
        { date: "2024-01-18", action: "Rapport final", agent: "Agent de Reporting", details: "Fraude confirmée - Dossier transmis" }
      ]
    },
    {
      id: "FR002", 
      assure: {
        nom: "Khadija Moussaoui",
        cin: "BK234567",
        age: 38,
        adresse: "Rabat, Maroc",
        numeroAffiliation: "CNSS456789"
      },
      beneficiaires: [
        { nom: "Youssef Moussaoui", relation: "Fils", age: 12, cin: "BK234568" },
        { nom: "Salma Moussaoui", relation: "Fille", age: 8, cin: "BK234569" }
      ],
      montantFraude: 8750,
      decompositionMontant: {
        parPrestataire: {
          "Dr. Amina Tazi": 5200,
          "Pharmacie Centrale": 2300,
          "Clinique Atlas": 1250
        },
        parBeneficiaire: {
          "Khadija Moussaoui": 4500,
          "Youssef Moussaoui": 2750,
          "Salma Moussaoui": 1500
        }
      },
      typeFraude: "Fraudes documentaires",
      scoreConfiance: 87.5,
      statut: "En investigation",
      agentDetecteur: "Agent d'Analyse",
      conformiteDocumentaire: {
        cachetMedical: true,
        signatureAssuré: true,
        codesBarres: false,
        scoreConformite: 78
      },
      historique: [
        { date: "2024-01-20", action: "Détection automatique", agent: "Agent de Détection", details: "Documents suspects identifiés" },
        { date: "2024-01-21", action: "Analyse documentaire", agent: "Agent d'Analyse", details: "Incohérences dans les prescriptions" },
        { date: "2024-01-22", action: "Investigation en cours", agent: "Agent de Réseau", details: "Vérification authenticité documents" }
      ]
    }
  ];

  const kpiData = {
    "taux-detection": {
      titre: "Taux de Détection",
      valeur: "94.2%",
      dossiers: dossiersDetailles.filter(d => d.statut === "Confirmé")
    },
    "faux-positifs": {
      titre: "Faux Positifs", 
      valeur: "5.8%",
      dossiers: [
        {
          id: "FP001",
          assure: { nom: "Mohamed Alaoui", cin: "BK345678" },
          montantFraude: 0,
          typeFraude: "Faux positif",
          scoreConfiance: 23.1,
          statut: "Rejeté"
        }
      ]
    },
    "transactions-min": {
      titre: "Transactions/Min",
      valeur: "1,247",
      dossiers: [
        {
          id: "TR001",
          assure: { nom: "Transactions en cours", cin: "N/A" },
          montantFraude: 0,
          typeFraude: "Traitement",
          scoreConfiance: 0,
          statut: "En cours"
        }
      ]
    },
    "montant-detecte": {
      titre: "Montant Détecté",
      valeur: "2.4M MAD",
      dossiers: dossiersDetailles.filter(d => d.montantFraude > 10000)
    }
  };

  const protocoles = [
    {
      id: 1,
      nom: "Protocole Cardiologie",
      specialite: "Cardiologie",
      regles: [
        { type: "Dosage", description: "Aspirine 75mg/jour max", priorite: "Critique" },
        { type: "Contre-indication", description: "Allergie aspirine", priorite: "Critique" },
        { type: "Surveillance", description: "INR mensuel", priorite: "Haute" }
      ],
      statut: "Actif",
      dateCreation: "2024-01-15"
    },
    {
      id: 2,
      nom: "Protocole Diabète",
      specialite: "Endocrinologie",
      regles: [
        { type: "Dosage", description: "Metformine 1000mg 2x/jour", priorite: "Critique" },
        { type: "Surveillance", description: "HbA1c trimestrielle", priorite: "Haute" },
        { type: "Interaction", description: "Éviter avec alcool", priorite: "Moyenne" }
      ],
      statut: "Actif", 
      dateCreation: "2024-01-10"
    }
  ];

  const renderAgentsVueEnsemble = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${agent.couleur} rounded-lg flex items-center justify-center text-white text-xl`}>
                {agent.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{agent.nom}</h3>
                <p className="text-sm text-gray-600">{agent.description}</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Actif
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{agent.casTraites}</div>
              <div className="text-xs text-gray-500">Cas traités</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{agent.tauxSucces}%</div>
              <div className="text-xs text-gray-500">Taux succès</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Règles Métier</h4>
            <div className="space-y-1">
              {agent.reglesMetier.slice(0, 3).map((regle, index) => (
                <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  • {regle}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              📁 {agent.documentsUploades} documents
            </div>
            <button 
              onClick={() => {
                setSelectedAgent(agent);
                setShowDetailModal(true);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              👁️ Voir détails
            </button>
          </div>

          <button 
            onClick={() => {
              setSelectedAgent(agent);
              alert(`Analyse lancée avec ${agent.nom}\n\nTraitement de ${agent.documentsUploades} documents en cours...\n\nRésultats disponibles dans quelques instants.`);
            }}
            className={`w-full ${agent.couleur} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
          >
            Analyser avec {agent.nom}
          </button>
        </div>
      ))}
    </div>
  );

  const renderAgentsVueDetaillee = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAgent?.id === agent.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 ${agent.couleur} rounded-lg flex items-center justify-center text-white`}>
                {agent.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{agent.nom}</h3>
                <p className="text-sm text-gray-600">{agent.casTraites} cas</p>
              </div>
            </div>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm">
              Détails
            </button>
          </div>
        ))}
      </div>

      {selectedAgent && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {/* En-tête avec nom de l'agent */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${selectedAgent.couleur} rounded-lg flex items-center justify-center text-white text-xl`}>
                {selectedAgent.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedAgent.nom}</h3>
                <p className="text-sm text-gray-600">Ingestion et normalisation des données AMO</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{selectedAgent.casTraites}</div>
                <div className="text-sm text-gray-500">Total des cas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{selectedAgent.tauxSucces} %</div>
                <div className="text-sm text-gray-500">Taux succès</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{selectedAgent.documentsUploades}</div>
                <div className="text-sm text-gray-500">Cas actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.floor(selectedAgent.casTraites * 0.8)}</div>
                <div className="text-sm text-gray-500">Cas résolus</div>
              </div>
            </div>

            {/* Barres de progression */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Cas actifs</span>
                  <span className="text-sm font-bold text-orange-600">{selectedAgent.documentsUploades}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{width: '23%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Cas résolus</span>
                  <span className="text-sm font-bold text-green-600">{Math.floor(selectedAgent.casTraites * 0.8)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>

            {/* Section Cas de Fraude Détectés */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800">Cas de Fraude Détectés ( 2 )</h4>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded text-sm">
                    <span>🔍</span>
                    <span>Filtrer</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded text-sm">
                    <span>⬇️</span>
                    <span>Exportateur</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50 border-l-4 border-l-yellow-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">⚠️ MOYEN</span>
                      <span className="font-bold text-gray-800">COL_001</span>
                      <span className="text-gray-600">Format invalide</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">2 450 MAD</div>
                      <div className="text-sm text-gray-500">15/01/2025 14:30</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3">
                    Ordonnance avec format PDF corrompu, extraction OCR partielle
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Patient:</span>
                      <div className="text-sm text-gray-800">M. Hassan B****</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Médecin:</span>
                      <div className="text-sm text-gray-800">Dr Ahmed T****</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Pharmacie:</span>
                      <div className="text-sm text-gray-800">Pharmacie Al Andalous</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">En cours</span>
                      <span className="text-sm text-gray-600">Confiance : 78 %</span>
                    </div>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm">
                      <span>👁️</span>
                      <span>Détails</span>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-red-50 border-l-4 border-l-red-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">🚨 ÉLEVÉ</span>
                      <span className="font-bold text-gray-800">COL_002</span>
                      <span className="text-gray-600">Montant suspect</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">8 750 MAD</div>
                      <div className="text-sm text-gray-500">14/01/2025 09:15</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3">
                    Montant anormalement élevé pour consultation standard, investigation requise
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Patient:</span>
                      <div className="text-sm text-gray-800">Mme Fatima A****</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Médecin:</span>
                      <div className="text-sm text-gray-800">Dr Hassan M****</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Pharmacie:</span>
                      <div className="text-sm text-gray-800">Pharmacie Centrale</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Confirmé</span>
                      <span className="text-sm text-gray-600">Confiance : 94 %</span>
                    </div>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm">
                      <span>👁️</span>
                      <span>Détails</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDrillDown = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyse Détaillée des KPIs</h2>
        <p className="text-gray-600">Cliquez sur un KPI pour explorer les dossiers détaillés</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(kpiData).map(([key, kpi]) => (
          <div 
            key={key}
            onClick={() => setSelectedKPI(key)}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{kpi.valeur}</div>
              <div className="text-gray-700 font-medium mb-2">{kpi.titre}</div>
              <div className="text-sm text-gray-500 mb-4">
                Cliquez pour explorer
              </div>
              <div className="text-xs text-blue-600">
                Voir les dossiers détaillés et documents associés
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedKPI && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Exploration: {kpiData[selectedKPI].titre}
            </h3>
            <button 
              onClick={() => setSelectedKPI(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {kpiData[selectedKPI].dossiers.map((dossier) => (
              <div key={dossier.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {dossier.assure.nom} - Dossier {dossier.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      CIN: {dossier.assure.cin} | Type: {dossier.typeFraude}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {dossier.montantFraude > 0 ? `${dossier.montantFraude.toLocaleString()} MAD` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Score: {dossier.scoreConfiance}%
                    </div>
                  </div>
                </div>

                {dossier.montantFraude > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Décomposition du montant:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-gray-600 mb-1">Par prestataire:</h6>
                        {Object.entries(dossier.decompositionMontant?.parPrestataire || {}).map(([prestataire, montant]) => (
                          <div key={prestataire} className="flex justify-between text-sm">
                            <span>{prestataire}:</span>
                            <span className="font-medium">{montant.toLocaleString()} MAD</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-600 mb-1">Par bénéficiaire:</h6>
                        {Object.entries(dossier.decompositionMontant?.parBeneficiaire || {}).map(([beneficiaire, montant]) => (
                          <div key={beneficiaire} className="flex justify-between text-sm">
                            <span>{beneficiaire}:</span>
                            <span className="font-medium">{montant.toLocaleString()} MAD</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dossier.statut === 'Confirmé' ? 'bg-red-100 text-red-800' :
                      dossier.statut === 'En investigation' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {dossier.statut}
                    </span>
                    {dossier.agentDetecteur && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {dossier.agentDetecteur}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedCase(dossier);
                        setShowDetailModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Voir Détails Complets
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                      Cas Similaires
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProtocolesTherapeutiques = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Protocoles Thérapeutiques</h2>
        <button 
          onClick={() => setShowProtocolModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Nouveau Protocole
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'actifs', label: 'Protocoles Actifs' },
            { id: 'creation', label: 'Création' },
            { id: 'standards', label: 'Standards Mondiaux' },
            { id: 'fusion', label: 'Fusion de Protocoles' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProtocolesSubTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                protocolesSubTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {protocolesSubTab === 'actifs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protocoles.map((protocole) => (
            <div key={protocole.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{protocole.nom}</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {protocole.statut}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">Spécialité: {protocole.specialite}</p>
              
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-gray-700">Règles ({protocole.regles.length}):</h4>
                {protocole.regles.map((regle, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <span className="font-medium text-sm">{regle.type}:</span>
                      <span className="text-sm text-gray-600 ml-2">{regle.description}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      regle.priorite === 'Critique' ? 'bg-red-100 text-red-800' :
                      regle.priorite === 'Haute' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {regle.priorite}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-500">
                Créé le: {protocole.dateCreation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMoteurRegles = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Moteur de Règles</h2>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'regles-actives', label: 'Règles Actives' },
            { id: 'configuration', label: 'Configuration' },
            { id: 'seuils', label: 'Seuils & Alertes' },
            { id: 'performance', label: 'Performance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMoteurSubTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                moteurSubTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {moteurSubTab === 'regles-actives' && (
        <div className="space-y-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 ${agent.couleur} rounded-lg flex items-center justify-center text-white`}>
                  {agent.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{agent.nom}</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {agent.reglesMetier.length} règles actives
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.reglesMetier.map((regle, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                    <div className="font-medium text-sm text-gray-800 mb-1">
                      Règle #{index + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {regle}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-green-600 font-medium">✓ Active</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Configurer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {moteurSubTab === 'configuration' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Configuration des Règles de Détection</h3>
              <button 
                onClick={() => alert('Nouvelle règle créée:\n\nNom: Détection Montant Suspect\nType: Seuil financier\nCondition: Montant > 5000 MAD\nAction: Alerte immédiate\n\nRègle activée avec succès!')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                + Ajouter une Règle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Règles Financières</h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Montant Maximum Consultation</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Seuil: 2000 MAD</div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Fréquence Consultation Anormale</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Seuil: > 5 consultations/semaine</div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Règles Comportementales</h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Réseau de Connivence</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Détection: > 3 prestataires liés</div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Documents Falsifiés</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                    </div>
                      <div className="text-sm text-gray-600 mb-2">IA Score: &lt; 70% confiance</div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {moteurSubTab === 'seuils' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Configuration des Seuils et Alertes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 mb-3">🚨 Alertes Critiques</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Montant > 10K MAD</span>
                    <input type="range" min="5000" max="20000" defaultValue="10000" className="w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Réseau organisé</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documents falsifiés</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-bold text-yellow-800 mb-3">⚠️ Alertes Moyennes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Montant > 5K MAD</span>
                    <input type="range" min="2000" max="10000" defaultValue="5000" className="w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fréquence anormale</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prescription suspecte</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">ℹ️ Alertes Informatives</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Montant > 2K MAD</span>
                    <input type="range" min="1000" max="5000" defaultValue="2000" className="w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nouveau prestataire</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Géolocalisation</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                Réinitialiser
              </button>
              <button 
                onClick={() => alert('Configuration des seuils sauvegardée avec succès!\n\nNouvelles valeurs appliquées:\n• Alerte critique: > 10K MAD\n• Alerte moyenne: > 5K MAD\n• Alerte info: > 2K MAD')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {moteurSubTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Métriques Globales</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Règles actives:</span>
                  <span className="font-bold text-blue-600">28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Précision:</span>
                  <span className="font-bold text-green-600">96.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temps moyen:</span>
                  <span className="font-bold text-orange-600">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Faux positifs:</span>
                  <span className="font-bold text-red-600">3.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Performance par Agent</h3>
              <div className="space-y-2">
                {agents.slice(0, 4).map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{agent.nom.split(' ')[2]}:</span>
                    <span className="font-medium text-green-600">{agent.tauxSucces}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Alertes Dernières 24h</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Critiques:</span>
                  <span className="font-bold text-red-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Moyennes:</span>
                  <span className="font-bold text-yellow-600">34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Informatives:</span>
                  <span className="font-bold text-blue-600">67</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-gray-800">113</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tendances</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cette semaine:</span>
                  <span className="font-bold text-green-600">+12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ce mois:</span>
                  <span className="font-bold text-green-600">+8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficacité:</span>
                  <span className="font-bold text-blue-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Économies:</span>
                  <span className="font-bold text-purple-600">2.4M MAD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Graphique de Performance (Simulation)</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">📊</div>
                <div className="text-gray-600">Graphique de performance en temps réel</div>
                <div className="text-sm text-gray-500 mt-2">Détection: 94.2% | Précision: 96.8% | Vitesse: 12ms</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AXM CNSS</h1>
                <p className="text-sm text-gray-600">Détection de Fraude IA Multi-Agents</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'agents', label: 'Agents Spécialisés', icon: '🤖' },
              { id: 'detection', label: 'Détection Unifiée', icon: '🔍' },
              { id: 'protocoles', label: 'Protocoles Thérapeutiques', icon: '💊' },
              { id: 'moteur', label: 'Moteur de Règles', icon: '⚙️' },
              { id: 'database', label: 'Base de Données', icon: '🗄️' },
              { id: 'dashboard', label: 'Tableau de Bord', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'vue-ensemble', label: 'Vue d\'Ensemble' },
                  { id: 'vue-detaillee', label: 'Vue Détaillée' },
                  { id: 'workflow', label: 'Workflow' },
                  { id: 'drill-down', label: 'Drill Down' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAgentsSubTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      agentsSubTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {agentsSubTab === 'vue-ensemble' && renderAgentsVueEnsemble()}
            {agentsSubTab === 'vue-detaillee' && renderAgentsVueDetaillee()}
            {agentsSubTab === 'workflow' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Parcours Patient-Médecin-Pharmacie-CNSS</h3>
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-6">
                  <button 
                    onClick={() => alert('Patients impliqués dans les fraudes:\n\n• Ahmed Benali (CIN: BK123456) - 15,420 MAD\n• Youssef Bennani (CIN: BK345789) - 16,850 MAD\n• Latifa Amrani (CIN: BK456890) - 14,200 MAD\n• Rachid Tazi (CIN: BK567901) - 12,900 MAD\n\nTotal: 4 patients concernés')}
                    className="text-center hover:bg-blue-100 p-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mb-2 mx-auto">👤</div>
                    <div className="font-semibold">Patient</div>
                    <div className="text-sm text-gray-600">Consultation</div>
                    <div className="text-xs text-blue-600 mt-1">Cliquer pour voir la liste</div>
                  </button>
                  <div className="text-2xl text-gray-400">→</div>
                  <button 
                    onClick={() => alert('Médecins impliqués dans les fraudes:\n\n• Dr. Hassan Alami (Cardiologie) - 23 cas - 450K MAD\n• Dr. Amina Tazi (Gynécologie) - 18 cas - 320K MAD\n• Dr. Youssef Bennani (Neurologie) - 15 cas - 280K MAD\n• Dr. Ahmed Mansouri (Médecine générale) - 12 cas - 210K MAD\n\nTotal: 4 médecins sous surveillance')}
                    className="text-center hover:bg-green-100 p-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mb-2 mx-auto">👨‍⚕️</div>
                    <div className="font-semibold">Médecin</div>
                    <div className="text-sm text-gray-600">Prescription</div>
                    <div className="text-xs text-green-600 mt-1">Cliquer pour voir la liste</div>
                  </button>
                  <div className="text-2xl text-gray-400">→</div>
                  <button 
                    onClick={() => alert('Pharmacies impliquées dans les fraudes:\n\n• Pharmacie Al Baraka (Rabat) - 31 cas - 580K MAD\n• Pharmacie Centrale (Casablanca) - 26 cas - 470K MAD\n• Pharmacie Atlas (Marrakech) - 19 cas - 340K MAD\n• Pharmacie Moderne (Fès) - 14 cas - 250K MAD\n\nTotal: 4 pharmacies sous investigation')}
                    className="text-center hover:bg-purple-100 p-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mb-2 mx-auto">🏥</div>
                    <div className="font-semibold">Pharmacie</div>
                    <div className="text-sm text-gray-600">Délivrance</div>
                    <div className="text-xs text-purple-600 mt-1">Cliquer pour voir la liste</div>
                  </button>
                  <div className="text-2xl text-gray-400">→</div>
                  <button 
                    onClick={() => alert('Système CNSS - Détection de Fraude:\n\n• Total remboursements analysés: 2,940 cas\n• Fraudes détectées: 127 cas (4.3%)\n• Montant total récupéré: 2.4M MAD\n• Taux de détection: 94.2%\n\nStatut: Système opérationnel')}
                    className="text-center hover:bg-red-100 p-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl mb-2 mx-auto">🏛️</div>
                    <div className="font-semibold">CNSS</div>
                    <div className="text-sm text-gray-600">Remboursement</div>
                    <div className="text-xs text-red-600 mt-1">Cliquer pour voir les stats</div>
                  </button>
                </div>

                {/* Section détaillée du workflow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3">🔍 Points de Contrôle Automatiques</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Validation identité patient</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Vérification prescription médicale</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Contrôle délivrance pharmacie</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>Analyse remboursement CNSS</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-3">⚠️ Alertes en Temps Réel</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>Montant anormalement élevé</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span>Fréquence de consultation suspecte</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span>Réseau de prestataires organisé</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Documents falsifiés détectés</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {agentsSubTab === 'drill-down' && renderDrillDown()}
          </div>
        )}

        {activeTab === 'protocoles' && renderProtocolesTherapeutiques()}
        {activeTab === 'moteur' && renderMoteurRegles()}

        {activeTab === 'detection' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Détection Unifiée</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl text-gray-400 mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Upload de Documents</h3>
              <p className="text-gray-500 mb-4">Glissez-déposez vos fichiers ou cliquez pour sélectionner</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                Sélectionner des fichiers
              </button>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Base de Données - Gestion des Assurés</h2>
            
            {/* Onglets de la base de données */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button 
                  onClick={() => setDatabaseSubTab('dossiers')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    databaseSubTab === 'dossiers' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dossiers de Fraude
                </button>
                <button 
                  onClick={() => setDatabaseSubTab('assures')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    databaseSubTab === 'assures' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gestion des Assurés
                </button>
                <button 
                  onClick={() => setDatabaseSubTab('beneficiaires')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    databaseSubTab === 'beneficiaires' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bénéficiaires
                </button>
                <button 
                  onClick={() => setDatabaseSubTab('recherche-similaires')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    databaseSubTab === 'recherche-similaires' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recherche de Cas Similaires
                </button>
              </nav>
            </div>

            {/* Contenu des onglets */}
            {databaseSubTab === 'dossiers' && (
              <div>
                <div className="mb-4 flex space-x-4">
                  <input 
                    type="text" 
                    placeholder="Rechercher par patient, médecin, pharmacie..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Rechercher
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dossier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dossiersDetailles.map((dossier) => (
                        <tr key={dossier.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dossier.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dossier.assure.nom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dossier.montantFraude.toLocaleString()} MAD</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              dossier.statut === 'Confirmé' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {dossier.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => {
                                setSelectedCase(dossier);
                                setShowDetailModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Voir Détails
                            </button>
                            <button className="text-green-600 hover:text-green-900">Rapport</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {databaseSubTab === 'assures' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Gestion des Assurés Principaux</h3>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                    + Nouvel Assuré
                  </button>
                </div>
                
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="Rechercher par nom..."
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input 
                    type="text" 
                    placeholder="Rechercher par CIN..."
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input 
                    type="text" 
                    placeholder="N° Affiliation CNSS..."
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dossiersDetailles.map((dossier) => (
                    <div key={dossier.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{dossier.assure.nom}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dossier.statut === 'Confirmé' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {dossier.statut}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div><span className="font-medium">CIN:</span> {dossier.assure.cin}</div>
                        <div><span className="font-medium">Âge:</span> {dossier.assure.age} ans</div>
                        <div><span className="font-medium">Affiliation:</span> {dossier.assure.numeroAffiliation}</div>
                        <div><span className="font-medium">Bénéficiaires:</span> {dossier.beneficiaires?.length || 0}</div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Historique des cas</div>
                        <div className="text-sm">
                          <div className="text-red-600 font-medium">
                            {dossier.montantFraude.toLocaleString()} MAD détecté
                          </div>
                          <div className="text-gray-500">
                            Score confiance: {dossier.scoreConfiance}%
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedCase(dossier);
                            setShowDetailModal(true);
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm"
                        >
                          Voir Profil
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm">
                          Éditer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {databaseSubTab === 'beneficiaires' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Gestion des Bénéficiaires</h3>
                  <div className="mb-4 flex space-x-4">
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom de bénéficiaire..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="">Toutes les relations</option>
                      <option value="Épouse">Épouse</option>
                      <option value="Fils">Fils</option>
                      <option value="Fille">Fille</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bénéficiaire</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assuré Principal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cas Impliqués</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dossiersDetailles.flatMap(dossier => 
                        dossier.beneficiaires?.map(beneficiaire => ({
                          ...beneficiaire,
                          assurePrincipal: dossier.assure.nom,
                          dossierId: dossier.id,
                          montantImplique: dossier.decompositionMontant?.parBeneficiaire?.[beneficiaire.nom] || 0
                        })) || []
                      ).map((beneficiaire, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{beneficiaire.nom}</div>
                            <div className="text-sm text-gray-500">CIN: {beneficiaire.cin}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiaire.assurePrincipal}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiaire.relation}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{beneficiaire.age} ans</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{beneficiaire.dossierId}</div>
                            <div className="text-sm text-red-600">{beneficiaire.montantImplique?.toLocaleString()} MAD</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Voir Historique</button>
                            <button className="text-green-600 hover:text-green-900">Éditer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {databaseSubTab === 'recherche-similaires' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recherche de Cas Similaires</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="text-blue-600 mr-3">ℹ️</div>
                      <div>
                        <div className="font-medium text-blue-800">Recherche Intelligente</div>
                        <div className="text-blue-700 text-sm">Utilisez l'IA pour identifier des patterns de fraude similaires basés sur les montants, prestataires, et comportements.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Critères de Recherche</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Type de Fraude</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="">Tous les types</option>
                          <option value="Fraudes de santé">Fraudes de santé</option>
                          <option value="Fraudes documentaires">Fraudes documentaires</option>
                          <option value="Fraudes d'identité">Fraudes d'identité</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Montant (MAD)</label>
                        <div className="flex space-x-2">
                          <input type="number" placeholder="Min" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                          <input type="number" placeholder="Max" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Score de Confiance (%)</label>
                        <input type="range" min="0" max="100" className="w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Recherche par Similarité</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Dossier de Référence</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="">Sélectionner un dossier</option>
                          {dossiersDetailles.map(dossier => (
                            <option key={dossier.id} value={dossier.id}>
                              {dossier.id} - {dossier.assure.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Critères de Similarité</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Prestataires similaires</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Montants comparables</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Profil démographique</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Période temporelle</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    🔍 Rechercher Cas Similaires
                  </button>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg">
                    🤖 Analyse IA Avancée
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">🔍 Résultats de la Recherche IA</h4>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          5 cas similaires trouvés
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Confiance: 87.3%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-blue-600">🤖</span>
                        <span className="font-medium text-blue-800">Analyse IA Avancée</span>
                      </div>
                      <div className="text-sm text-blue-700">
                        L'algorithme a identifié un pattern récurrent impliquant des prestataires de la région de Casablanca 
                        avec des montants similaires et des profils de prescription suspects. Réseau organisé probable.
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div>
                              <div className="font-semibold text-gray-800">Dossier FR003 - Youssef Bennani</div>
                              <div className="text-sm text-gray-600">CIN: BK345789 | Similarité: 94.2%</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">16,850 MAD</div>
                            <div className="text-sm text-gray-500">Score: 91.5%</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Prestataires communs</div>
                            <div className="text-gray-600">Dr. Hassan Alami, Pharmacie Al Baraka</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Période</div>
                            <div className="text-gray-600">Janvier 2024 (+2 jours)</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Type fraude</div>
                            <div className="text-gray-600">Fraudes de santé</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Même réseau</span>
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Montant similaire</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir détails →
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div>
                              <div className="font-semibold text-gray-800">Dossier FR004 - Latifa Amrani</div>
                              <div className="text-sm text-gray-600">CIN: BK456890 | Similarité: 89.7%</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">14,200 MAD</div>
                            <div className="text-sm text-gray-500">Score: 88.3%</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Prestataires communs</div>
                            <div className="text-gray-600">Pharmacie Al Baraka, Laboratoire Central</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Période</div>
                            <div className="text-gray-600">Janvier 2024 (+5 jours)</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Type fraude</div>
                            <div className="text-gray-600">Fraudes documentaires</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Prestataires liés</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Période proche</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir détails →
                          </button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                              <div className="font-semibold text-gray-800">Dossier FR005 - Rachid Tazi</div>
                              <div className="text-sm text-gray-600">CIN: BK567901 | Similarité: 76.4%</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">12,900 MAD</div>
                            <div className="text-sm text-gray-500">Score: 82.1%</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Prestataires communs</div>
                            <div className="text-gray-600">Dr. Hassan Alami</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Période</div>
                            <div className="text-gray-600">Février 2024</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">Type fraude</div>
                            <div className="text-gray-600">Fraudes de santé</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Même médecin</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Pattern similaire</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir détails →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-2">🎯 Recommandations IA</h5>
                      <div className="space-y-2 text-sm text-green-700">
                        <div className="flex items-start space-x-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>Enquête approfondie recommandée sur le réseau Dr. Hassan Alami - Pharmacie Al Baraka</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>Surveillance renforcée des nouveaux dossiers impliquant ces prestataires</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>Création d'une règle automatique pour détecter ce pattern spécifique</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                        🚨 Signaler Réseau Organisé
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        📊 Analyse Réseau Complet
                      </button>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        ⚙️ Créer Règle Auto
                      </button>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                        📄 Export Rapport
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📊 Reporting Global des Cas de Fraude</h2>
              <div className="flex space-x-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Derniers 30 jours</option>
                  <option>Derniers 3 mois</option>
                  <option>Derniers 6 mois</option>
                  <option>Dernière année</option>
                </select>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                  📄 Export Rapport
                </button>
              </div>
            </div>

            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cas Analysés</h3>
                    <div className="text-3xl font-bold text-blue-600">2,940</div>
                    <div className="text-sm text-green-600">+12% ce mois</div>
                  </div>
                  <div className="text-4xl text-blue-500">📋</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Fraudes Confirmées</h3>
                    <div className="text-3xl font-bold text-red-600">127</div>
                    <div className="text-sm text-gray-500">4.3% du total</div>
                  </div>
                  <div className="text-4xl text-red-500">🚨</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Montant Récupéré</h3>
                    <div className="text-3xl font-bold text-green-600">2.4M</div>
                    <div className="text-sm text-gray-500">MAD ce mois</div>
                  </div>
                  <div className="text-4xl text-green-500">💰</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Taux de Détection</h3>
                    <div className="text-3xl font-bold text-purple-600">94.2%</div>
                    <div className="text-sm text-green-600">+2.1% vs mois dernier</div>
                  </div>
                  <div className="text-4xl text-purple-500">🎯</div>
                </div>
              </div>
            </div>

            {/* Analyses Détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Évolution des Fraudes par Mois</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Janvier 2024</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-red-600 font-bold">89 cas</span>
                      <span className="text-green-600 text-sm">1.8M MAD</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Février 2024</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-red-600 font-bold">127 cas</span>
                      <span className="text-green-600 text-sm">2.4M MAD</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="font-medium">Mars 2024 (En cours)</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-red-600 font-bold">94 cas</span>
                      <span className="text-green-600 text-sm">1.9M MAD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🏥 Top Prestataires Impliqués</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                    <div>
                      <div className="font-medium text-red-800">Dr. Hassan Alami</div>
                      <div className="text-sm text-red-600">Cardiologie - Casablanca</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">23 cas</div>
                      <div className="text-sm text-gray-600">450K MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                    <div>
                      <div className="font-medium text-orange-800">Pharmacie Al Baraka</div>
                      <div className="text-sm text-orange-600">Pharmacie - Rabat</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">18 cas</div>
                      <div className="text-sm text-gray-600">320K MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div>
                      <div className="font-medium text-yellow-800">Laboratoire Central</div>
                      <div className="text-sm text-yellow-600">Analyses - Casablanca</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">15 cas</div>
                      <div className="text-sm text-gray-600">280K MAD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyses par Type de Fraude */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Répartition par Type de Fraude</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-3xl mb-2">🏥</div>
                  <div className="text-xl font-bold text-red-600">67</div>
                  <div className="text-sm font-medium text-red-800">Fraudes de Santé</div>
                  <div className="text-xs text-gray-600 mt-1">52.8% du total</div>
                  <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '52.8%'}}></div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-xl font-bold text-orange-600">38</div>
                  <div className="text-sm font-medium text-orange-800">Fraudes Documentaires</div>
                  <div className="text-xs text-gray-600 mt-1">29.9% du total</div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '29.9%'}}></div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl mb-2">👤</div>
                  <div className="text-xl font-bold text-yellow-600">22</div>
                  <div className="text-sm font-medium text-yellow-800">Fraudes d'Identité</div>
                  <div className="text-xs text-gray-600 mt-1">17.3% du total</div>
                  <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '17.3%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance des Agents */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🤖 Performance des Agents IA</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-12 h-12 ${agent.couleur} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-2`}>
                      {agent.icon}
                    </div>
                    <div className="font-medium text-gray-800 text-sm mb-1">{agent.nom}</div>
                    <div className="text-lg font-bold text-blue-600">{agent.casTraites}</div>
                    <div className="text-xs text-gray-500">cas traités</div>
                    <div className="text-sm font-medium text-green-600 mt-1">{agent.tauxSucces}%</div>
                    <div className="text-xs text-gray-500">précision</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyses Géographiques et Sectorielles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🗺️ Répartition par Région</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="font-medium">Casablanca-Settat</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">45 cas</div>
                      <div className="text-sm text-gray-600">890K MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="font-medium">Rabat-Salé-Kénitra</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">32 cas</div>
                      <div className="text-sm text-gray-600">650K MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="font-medium">Marrakech-Safi</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">28 cas</div>
                      <div className="text-sm text-gray-600">520K MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">Fès-Meknès</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">22 cas</div>
                      <div className="text-sm text-gray-600">380K MAD</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🏢 Répartition par Secteur</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🏥</div>
                      <span className="font-medium">Secteur Privé</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">78 cas</div>
                      <div className="text-sm text-gray-600">1.6M MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🏛️</div>
                      <span className="font-medium">Secteur Public</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">49 cas</div>
                      <div className="text-sm text-gray-600">800K MAD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyses par Prestataires */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">👨‍⚕️ Top Prestataires de Soins Impliqués</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                    <div>
                      <div className="font-medium text-red-800">Dr. Hassan Alami</div>
                      <div className="text-sm text-red-600">Cardiologie - Casablanca</div>
                      <div className="text-xs text-gray-500">Secteur Privé</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">23 cas</div>
                      <div className="text-sm text-gray-600">450K MAD</div>
                      <div className="text-xs text-red-500">Risque Élevé</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                    <div>
                      <div className="font-medium text-orange-800">Dr. Amina Tazi</div>
                      <div className="text-sm text-orange-600">Gynécologie - Rabat</div>
                      <div className="text-xs text-gray-500">Secteur Privé</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">18 cas</div>
                      <div className="text-sm text-gray-600">320K MAD</div>
                      <div className="text-xs text-orange-500">Risque Moyen</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div>
                      <div className="font-medium text-yellow-800">Dr. Youssef Bennani</div>
                      <div className="text-sm text-yellow-600">Neurologie - Casablanca</div>
                      <div className="text-xs text-gray-500">Secteur Public</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">15 cas</div>
                      <div className="text-sm text-gray-600">280K MAD</div>
                      <div className="text-xs text-yellow-500">Surveillance</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💊 Top Pharmacies Impliquées</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                    <div>
                      <div className="font-medium text-red-800">Pharmacie Al Baraka</div>
                      <div className="text-sm text-red-600">Hay Riad - Rabat</div>
                      <div className="text-xs text-gray-500">Licence: PH2024-001</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">31 cas</div>
                      <div className="text-sm text-gray-600">580K MAD</div>
                      <div className="text-xs text-red-500">Critique</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                    <div>
                      <div className="font-medium text-orange-800">Pharmacie Centrale</div>
                      <div className="text-sm text-orange-600">Centre-ville - Casablanca</div>
                      <div className="text-xs text-gray-500">Licence: PH2024-002</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">26 cas</div>
                      <div className="text-sm text-gray-600">470K MAD</div>
                      <div className="text-xs text-orange-500">Élevé</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div>
                      <div className="font-medium text-yellow-800">Pharmacie Atlas</div>
                      <div className="text-sm text-yellow-600">Gueliz - Marrakech</div>
                      <div className="text-xs text-gray-500">Licence: PH2024-003</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">19 cas</div>
                      <div className="text-sm text-gray-600">340K MAD</div>
                      <div className="text-xs text-yellow-500">Moyen</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyse par Typologie Détaillée */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Analyse Détaillée par Typologie de Fraude</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🏥</div>
                      <span className="font-bold text-red-800">Fraudes de Santé</span>
                    </div>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">67 cas</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Surfacturation médicaments:</span>
                      <span className="font-medium">34 cas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consultations fictives:</span>
                      <span className="font-medium">21 cas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analyses non réalisées:</span>
                      <span className="font-medium">12 cas</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <div className="flex justify-between font-bold text-red-700">
                      <span>Total:</span>
                      <span>1.2M MAD</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">📄</div>
                      <span className="font-bold text-orange-800">Fraudes Documentaires</span>
                    </div>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">38 cas</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Falsification ordonnances:</span>
                      <span className="font-medium">22 cas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cachets médicaux faux:</span>
                      <span className="font-medium">11 cas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signatures falsifiées:</span>
                      <span className="font-medium">5 cas</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <div className="flex justify-between font-bold text-orange-700">
                      <span>Total:</span>
                      <span>720K MAD</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">👤</div>
                      <span className="font-bold text-yellow-800">Fraudes d'Identité</span>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">22 cas</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Usurpation d'identité:</span>
                      <span className="font-medium">14 cas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cartes CNSS falsifiées:</span>
                      <span className="font-medium">6 cas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bénéficiaires fictifs:</span>
                      <span className="font-medium">2 cas</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <div className="flex justify-between font-bold text-yellow-700">
                      <span>Total:</span>
                      <span>480K MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertes et Recommandations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">⚠️ Alertes et Recommandations Système</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-red-500 text-xl mt-0.5">🚨</span>
                  <div>
                    <div className="font-medium text-red-800">Concentration géographique suspecte</div>
                    <div className="text-sm text-red-600">35% des fraudes concentrées à Casablanca-Settat. Investigation régionale recommandée.</div>
                    <button className="text-xs text-red-700 underline mt-1">Analyser région →</button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-orange-500 text-xl mt-0.5">⚠️</span>
                  <div>
                    <div className="font-medium text-orange-800">Réseau pharmacies-médecins identifié</div>
                    <div className="text-sm text-orange-600">Pharmacie Al Baraka et Dr. Hassan Alami: 18 cas communs. Coordination probable.</div>
                    <button className="text-xs text-orange-700 underline mt-1">Analyser réseau →</button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-500 text-xl mt-0.5">💡</span>
                  <div>
                    <div className="font-medium text-blue-800">Pattern sectoriel détecté</div>
                    <div className="text-sm text-blue-600">Secteur privé: 61% des fraudes. Renforcement des contrôles recommandé.</div>
                    <button className="text-xs text-blue-700 underline mt-1">Voir suggestions →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showProtocolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Nouveau Protocole Thérapeutique</h3>
              <button 
                onClick={() => setShowProtocolModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Protocole</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité Médicale</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Cardiologie</option>
                  <option>Diabétologie</option>
                  <option>Neurologie</option>
                  <option>Oncologie</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Règles du Protocole</label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Dosage</option>
                      <option>Contre-indication</option>
                      <option>Interaction</option>
                      <option>Surveillance</option>
                    </select>
                    <input type="text" placeholder="Description de la règle" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg">+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowProtocolModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Créer le Protocole
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Détails Complets - Dossier {selectedCase.id}
              </h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Informations Assuré Principal</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedCase.assure.nom}</div>
                    <div><span className="font-medium">CIN:</span> {selectedCase.assure.cin}</div>
                    <div><span className="font-medium">Âge:</span> {selectedCase.assure.age} ans</div>
                    <div><span className="font-medium">Adresse:</span> {selectedCase.assure.adresse}</div>
                    <div><span className="font-medium">N° Affiliation:</span> {selectedCase.assure.numeroAffiliation}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Bénéficiaires</h4>
                  <div className="space-y-2">
                    {selectedCase.beneficiaires?.map((beneficiaire, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded">
                        <div className="font-medium">{beneficiaire.nom}</div>
                        <div className="text-gray-600">{beneficiaire.relation} - {beneficiaire.age} ans</div>
                        <div className="text-gray-500">CIN: {beneficiaire.cin}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedCase.conformiteDocumentaire && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-700">🔍 Vérification de Conformité Documentaire</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCase.conformiteDocumentaire.scoreConformite >= 80 ? 'bg-green-100 text-green-800' :
                      selectedCase.conformiteDocumentaire.scoreConformite >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Score Global: {selectedCase.conformiteDocumentaire.scoreConformite}%
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-medium text-gray-700 mb-3">Éléments Obligatoires</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cachet médical</span>
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${selectedCase.conformiteDocumentaire.cachetMedical ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className={`text-sm font-medium ${selectedCase.conformiteDocumentaire.cachetMedical ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedCase.conformiteDocumentaire.cachetMedical ? 'Conforme' : 'Non conforme'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Signature assuré</span>
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${selectedCase.conformiteDocumentaire.signatureAssuré ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className={`text-sm font-medium ${selectedCase.conformiteDocumentaire.signatureAssuré ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedCase.conformiteDocumentaire.signatureAssuré ? 'Conforme' : 'Non conforme'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Codes barres/QR</span>
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${selectedCase.conformiteDocumentaire.codesBarres ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className={`text-sm font-medium ${selectedCase.conformiteDocumentaire.codesBarres ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedCase.conformiteDocumentaire.codesBarres ? 'Conforme' : 'Non conforme'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-medium text-gray-700 mb-3">Analyse IA Avancée</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Authenticité document</span>
                          <span className="text-sm font-medium text-green-600">98.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cohérence données</span>
                          <span className="text-sm font-medium text-yellow-600">76.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Détection falsification</span>
                          <span className="text-sm font-medium text-red-600">Suspect</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Validation croisée</span>
                          <span className="text-sm font-medium text-green-600">Validé</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-700 mb-3">Recommandations de l'Agent de Collecte</h5>
                    <div className="space-y-2">
                      {selectedCase.conformiteDocumentaire.scoreConformite < 70 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-red-500 mt-0.5">⚠️</span>
                          <span className="text-red-700">Document non conforme - Demander une nouvelle soumission avec tous les éléments requis</span>
                        </div>
                      )}
                      {!selectedCase.conformiteDocumentaire.signatureAssuré && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-orange-500 mt-0.5">📝</span>
                          <span className="text-orange-700">Signature manquante - Contacter l'assuré pour régularisation</span>
                        </div>
                      )}
                      {selectedCase.conformiteDocumentaire.scoreConformite >= 80 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-green-500 mt-0.5">✅</span>
                          <span className="text-green-700">Document conforme - Peut procéder au traitement automatique</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                      📄 Voir Documents Scannés
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                      🔄 Re-vérifier Conformité
                    </button>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
                      📧 Demander Régularisation
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-700">💰 Analyse Détaillée des Montants Frauduleux</h4>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      📊 Graphique
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                      📋 Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          🏥 Répartition par Prestataire de Soins
                        </h5>
                        <div className="space-y-3">
                          {Object.entries(selectedCase.decompositionMontant?.parPrestataire || {}).map(([prestataire, montant]) => {
                            const pourcentage = ((montant / selectedCase.montantFraude) * 100).toFixed(1);
                            return (
                              <div key={prestataire} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{prestataire}</span>
                                  <span className="text-red-600 font-bold">{montant.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Pourcentage du total</span>
                                  <span>{pourcentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full" 
                                    style={{width: `${pourcentage}%`}}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          👥 Répartition par Assuré/Bénéficiaire
                        </h5>
                        <div className="space-y-3">
                          {Object.entries(selectedCase.decompositionMontant?.parBeneficiaire || {}).map(([beneficiaire, montant]) => {
                            const pourcentage = ((montant / selectedCase.montantFraude) * 100).toFixed(1);
                            return (
                              <div key={beneficiaire} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{beneficiaire}</span>
                                  <span className="text-red-600 font-bold">{montant.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Pourcentage du total</span>
                                  <span>{pourcentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{width: `${pourcentage}%`}}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-700 mb-3">📈 Analyse Statistique</h5>
                    <div className="space-y-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{selectedCase.montantFraude.toLocaleString()}</div>
                        <div className="text-sm text-red-700">MAD Total Fraude</div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Prestataire principal:</span>
                          <span className="font-medium">
                            {Object.entries(selectedCase.decompositionMontant?.parPrestataire || {})
                              .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Montant max/prestataire:</span>
                          <span className="font-medium text-red-600">
                            {Math.max(...Object.values(selectedCase.decompositionMontant?.parPrestataire || {})).toLocaleString()} MAD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nb prestataires impliqués:</span>
                          <span className="font-medium">
                            {Object.keys(selectedCase.decompositionMontant?.parPrestataire || {}).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nb bénéficiaires:</span>
                          <span className="font-medium">
                            {Object.keys(selectedCase.decompositionMontant?.parBeneficiaire || {}).length}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">Niveau de Risque</div>
                        <div className={`px-2 py-1 rounded text-xs font-medium text-center ${
                          selectedCase.montantFraude > 10000 ? 'bg-red-100 text-red-800' :
                          selectedCase.montantFraude > 5000 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedCase.montantFraude > 10000 ? 'RISQUE ÉLEVÉ' :
                           selectedCase.montantFraude > 5000 ? 'RISQUE MOYEN' : 'RISQUE FAIBLE'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <h5 className="font-medium text-gray-700 mb-3">🔍 Analyse des Patterns de Fraude</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {(selectedCase.montantFraude / Object.keys(selectedCase.decompositionMontant?.parPrestataire || {}).length).toFixed(0)}
                      </div>
                      <div className="text-xs text-blue-700">MAD Moyen/Prestataire</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {(selectedCase.montantFraude / Object.keys(selectedCase.decompositionMontant?.parBeneficiaire || {}).length).toFixed(0)}
                      </div>
                      <div className="text-xs text-green-700">MAD Moyen/Bénéficiaire</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{selectedCase.scoreConfiance}%</div>
                      <div className="text-xs text-purple-700">Score de Confiance</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3">⚠️ Alertes et Recommandations</h5>
                  <div className="space-y-2">
                    {selectedCase.montantFraude > 10000 && (
                      <div className="flex items-start space-x-2 text-sm bg-red-50 p-2 rounded">
                        <span className="text-red-500 mt-0.5">🚨</span>
                        <span className="text-red-700">Montant élevé détecté - Déclencher investigation approfondie et notification hiérarchique</span>
                      </div>
                    )}
                    {Object.keys(selectedCase.decompositionMontant?.parPrestataire || {}).length > 2 && (
                      <div className="flex items-start space-x-2 text-sm bg-orange-50 p-2 rounded">
                        <span className="text-orange-500 mt-0.5">⚠️</span>
                        <span className="text-orange-700">Réseau de prestataires impliqués - Vérifier les connexions et coordinations suspectes</span>
                      </div>
                    )}
                    {selectedCase.scoreConfiance > 90 && (
                      <div className="flex items-start space-x-2 text-sm bg-green-50 p-2 rounded">
                        <span className="text-green-500 mt-0.5">✅</span>
                        <span className="text-green-700">Fraude confirmée avec haute confiance - Procéder aux actions de recouvrement</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-yellow-200">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                        🚨 Signaler Fraude Grave
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        📊 Analyse Comparative
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{selectedCase.montantFraude.toLocaleString()} MAD</div>
                      <div className="text-sm text-gray-600">Total Fraude Détectée</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Historique Complet du Dossier</h4>
                <div className="space-y-3">
                  {selectedCase.historique?.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white p-3 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{event.action}</span>
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <div className="text-sm text-gray-600">{event.details}</div>
                        <div className="text-xs text-blue-600">{event.agent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  🔍 Chercher Cas Similaires
                </button>
                <div className="flex space-x-3">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    📊 Rapport Global
                  </button>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
                    👤 Assigner Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour les détails des agents */}
      {showDetailModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${selectedAgent.couleur} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedAgent.nom}</h3>
                  <p className="text-sm text-gray-600">{selectedAgent.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedAgent.casTraites}</div>
                  <div className="text-sm text-gray-600">Cas traités</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedAgent.tauxSucces}%</div>
                  <div className="text-sm text-gray-600">Taux de succès</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedAgent.documentsUploades}</div>
                  <div className="text-sm text-gray-600">Documents traités</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">📁 Documents Disponibles ({selectedAgent.documentsUploades})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({length: selectedAgent.documentsUploades}, (_, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded border flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">📄</span>
                        <span className="text-sm">Document_{String(i + 1).padStart(3, '0')}.pdf</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">⚙️ Règles Métier Actives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedAgent.reglesMetier.map((regle, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                      <div className="font-medium text-sm text-gray-800 mb-1">
                        Règle #{index + 1}
                      </div>
                      <div className="text-sm text-gray-600">
                        {regle}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-green-600 font-medium">✓ Active</span>
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          Configurer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => {
                    alert(`Analyse lancée avec ${selectedAgent.nom}\n\nTraitement de ${selectedAgent.documentsUploades} documents en cours...\n\nRésultats disponibles dans quelques instants.`);
                    setShowDetailModal(false);
                  }}
                  className={`${selectedAgent.couleur} text-white px-4 py-2 rounded-lg hover:opacity-90`}
                >
                  Lancer Analyse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

