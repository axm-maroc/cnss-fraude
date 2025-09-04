from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random
import json

investigation_bp = Blueprint('investigation', __name__)

# Données test basées sur les meilleures pratiques internationales
class InvestigationEngine:
    def __init__(self):
        self.cas_concrets = {
            "prescription_fraud": [
                {
                    "id": "PRES_001",
                    "patient": "Amina BENALI",
                    "age": 45,
                    "genre": "F",
                    "medecin": "Dr. Ahmed TAZI",
                    "ville_medecin": "Marrakech",
                    "pharmacie": "Al Andalous",
                    "ville_pharmacie": "Casablanca",
                    "medicament": "Humira (Adalimumab)",
                    "dosage": "40mg",
                    "quantite_prescrite": 12,
                    "quantite_normale": 3,
                    "cout_mensuel": 18000,
                    "periode": "6 mois",
                    "alerte": "Volume 300% supérieur à la normale",
                    "score_risque": 95,
                    "statut": "Investigation en cours"
                },
                {
                    "id": "PRES_002", 
                    "patient": "Youssef IDRISSI",
                    "age": 28,
                    "genre": "M",
                    "medecin": "Dr. Fatima ALAOUI",
                    "ville_medecin": "Marrakech",
                    "pharmacie": "Ibn Sina",
                    "ville_pharmacie": "Casablanca",
                    "medicament": "Finastéride",
                    "dosage": "5mg",
                    "quantite_prescrite": 90,
                    "quantite_normale": 30,
                    "cout_mensuel": 2400,
                    "periode": "3 mois",
                    "alerte": "Prescription excessive pour l'âge",
                    "score_risque": 78,
                    "statut": "Validé fraude"
                },
                {
                    "id": "PRES_003",
                    "patient": "Khadija BENNANI",
                    "age": 67,
                    "genre": "F", 
                    "medecin": "Dr. Mohamed TAZI",
                    "ville_medecin": "Marrakech",
                    "pharmacie": "Centrale",
                    "ville_pharmacie": "Casablanca",
                    "medicament": "Contraceptifs oraux",
                    "dosage": "21 comprimés",
                    "quantite_prescrite": 6,
                    "quantite_normale": 0,
                    "cout_mensuel": 180,
                    "periode": "2 mois",
                    "alerte": "Prescription post-ménopause incohérente",
                    "score_risque": 88,
                    "statut": "Investigation en cours"
                }
            ],
            "reseau_frauduleux": [
                {
                    "id": "RES_001",
                    "nom": "Réseau Cardiovasculaire Casa-Marrakech",
                    "medecin_principal": "Dr. Mohamed ALAMI",
                    "specialite": "Cardiologue",
                    "ville": "Marrakech",
                    "pharmacies_complices": [
                        {"nom": "Al Andalous", "ville": "Casablanca", "quartier": "Maarif"},
                        {"nom": "Centrale", "ville": "Casablanca", "quartier": "Centre-ville"},
                        {"nom": "Ibn Sina", "ville": "Casablanca", "quartier": "Hay Hassani"},
                        {"nom": "Al Farabi", "ville": "Casablanca", "quartier": "Ain Chock"},
                        {"nom": "Avicenne", "ville": "Casablanca", "quartier": "Sidi Bernoussi"}
                    ],
                    "patients_fictifs": 47,
                    "periode_activite": "6 mois",
                    "montant_fraude": 2300000,
                    "medicaments_cibles": ["Clopidogrel", "Atorvastatine", "Ramipril", "Bisoprolol"],
                    "pattern": "Prescriptions groupées fin de mois",
                    "score_risque": 98,
                    "statut": "Réseau démantelé"
                },
                {
                    "id": "RES_002",
                    "nom": "Réseau Psychotropes Casa",
                    "medecin_principal": "Dr. Aicha BENNANI",
                    "specialite": "Psychiatre",
                    "ville": "Casablanca",
                    "pharmacies_complices": [
                        {"nom": "Al Madina", "ville": "Casablanca", "quartier": "Maarif"},
                        {"nom": "Atlas", "ville": "Casablanca", "quartier": "Sidi Maarouf"}
                    ],
                    "patients_fictifs": 23,
                    "periode_activite": "4 mois",
                    "montant_fraude": 890000,
                    "medicaments_cibles": ["Alprazolam", "Zolpidem", "Lorazépam"],
                    "pattern": "Ordonnances falsifiées week-end",
                    "score_risque": 92,
                    "statut": "Investigation active"
                }
            ],
            "usurpation_identite": [
                {
                    "id": "USU_001",
                    "victime": "Hassan IDRISSI",
                    "age_victime": 62,
                    "ville_victime": "Rabat",
                    "lieu_utilisation": "Casablanca",
                    "detection": "Consultation simultanée 2 villes",
                    "ecart_temporel": "15 minutes",
                    "impossibilite": "Distance 87km - impossible physiquement",
                    "medicaments_frauduleux": ["Metformine", "Amlodipine", "Atorvastatine"],
                    "montant_consultation": 3500,
                    "nombre_utilisations": 8,
                    "periode": "2 mois",
                    "score_risque": 96,
                    "statut": "Fraude confirmée"
                },
                {
                    "id": "USU_002",
                    "victime": "Fatima ZAHRA",
                    "age_victime": 34,
                    "ville_victime": "Fès",
                    "lieu_utilisation": "Marrakech",
                    "detection": "Profil consommation incohérent",
                    "anomalie": "Médicaments gériatriques pour jeune adulte",
                    "medicaments_frauduleux": ["Donépézil", "Rivastigmine"],
                    "montant_consultation": 2800,
                    "nombre_utilisations": 5,
                    "periode": "1 mois",
                    "score_risque": 89,
                    "statut": "Investigation en cours"
                }
            ]
        }
        
        self.workflows_investigation = {
            "prescription_fraud": {
                "etapes": [
                    "Détection automatique anomalie",
                    "Analyse pattern prescription",
                    "Vérification croisée médecin-pharmacie",
                    "Contrôle terrain si nécessaire",
                    "Rapport d'investigation",
                    "Décision sanctions"
                ],
                "duree_moyenne": "15 jours",
                "taux_confirmation": "78%"
            },
            "reseau_frauduleux": {
                "etapes": [
                    "Identification liens suspects",
                    "Cartographie réseau complet",
                    "Surveillance coordonnée",
                    "Collecte preuves multiples",
                    "Intervention simultanée",
                    "Procédures judiciaires"
                ],
                "duree_moyenne": "45 jours",
                "taux_confirmation": "92%"
            },
            "usurpation_identite": {
                "etapes": [
                    "Alerte géolocalisation",
                    "Vérification identité victime",
                    "Blocage carte temporaire",
                    "Investigation utilisation frauduleuse",
                    "Restitution droits victime",
                    "Poursuite usurpateur"
                ],
                "duree_moyenne": "7 jours",
                "taux_confirmation": "95%"
            }
        }

investigation_engine = InvestigationEngine()

@investigation_bp.route('/cas-concrets/<type_fraude>')
def get_cas_concrets(type_fraude):
    """Récupère les cas concrets par type de fraude"""
    if type_fraude in investigation_engine.cas_concrets:
        return jsonify({
            "success": True,
            "type": type_fraude,
            "cas": investigation_engine.cas_concrets[type_fraude],
            "total": len(investigation_engine.cas_concrets[type_fraude])
        })
    return jsonify({"success": False, "error": "Type de fraude non trouvé"})

@investigation_bp.route('/workflow/<type_fraude>')
def get_workflow(type_fraude):
    """Récupère le workflow d'investigation par type"""
    if type_fraude in investigation_engine.workflows_investigation:
        return jsonify({
            "success": True,
            "type": type_fraude,
            "workflow": investigation_engine.workflows_investigation[type_fraude]
        })
    return jsonify({"success": False, "error": "Workflow non trouvé"})

@investigation_bp.route('/analyse-prescription')
def analyse_prescription():
    """Analyse une prescription pour détection de fraude"""
    # Simulation d'analyse en temps réel
    analyse = {
        "patient": "Simulation temps réel",
        "medicament": "Adalimumab (Humira)",
        "quantite_demandee": 8,
        "quantite_normale": 2,
        "ratio_anomalie": 4.0,
        "cout_mensuel": 12000,
        "alertes": [
            "Volume 300% supérieur à la normale",
            "Médicament onéreux - surveillance renforcée",
            "Pattern répétitif détecté"
        ],
        "score_risque": 87,
        "recommandation": "Investigation immédiate",
        "actions_suggerees": [
            "Contrôle terrain médecin prescripteur",
            "Vérification dossier médical patient",
            "Audit pharmacie dispensatrice"
        ]
    }
    return jsonify({"success": True, "analyse": analyse})

@investigation_bp.route('/detection-reseau')
def detection_reseau():
    """Détection de réseau frauduleux en temps réel"""
    reseau = {
        "alerte": "Réseau suspect détecté",
        "medecin_central": "Dr. Youssef BENALI",
        "specialite": "Généraliste",
        "pharmacies_liees": 4,
        "patients_communs": 23,
        "periode_observation": "30 jours",
        "montant_suspect": 450000,
        "pattern_detecte": "Prescriptions groupées vendredi soir",
        "score_reseau": 82,
        "niveau_alerte": "Élevé",
        "actions_immediates": [
            "Surveillance renforcée",
            "Blocage prescriptions suspectes",
            "Notification équipe investigation"
        ]
    }
    return jsonify({"success": True, "reseau": reseau})

@investigation_bp.route('/usurpation-check')
def usurpation_check():
    """Vérification usurpation d'identité"""
    verification = {
        "carte_utilisee": "123456789",
        "nom_carte": "Ahmed BENALI",
        "lieu_utilisation_1": "Rabat - 14h23",
        "lieu_utilisation_2": "Casablanca - 14h31",
        "ecart_temporel": "8 minutes",
        "distance": "87 km",
        "impossibilite_physique": True,
        "score_usurpation": 98,
        "action_automatique": "Blocage carte immédiat",
        "notification_victime": "SMS envoyé",
        "investigation_lancee": True
    }
    return jsonify({"success": True, "verification": verification})

@investigation_bp.route('/medicaments-genre')
def medicaments_par_genre():
    """Analyse des médicaments par genre avec patterns suspects"""
    analyse_genre = {
        "homme": {
            "medicaments_surveilles": [
                {"nom": "Finastéride", "indication": "Calvitie", "alerte": "Prescription excessive jeunes"},
                {"nom": "Sildénafil", "indication": "Dysfonction érectile", "alerte": "Volume anormal"},
                {"nom": "Testostérone", "indication": "Substitution hormonale", "alerte": "Âge incohérent"}
            ],
            "cas_suspects_detectes": 12,
            "montant_fraude_estime": 89000
        },
        "femme": {
            "medicaments_surveilles": [
                {"nom": "Contraceptifs", "indication": "Contraception", "alerte": "Prescription post-ménopause"},
                {"nom": "Clomifène", "indication": "Fertilité", "alerte": "Âge incompatible"},
                {"nom": "Raloxifène", "indication": "Ostéoporose", "alerte": "Prescription précoce"}
            ],
            "cas_suspects_detectes": 8,
            "montant_fraude_estime": 34000
        },
        "mixte_surveillance": [
            {"nom": "Antidépresseurs", "alerte": "Poly-prescription"},
            {"nom": "Anxiolytiques", "alerte": "Dosages excessifs"},
            {"nom": "Antalgiques opiacés", "alerte": "Risque dépendance"}
        ]
    }
    return jsonify({"success": True, "analyse": analyse_genre})

@investigation_bp.route('/molecules-periode')
def analyse_molecules_periode():
    """Analyse des molécules identiques sur période définie"""
    analyse = {
        "periode": "30 derniers jours",
        "molecule": "Adalimumab (Humira)",
        "prescriptions_totales": 156,
        "prescriptions_normales": 98,
        "prescriptions_suspectes": 58,
        "taux_anomalie": "37%",
        "patterns_detectes": [
            "Concentration fin de mois (45% des prescriptions)",
            "Même médecin pour 23 prescriptions",
            "3 pharmacies récurrentes",
            "Patients sans historique médical"
        ],
        "repartition_geographique": {
            "Casablanca": 34,
            "Rabat": 12,
            "Marrakech": 8,
            "Fès": 4
        },
        "cout_total": 2340000,
        "cout_suspect": 870000,
        "economie_potentielle": 870000
    }
    return jsonify({"success": True, "analyse": analyse})

