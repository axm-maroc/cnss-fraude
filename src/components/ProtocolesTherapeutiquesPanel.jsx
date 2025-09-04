import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Filter,
  Settings,
  AlertTriangle,
  CheckCircle,
  Pill,
  Stethoscope,
  DollarSign,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react'

const ProtocolesTherapeutiquesPanel = () => {
  const [protocols, setProtocols] = useState([
    {
      id: 1,
      pathologie: 'Polyarthrite rhumatoïde',
      medicament: 'Humira (Adalimumab)',
      dosage: '40mg/0.8ml',
      quantiteMaxMois: 2,
      prixUnitaire: 2500,
      seuilRisque: 85,
      specialisteRequis: 'Rhumatologue',
      dureeTraitementMax: 12,
      contraindicationsAge: '> 65 ans',
      status: 'active',
      dateCreation: '2025-01-10',
      derniereMaj: '2025-01-15'
    },
    {
      id: 2,
      pathologie: 'Maladie de Crohn',
      medicament: 'Remicade (Infliximab)',
      dosage: '100mg',
      quantiteMaxMois: 1,
      prixUnitaire: 3200,
      seuilRisque: 90,
      specialisteRequis: 'Gastro-entérologue',
      dureeTraitementMax: 6,
      contraindicationsAge: '< 18 ans',
      status: 'active',
      dateCreation: '2025-01-08',
      derniereMaj: '2025-01-14'
    },
    {
      id: 3,
      pathologie: 'Psoriasis sévère',
      medicament: 'Stelara (Ustekinumab)',
      dosage: '45mg/0.5ml',
      quantiteMaxMois: 1,
      prixUnitaire: 2800,
      seuilRisque: 80,
      specialisteRequis: 'Dermatologue',
      dureeTraitementMax: 24,
      contraindicationsAge: 'Aucune',
      status: 'active',
      dateCreation: '2025-01-05',
      derniereMaj: '2025-01-12'
    },
    {
      id: 4,
      pathologie: 'Sclérose en plaques',
      medicament: 'Tysabri (Natalizumab)',
      dosage: '300mg',
      quantiteMaxMois: 1,
      prixUnitaire: 4500,
      seuilRisque: 95,
      specialisteRequis: 'Neurologue',
      dureeTraitementMax: 36,
      contraindicationsAge: '> 70 ans',
      status: 'active',
      dateCreation: '2025-01-03',
      derniereMaj: '2025-01-10'
    },
    {
      id: 5,
      pathologie: 'Cancer du sein',
      medicament: 'Herceptin (Trastuzumab)',
      dosage: '440mg',
      quantiteMaxMois: 3,
      prixUnitaire: 3800,
      seuilRisque: 88,
      specialisteRequis: 'Oncologue',
      dureeTraitementMax: 12,
      contraindicationsAge: 'Aucune',
      status: 'active',
      dateCreation: '2025-01-01',
      derniereMaj: '2025-01-08'
    },
    {
      id: 6,
      pathologie: 'Hépatite C chronique',
      medicament: 'Sovaldi (Sofosbuvir)',
      dosage: '400mg',
      quantiteMaxMois: 30,
      prixUnitaire: 150,
      seuilRisque: 75,
      specialisteRequis: 'Hépatologue',
      dureeTraitementMax: 3,
      contraindicationsAge: '< 12 ans',
      status: 'active',
      dateCreation: '2024-12-28',
      derniereMaj: '2025-01-05'
    }
  ])

  const [editingProtocol, setEditingProtocol] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newProtocol, setNewProtocol] = useState({
    pathologie: '',
    medicament: '',
    dosage: '',
    quantiteMaxMois: '',
    prixUnitaire: '',
    seuilRisque: '',
    specialisteRequis: '',
    dureeTraitementMax: '',
    contraindicationsAge: '',
    status: 'active'
  })

  const handleEdit = (protocol) => {
    setEditingProtocol({ ...protocol })
  }

  const handleSave = (protocolId) => {
    setProtocols(prev => prev.map(p => 
      p.id === protocolId 
        ? { ...editingProtocol, derniereMaj: new Date().toISOString().split('T')[0] }
        : p
    ))
    setEditingProtocol(null)
  }

  const handleDelete = (protocolId) => {
    setProtocols(prev => prev.filter(p => p.id !== protocolId))
  }

  const handleAdd = () => {
    const id = Math.max(...protocols.map(p => p.id)) + 1
    const today = new Date().toISOString().split('T')[0]
    setProtocols(prev => [...prev, {
      ...newProtocol,
      id,
      quantiteMaxMois: parseInt(newProtocol.quantiteMaxMois),
      prixUnitaire: parseFloat(newProtocol.prixUnitaire),
      seuilRisque: parseInt(newProtocol.seuilRisque),
      dureeTraitementMax: parseInt(newProtocol.dureeTraitementMax),
      dateCreation: today,
      derniereMaj: today
    }])
    setNewProtocol({
      pathologie: '',
      medicament: '',
      dosage: '',
      quantiteMaxMois: '',
      prixUnitaire: '',
      seuilRisque: '',
      specialisteRequis: '',
      dureeTraitementMax: '',
      contraindicationsAge: '',
      status: 'active'
    })
    setShowAddForm(false)
  }

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.pathologie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.medicament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.specialisteRequis.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || protocol.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getSeuilColor = (seuil) => {
    if (seuil >= 90) return 'text-red-600 bg-red-100'
    if (seuil >= 80) return 'text-orange-600 bg-orange-100'
    if (seuil >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getPrixColor = (prix) => {
    if (prix >= 4000) return 'text-red-600'
    if (prix >= 2500) return 'text-orange-600'
    if (prix >= 1000) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Protocoles Thérapeutiques</h2>
          <p className="text-slate-600">Configuration des protocoles de traitement et seuils de détection</p>
        </div>
        <div className="flex space-x-2">
          <Badge className="bg-blue-100 text-blue-800">
            <Pill className="w-4 h-4 mr-1" />
            {protocols.length} Protocoles
          </Badge>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Protocole
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{protocols.length}</div>
                <div className="text-sm text-slate-600">Total Protocoles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{protocols.filter(p => p.status === 'active').length}</div>
                <div className="text-sm text-slate-600">Actifs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{protocols.filter(p => p.seuilRisque >= 90).length}</div>
                <div className="text-sm text-slate-600">Risque Élevé</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(protocols.reduce((sum, p) => sum + p.prixUnitaire, 0) / protocols.length).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Prix Moyen (MAD)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Rechercher par pathologie, médicament ou spécialiste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Nouveau Protocole Thérapeutique</span>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Pathologie"
                value={newProtocol.pathologie}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, pathologie: e.target.value }))}
              />
              <Input
                placeholder="Médicament"
                value={newProtocol.medicament}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, medicament: e.target.value }))}
              />
              <Input
                placeholder="Dosage"
                value={newProtocol.dosage}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, dosage: e.target.value }))}
              />
              <Input
                placeholder="Quantité max/mois"
                type="number"
                value={newProtocol.quantiteMaxMois}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, quantiteMaxMois: e.target.value }))}
              />
              <Input
                placeholder="Prix unitaire (MAD)"
                type="number"
                value={newProtocol.prixUnitaire}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, prixUnitaire: e.target.value }))}
              />
              <Input
                placeholder="Seuil risque (%)"
                type="number"
                value={newProtocol.seuilRisque}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, seuilRisque: e.target.value }))}
              />
              <Input
                placeholder="Spécialiste requis"
                value={newProtocol.specialisteRequis}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, specialisteRequis: e.target.value }))}
              />
              <Input
                placeholder="Durée max (mois)"
                type="number"
                value={newProtocol.dureeTraitementMax}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, dureeTraitementMax: e.target.value }))}
              />
              <Input
                placeholder="Contre-indications âge"
                value={newProtocol.contraindicationsAge}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, contraindicationsAge: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAdd}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des protocoles */}
      <div className="space-y-4">
        {filteredProtocols.map((protocol) => (
          <Card key={protocol.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {editingProtocol && editingProtocol.id === protocol.id ? (
                // Mode édition
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      value={editingProtocol.pathologie}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, pathologie: e.target.value }))}
                    />
                    <Input
                      value={editingProtocol.medicament}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, medicament: e.target.value }))}
                    />
                    <Input
                      value={editingProtocol.dosage}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, dosage: e.target.value }))}
                    />
                    <Input
                      type="number"
                      value={editingProtocol.quantiteMaxMois}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, quantiteMaxMois: parseInt(e.target.value) }))}
                    />
                    <Input
                      type="number"
                      value={editingProtocol.prixUnitaire}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, prixUnitaire: parseFloat(e.target.value) }))}
                    />
                    <Input
                      type="number"
                      value={editingProtocol.seuilRisque}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, seuilRisque: parseInt(e.target.value) }))}
                    />
                    <Input
                      value={editingProtocol.specialisteRequis}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, specialisteRequis: e.target.value }))}
                    />
                    <Input
                      type="number"
                      value={editingProtocol.dureeTraitementMax}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, dureeTraitementMax: parseInt(e.target.value) }))}
                    />
                    <Input
                      value={editingProtocol.contraindicationsAge}
                      onChange={(e) => setEditingProtocol(prev => ({ ...prev, contraindicationsAge: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingProtocol(null)}>
                      Annuler
                    </Button>
                    <Button onClick={() => handleSave(protocol.id)}>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{protocol.pathologie}</h3>
                      <p className="text-slate-600">{protocol.medicament} - {protocol.dosage}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeuilColor(protocol.seuilRisque)}>
                        Risque: {protocol.seuilRisque}%
                      </Badge>
                      <Badge variant={protocol.status === 'active' ? 'default' : 'secondary'}>
                        {protocol.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(protocol)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(protocol.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-600">Max/mois:</span>
                      <span className="font-semibold">{protocol.quantiteMaxMois}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-slate-600">Prix:</span>
                      <span className={`font-semibold ${getPrixColor(protocol.prixUnitaire)}`}>
                        {protocol.prixUnitaire.toLocaleString()} MAD
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-600">Spécialiste:</span>
                      <span className="font-semibold">{protocol.specialisteRequis}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <span className="text-slate-600">Durée max:</span>
                      <span className="font-semibold">{protocol.dureeTraitementMax} mois</span>
                    </div>
                  </div>

                  {protocol.contraindicationsAge !== 'Aucune' && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-800">
                          Contre-indications: {protocol.contraindicationsAge}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-slate-500">
                    Créé le {protocol.dateCreation} • Dernière MAJ: {protocol.derniereMaj}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProtocols.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Pill className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun protocole trouvé</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? 'Aucun protocole ne correspond à votre recherche.' : 'Commencez par ajouter un nouveau protocole thérapeutique.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un protocole
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProtocolesTherapeutiquesPanel

