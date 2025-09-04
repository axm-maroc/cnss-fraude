from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random
import json

drill_down_bp = Blueprint('drill_down', __name__)

class DrillDownEngine:
    def __init__(self):
        # Données simulées pour les KPIs avec drill-down
        self.kpi_data = {
            "taux_detection": {
                "valeur_actuelle": 90,
                "objectif": 90,
                "tendance": "+25%",
                "total_dossiers": 15847,
                "dossiers_detectes": 14262,
                "dossiers_par_statut": {
                    "fraude_confirmee": 12456,
                    "investigation_en_cours": 1234,
                    "faux_positif": 572
                }
            },
            "faux_positifs": {
                "valeur_actuelle": 12,
                "objectif": 15,
                "tendance": "-8%",
                "total_alertes": 14262,
                "faux_positifs": 1711,
                "vrais_positifs": 12551
            },
            "transactions_min": {
                "valeur_actuelle": 10000,
                "capacite_max": 12000,
                "tendance": "+15%",
                "transactions_24h": 14400000,
                "pic_horaire": 11500,
                "creux_horaire": 3200
            },
            "montant_detecte": {
                "valeur_actuelle": 300000000,
                "objectif": 250000000,
                "tendance": "+180M",
                "montant_recupere": 285000000,
                "montant_en_cours": 15000000,
                "economie_annuelle": 450000000
            }
        }
        
        # Dossiers détaillés pour chaque KPI
        self.dossiers_detection = [
            {
                "id": "DET_001",
                "patient": "Amina BENALI",
                "medecin": "Dr. Ahmed TAZI",
                "pharmacie": "Al Andalous",
                "date_detection": "2025-01-15",
                "score_risque": 95,
                "montant": 18000,
                "statut": "Fraude confirmée",
                "type_fraude": "Prescription excessive",
                "documents": ["ordonnance_001.pdf", "rapport_medical_001.pdf", "facture_001.pdf"]
            },
            {
                "id": "DET_002", 
                "patient": "Hassan IDRISSI",
                "medecin": "Dr. Fatima ALAOUI",
                "pharmacie": "Ibn Sina",
                "date_detection": "2025-01-14",
                "score_risque": 87,
                "montant": 12500,
                "statut": "Investigation en cours",
                "type_fraude": "Réseau suspect",
                "documents": ["ordonnance_002.pdf", "analyse_reseau_002.pdf"]
            },
            {
                "id": "DET_003",
                "patient": "Khadija BENNANI", 
                "medecin": "Dr. Mohamed TAZI",
                "pharmacie": "Centrale",
                "date_detection": "2025-01-13",
                "score_risque": 78,
                "montant": 8900,
                "statut": "Fraude confirmée",
                "type_fraude": "Usurpation identité",
                "documents": ["carte_identite_003.pdf", "ordonnance_003.pdf", "rapport_enquete_003.pdf"]
            }
        ]
        
        self.dossiers_faux_positifs = [
            {
                "id": "FP_001",
                "patient": "Youssef ALAMI",
                "medecin": "Dr. Aicha BENNANI",
                "pharmacie": "Al Farabi",
                "date_alerte": "2025-01-12",
                "score_initial": 72,
                "montant": 3400,
                "raison_faux_positif": "Pathologie rare justifiée",
                "temps_resolution": "2 heures",
                "documents": ["ordonnance_fp001.pdf", "dossier_medical_fp001.pdf", "justification_fp001.pdf"]
            },
            {
                "id": "FP_002",
                "patient": "Fatima ZAHRA",
                "medecin": "Dr. Omar BENALI",
                "pharmacie": "Avicenne", 
                "date_alerte": "2025-01-11",
                "score_initial": 68,
                "montant": 2800,
                "raison_faux_positif": "Prescription urgente validée",
                "temps_resolution": "1.5 heures",
                "documents": ["ordonnance_fp002.pdf", "urgence_fp002.pdf"]
            }
        ]
        
        self.transactions_detail = [
            {
                "id": "TXN_001",
                "timestamp": "2025-01-15 14:23:45",
                "patient": "Ahmed BENALI",
                "montant": 450,
                "pharmacie": "Al Andalous",
                "statut": "Validée",
                "temps_traitement": "0.8s",
                "score_risque": 15,
                "documents": ["transaction_001.pdf", "recu_001.pdf"]
            },
            {
                "id": "TXN_002",
                "timestamp": "2025-01-15 14:23:47",
                "patient": "Malika IDRISSI",
                "montant": 1200,
                "pharmacie": "Ibn Sina",
                "statut": "Alerte générée",
                "temps_traitement": "2.3s",
                "score_risque": 78,
                "documents": ["transaction_002.pdf", "alerte_002.pdf"]
            }
        ]
        
        self.montants_detail = [
            {
                "id": "MON_001",
                "type": "Fraude détectée",
                "montant": 2300000,
                "periode": "Janvier 2025",
                "nombre_cas": 47,
                "statut": "Récupéré",
                "methode_recuperation": "Remboursement direct",
                "documents": ["rapport_recuperation_001.pdf", "decision_001.pdf"]
            },
            {
                "id": "MON_002",
                "type": "Économie réalisée",
                "montant": 4500000,
                "periode": "Janvier 2025", 
                "nombre_cas": 89,
                "statut": "Confirmé",
                "methode_recuperation": "Prévention",
                "documents": ["rapport_economie_002.pdf", "analyse_impact_002.pdf"]
            }
        ]

drill_down_engine = DrillDownEngine()

@drill_down_bp.route('/kpi/<kpi_type>')
def get_kpi_detail(kpi_type):
    """Récupère les détails d'un KPI avec possibilité de drill-down"""
    if kpi_type in drill_down_engine.kpi_data:
        return jsonify({
            "success": True,
            "kpi": kpi_type,
            "data": drill_down_engine.kpi_data[kpi_type]
        })
    return jsonify({"success": False, "error": "KPI non trouvé"})

@drill_down_bp.route('/dossiers/<kpi_type>')
def get_dossiers_by_kpi(kpi_type):
    """Récupère la liste des dossiers pour un KPI donné"""
    dossiers = []
    
    if kpi_type == "taux_detection":
        dossiers = drill_down_engine.dossiers_detection
    elif kpi_type == "faux_positifs":
        dossiers = drill_down_engine.dossiers_faux_positifs
    elif kpi_type == "transactions_min":
        dossiers = drill_down_engine.transactions_detail
    elif kpi_type == "montant_detecte":
        dossiers = drill_down_engine.montants_detail
    
    return jsonify({
        "success": True,
        "kpi": kpi_type,
        "total_dossiers": len(dossiers),
        "dossiers": dossiers
    })

@drill_down_bp.route('/dossier/<dossier_id>')
def get_dossier_detail(dossier_id):
    """Récupère les détails complets d'un dossier"""
    # Recherche dans tous les types de dossiers
    all_dossiers = (
        drill_down_engine.dossiers_detection + 
        drill_down_engine.dossiers_faux_positifs +
        drill_down_engine.transactions_detail +
        drill_down_engine.montants_detail
    )
    
    dossier = next((d for d in all_dossiers if d["id"] == dossier_id), None)
    
    if dossier:
        # Enrichissement avec données supplémentaires
        dossier_enrichi = {
            **dossier,
            "historique": [
                {
                    "date": "2025-01-15 10:30:00",
                    "action": "Dossier créé",
                    "utilisateur": "Système AXM",
                    "details": "Détection automatique"
                },
                {
                    "date": "2025-01-15 10:31:15",
                    "action": "Analyse comportementale",
                    "utilisateur": "Agent Comportemental",
                    "details": f"Score calculé: {dossier.get('score_risque', 'N/A')}"
                },
                {
                    "date": "2025-01-15 10:35:22",
                    "action": "Investigation assignée",
                    "utilisateur": "Sarah BENALI",
                    "details": "Enquêteur spécialisé assigné"
                }
            ],
            "actions_disponibles": [
                "Voir documents",
                "Exporter dossier",
                "Assigner enquêteur",
                "Marquer comme traité",
                "Générer rapport"
            ]
        }
        
        return jsonify({
            "success": True,
            "dossier": dossier_enrichi
        })
    
    return jsonify({"success": False, "error": "Dossier non trouvé"})

@drill_down_bp.route('/document/<dossier_id>/<document_name>')
def get_document_scan(dossier_id, document_name):
    """Simule la récupération d'un scan de document"""
    # Simulation de métadonnées de document
    document_info = {
        "nom": document_name,
        "dossier_id": dossier_id,
        "type": document_name.split('_')[0],
        "taille": f"{random.randint(100, 500)} KB",
        "date_creation": "2025-01-15",
        "date_scan": "2025-01-15 10:25:00",
        "qualite_scan": "Haute",
        "pages": random.randint(1, 5),
        "format": "PDF",
        "statut_ocr": "Traité",
        "confiance_ocr": f"{random.randint(85, 98)}%",
        "url_preview": f"/api/drill-down/preview/{dossier_id}/{document_name}",
        "url_download": f"/api/drill-down/download/{dossier_id}/{document_name}",
        "metadonnees": {
            "auteur": "Dr. Ahmed TAZI" if "ordonnance" in document_name else "Système CNSS",
            "signature_numerique": True,
            "horodatage": "2025-01-15 09:15:00",
            "integrite": "Vérifiée"
        }
    }
    
    return jsonify({
        "success": True,
        "document": document_info
    })

@drill_down_bp.route('/preview/<dossier_id>/<document_name>')
def preview_document(dossier_id, document_name):
    """Génère un aperçu simulé du document"""
    # Simulation du contenu selon le type de document
    if "ordonnance" in document_name:
        contenu = {
            "type": "Ordonnance médicale",
            "medecin": "Dr. Ahmed TAZI",
            "patient": "Amina BENALI",
            "date": "2025-01-10",
            "prescriptions": [
                {"medicament": "Humira 40mg", "quantite": "12 seringues", "posologie": "1 injection/15 jours"},
                {"medicament": "Methotrexate 10mg", "quantite": "30 comprimés", "posologie": "1 cp/semaine"}
            ],
            "signature": "Signature électronique vérifiée",
            "cachet": "Ordre des Médecins - Marrakech"
        }
    elif "rapport" in document_name:
        contenu = {
            "type": "Rapport d'investigation",
            "enqueteur": "Sarah BENALI",
            "date": "2025-01-15",
            "resume": "Investigation fraude prescription médicamenteuse",
            "conclusions": [
                "Prescription excessive confirmée",
                "Complicité médecin-pharmacien établie",
                "Montant fraudé: 18 000 MAD"
            ],
            "recommandations": [
                "Exclusion médecin 6 mois",
                "Remboursement intégral",
                "Surveillance renforcée"
            ]
        }
    else:
        contenu = {
            "type": "Document administratif",
            "description": "Document de procédure CNSS",
            "statut": "Validé",
            "reference": f"DOC_{dossier_id}_{random.randint(1000, 9999)}"
        }
    
    return jsonify({
        "success": True,
        "preview": contenu,
        "scan_simule": True,
        "message": "Aperçu simulé - En production, affichage du scan réel"
    })

@drill_down_bp.route('/statistiques/<kpi_type>')
def get_statistiques_kpi(kpi_type):
    """Récupère les statistiques détaillées pour un KPI"""
    stats = {}
    
    if kpi_type == "taux_detection":
        stats = {
            "evolution_mensuelle": [
                {"mois": "Nov 2024", "taux": 65},
                {"mois": "Déc 2024", "taux": 78},
                {"mois": "Jan 2025", "taux": 90}
            ],
            "repartition_par_type": {
                "Prescription excessive": 45,
                "Réseau frauduleux": 25,
                "Usurpation identité": 20,
                "Autres": 10
            },
            "performance_agents": {
                "Agent Comportemental": 94,
                "Agent Relationnel": 87,
                "Agent Temporel": 91,
                "Agent Scoring": 89
            }
        }
    elif kpi_type == "faux_positifs":
        stats = {
            "evolution_mensuelle": [
                {"mois": "Nov 2024", "taux": 20},
                {"mois": "Déc 2024", "taux": 16},
                {"mois": "Jan 2025", "taux": 12}
            ],
            "causes_principales": {
                "Pathologie rare": 35,
                "Prescription urgente": 25,
                "Erreur saisie": 20,
                "Cas complexe": 20
            },
            "temps_resolution": {
                "< 1h": 45,
                "1-4h": 35,
                "4-24h": 15,
                "> 24h": 5
            }
        }
    
    return jsonify({
        "success": True,
        "kpi": kpi_type,
        "statistiques": stats
    })

@drill_down_bp.route('/export/<kpi_type>')
def export_donnees(kpi_type):
    """Simule l'export des données pour un KPI"""
    export_info = {
        "kpi": kpi_type,
        "date_export": datetime.now().isoformat(),
        "format": "Excel",
        "taille_estimee": f"{random.randint(500, 2000)} KB",
        "nombre_lignes": random.randint(1000, 5000),
        "colonnes": [
            "ID Dossier",
            "Date",
            "Patient",
            "Médecin",
            "Pharmacie",
            "Montant",
            "Score Risque",
            "Statut",
            "Type Fraude"
        ],
        "url_download": f"/api/drill-down/download-export/{kpi_type}",
        "expiration": "24 heures"
    }
    
    return jsonify({
        "success": True,
        "export": export_info
    })

@drill_down_bp.route('/recherche')
def recherche_dossiers():
    """Recherche avancée dans les dossiers"""
    query = request.args.get('q', '')
    type_dossier = request.args.get('type', 'all')
    date_debut = request.args.get('date_debut', '')
    date_fin = request.args.get('date_fin', '')
    
    # Simulation de résultats de recherche
    resultats = [
        {
            "id": "DET_001",
            "titre": "Fraude prescription - Amina BENALI",
            "type": "Détection",
            "score": 95,
            "date": "2025-01-15",
            "pertinence": 98
        },
        {
            "id": "FP_001", 
            "titre": "Faux positif - Youssef ALAMI",
            "type": "Faux positif",
            "score": 72,
            "date": "2025-01-12",
            "pertinence": 85
        }
    ]
    
    return jsonify({
        "success": True,
        "query": query,
        "total_resultats": len(resultats),
        "resultats": resultats,
        "temps_recherche": "0.15s"
    })

