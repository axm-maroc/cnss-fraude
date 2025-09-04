import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, Search, FileText, Users, Shield, Activity } from 'lucide-react';

const InvestigationPanel = () => {
  const [casConcrets, setCasConcrets] = useState({});
  const [analyseTempReel, setAnalyseTempReel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des cas concrets
        const [prescriptionRes, reseauRes, usurpationRes] = await Promise.all([
          fetch('/api/investigation/cas-concrets/prescription_fraud'),
          fetch('/api/investigation/cas-concrets/reseau_frauduleux'),
          fetch('/api/investigation/cas-concrets/usurpation_identite')
        ]);

        const [prescription, reseau, usurpation] = await Promise.all([
          prescriptionRes.json(),
          reseauRes.json(),
          usurpationRes.json()
        ]);

        setCasConcrets({
          prescription: prescription.cas || [],
          reseau: reseau.cas || [],
          usurpation: usurpation.cas || []
        });

        // Analyse temps réel
        const analyseRes = await fetch('/api/investigation/analyse-prescription');
        const analyseData = await analyseRes.json();
        setAnalyseTempReel(analyseData.analyse);

        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement données investigation:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Mise à jour toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Validé fraude': return 'bg-red-100 text-red-800';
      case 'Investigation en cours': return 'bg-orange-100 text-orange-800';
      case 'Réseau démantelé': return 'bg-green-100 text-green-800';
      case 'Investigation active': return 'bg-blue-100 text-blue-800';
      case 'Fraude confirmée': return 'bg-red-100 text-red-800';
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
          <h2 className="text-2xl font-bold text-gray-900">Investigation Avancée</h2>
          <p className="text-gray-600">Cas concrets et analyse comportementale basés sur les meilleures pratiques internationales</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <Activity className="w-4 h-4 mr-1" />
          Investigation Active
        </Badge>
      </div>

      {/* Analyse Temps Réel */}
      {analyseTempReel && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Analyse Prescription Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Médicament</p>
                <p className="font-semibold">{analyseTempReel.medicament}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ratio Anomalie</p>
                <p className="font-semibold text-orange-600">{analyseTempReel.ratio_anomalie}x</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Score Risque</p>
                <Badge className={getScoreColor(analyseTempReel.score_risque)}>
                  {analyseTempReel.score_risque}/100
                </Badge>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Alertes Détectées:</p>
              <div className="space-y-1">
                {analyseTempReel.alertes?.map((alerte, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-1">
                    {alerte}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="prescription" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prescription">
            <FileText className="w-4 h-4 mr-2" />
            Fraude Prescription
          </TabsTrigger>
          <TabsTrigger value="reseau">
            <Users className="w-4 h-4 mr-2" />
            Réseaux Frauduleux
          </TabsTrigger>
          <TabsTrigger value="usurpation">
            <Shield className="w-4 h-4 mr-2" />
            Usurpation Identité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prescription" className="space-y-4">
          <div className="grid gap-4">
            {casConcrets.prescription?.map((cas, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cas.patient} ({cas.genre}, {cas.age} ans)</CardTitle>
                      <CardDescription>
                        Dr. {cas.medecin} ({cas.ville_medecin}) → {cas.pharmacie} ({cas.ville_pharmacie})
                      </CardDescription>
                    </div>
                    <Badge className={getStatutColor(cas.statut)}>
                      {cas.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Médicament</p>
                      <p className="font-semibold">{cas.medicament}</p>
                      <p className="text-sm text-gray-500">{cas.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantité</p>
                      <p className="font-semibold text-red-600">{cas.quantite_prescrite} (Normal: {cas.quantite_normale})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coût Mensuel</p>
                      <p className="font-semibold">{cas.cout_mensuel?.toLocaleString()} MAD</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score Risque</p>
                      <Badge className={getScoreColor(cas.score_risque)}>
                        {cas.score_risque}/100
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">Alerte:</p>
                    <p className="text-sm bg-red-50 text-red-700 p-2 rounded">{cas.alerte}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reseau" className="space-y-4">
          <div className="grid gap-4">
            {casConcrets.reseau?.map((reseau, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{reseau.nom}</CardTitle>
                      <CardDescription>
                        {reseau.medecin_principal} - {reseau.specialite} ({reseau.ville})
                      </CardDescription>
                    </div>
                    <Badge className={getStatutColor(reseau.statut)}>
                      {reseau.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Pharmacies Complices</p>
                      <p className="font-semibold">{reseau.pharmacies_complices?.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patients Fictifs</p>
                      <p className="font-semibold text-red-600">{reseau.patients_fictifs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant Fraudé</p>
                      <p className="font-semibold">{reseau.montant_fraude?.toLocaleString()} MAD</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score Risque</p>
                      <Badge className={getScoreColor(reseau.score_risque)}>
                        {reseau.score_risque}/100
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Pharmacies Impliquées:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {reseau.pharmacies_complices?.map((pharmacie, idx) => (
                          <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                            <span className="font-medium">{pharmacie.nom}</span> - {pharmacie.quartier}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pattern Détecté:</p>
                      <p className="text-sm bg-orange-50 text-orange-700 p-2 rounded">{reseau.pattern}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usurpation" className="space-y-4">
          <div className="grid gap-4">
            {casConcrets.usurpation?.map((cas, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Victime: {cas.victime} ({cas.age_victime} ans)</CardTitle>
                      <CardDescription>
                        Domicile: {cas.ville_victime} → Utilisation: {cas.lieu_utilisation}
                      </CardDescription>
                    </div>
                    <Badge className={getStatutColor(cas.statut)}>
                      {cas.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Détection</p>
                      <p className="font-semibold">{cas.detection}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Écart Temporel</p>
                      <p className="font-semibold text-red-600">{cas.ecart_temporel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant/Consultation</p>
                      <p className="font-semibold">{cas.montant_consultation?.toLocaleString()} MAD</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score Risque</p>
                      <Badge className={getScoreColor(cas.score_risque)}>
                        {cas.score_risque}/100
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Impossibilité Physique:</p>
                      <p className="text-sm bg-red-50 text-red-700 p-2 rounded">{cas.impossibilite}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Médicaments Frauduleux:</p>
                      <div className="flex flex-wrap gap-1">
                        {cas.medicaments_frauduleux?.map((med, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestigationPanel;

