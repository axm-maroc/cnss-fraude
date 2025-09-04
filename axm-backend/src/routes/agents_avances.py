from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random
import json

agents_avances_bp = Blueprint('agents_avances', __name__)

class AgentComportemental:
    def __init__(self):
        self.patterns_comportementaux = {
            "temporels": {
                "concentration_horaire": {
                    "description": "Détection de concentrations anormales d'activité",
                    "seuils": {
                        "normal": "8h-18h réparti",
                        "suspect": ">60% activité sur 2h",
                        "critique": ">80% activité sur 1h"
                    },
                    "cas_detectes": [
                        {
                            "medecin": "Dr. Ahmed TAZI",
                            "pattern": "85% prescriptions entre 17h-18h vendredi",
                            "score_anomalie": 94,
                            "explication": "Évitement contrôles week-end"
                        }
                    ]
                },
                "saisonnalite": {
                    "description": "Analyse des variations saisonnières suspectes",
                    "patterns_normaux": ["Grippe hiver", "Allergies printemps"],
                    "patterns_suspects": ["Médicaments été pour pathologies hivernales"],
                    "cas_detectes": [
                        {
                            "pharmacie": "Al Andalous",
                            "anomalie": "Sirops toux +400% en juillet",
                            "score_anomalie": 87
                        }
                    ]
                }
            },
            "geographiques": {
                "deplacements_incoherents": {
                    "description": "Détection de déplacements physiquement impossibles",
                    "algorithme": "Calcul distance/temps entre consultations",
                    "cas_detectes": [
                        {
                            "patient": "Hassan IDRISSI",
                            "trajet": "Rabat → Casablanca en 15min",
                            "impossibilite": "Distance 87km",
                            "score_anomalie": 98
                        }
                    ]
                },
                "zones_atypiques": {
                    "description": "Consultations dans zones inhabituelles",
                    "criteres": ["Distance >50km domicile", "Pas de spécialiste local"],
                    "cas_detectes": [
                        {
                            "patient": "Fatima ALAOUI",
                            "domicile": "Agadir",
                            "consultation": "Casablanca",
                            "specialite": "Généraliste (disponible Agadir)",
                            "score_anomalie": 76
                        }
                    ]
                }
            },
            "medicaux": {
                "poly_pathologies": {
                    "description": "Détection de combinaisons pathologiques suspectes",
                    "incompatibilites": [
                        "Diabète + Hypoglycémiants multiples",
                        "Hypertension + Hypotenseurs excessifs"
                    ],
                    "cas_detectes": [
                        {
                            "patient": "Mohamed BENNANI",
                            "pathologies": ["Diabète", "Hypertension", "Dépression", "Insomnie"],
                            "medicaments": 12,
                            "score_coherence": 23,
                            "alerte": "Poly-pathologie suspecte"
                        }
                    ]
                },
                "dosages_anormaux": {
                    "description": "Détection de dosages incohérents avec pathologie",
                    "references": "Vidal, recommandations HAS",
                    "cas_detectes": [
                        {
                            "medicament": "Morphine",
                            "dosage_prescrit": "200mg/jour",
                            "dosage_normal": "30-60mg/jour",
                            "ratio_anomalie": 4.2,
                            "score_risque": 91
                        }
                    ]
                }
            }
        }
        
        self.technologies_utilisees = {
            "machine_learning": {
                "algorithmes": ["Random Forest", "SVM", "Neural Networks"],
                "precision": "94.2%",
                "rappel": "89.7%",
                "f1_score": "91.8%"
            },
            "analyse_graphes": {
                "detection_communautes": "Louvain algorithm",
                "centralite": "Betweenness centrality",
                "clustering": "Hierarchical clustering"
            },
            "nlp": {
                "extraction_entites": "spaCy medical",
                "classification_texte": "BERT fine-tuned",
                "detection_anomalies": "Transformer models"
            },
            "computer_vision": {
                "ocr_ordonnances": "Tesseract + deep learning",
                "verification_signatures": "Siamese networks",
                "detection_falsification": "GAN-based detection"
            }
        }

class AgentInvestigation:
    def __init__(self):
        self.fonctionnalites = {
            "collecte_preuves": {
                "automatisee": {
                    "historique_transactions": "Extraction automatique BDD",
                    "correlations_temporelles": "Analyse patterns chronologiques",
                    "liens_acteurs": "Cartographie réseau relationnel",
                    "preuves_numeriques": "Capture écrans, logs, métadonnées"
                },
                "manuelle": {
                    "temoignages": "Collecte déclarations",
                    "documents_physiques": "Scan ordonnances originales",
                    "controles_terrain": "Vérifications sur site"
                }
            },
            "generation_rapports": {
                "synthese_automatique": {
                    "template": "Rapport investigation standardisé",
                    "sections": ["Résumé exécutif", "Faits", "Preuves", "Conclusions"],
                    "generation": "IA générative + templates"
                },
                "recommandations_actions": {
                    "sanctions_administratives": "Avertissement, suspension, exclusion",
                    "poursuites_judiciaires": "Dépôt plainte, constitution partie civile",
                    "recuperation_montants": "Procédures recouvrement"
                },
                "priorisation_impact": {
                    "criteres": ["Montant fraudé", "Récidive", "Impact santé publique"],
                    "scoring": "Algorithme pondération multicritères"
                }
            },
            "workflow_investigation": {
                "assignation_automatique": {
                    "criteres": ["Spécialité enquêteur", "Charge travail", "Géographie"],
                    "algorithme": "Optimisation contraintes"
                },
                "suivi_etapes": {
                    "jalons": ["Ouverture", "Collecte", "Analyse", "Rapport", "Décision"],
                    "delais": "SLA par type fraude",
                    "alertes": "Notifications retards"
                },
                "escalade_hierarchique": {
                    "triggers": ["Montant >100k MAD", "Réseau >5 acteurs", "Récidive"],
                    "niveaux": ["Chef service", "Directeur", "Direction générale"]
                }
            }
        }
        
        self.outils_investigation = {
            "timeline_reconstruction": {
                "description": "Reconstitution chronologique fraude",
                "donnees": ["Transactions", "Consultations", "Prescriptions"],
                "visualisation": "Timeline interactive",
                "export": "PDF, Excel, JSON"
            },
            "network_analysis": {
                "description": "Cartographie réseau frauduleux",
                "noeuds": ["Médecins", "Pharmacies", "Patients"],
                "liens": ["Prescriptions", "Dispensations", "Paiements"],
                "metriques": ["Centralité", "Clustering", "Communautés"]
            },
            "financial_tracking": {
                "description": "Suivi flux financiers",
                "sources": ["Remboursements", "Honoraires", "Dispensations"],
                "analyse": ["Volumes", "Fréquences", "Bénéficiaires"],
                "alertes": ["Seuils dépassés", "Patterns anormaux"]
            },
            "evidence_management": {
                "description": "Gestion preuves numériques",
                "stockage": "Coffre-fort numérique sécurisé",
                "traçabilité": "Blockchain horodatage",
                "integrité": "Hash SHA-256, signatures électroniques"
            }
        }

agent_comportemental = AgentComportemental()
agent_investigation = AgentInvestigation()

@agents_avances_bp.route('/agent-comportemental/status')
def agent_comportemental_status():
    """Statut de l'agent comportemental"""
    status = {
        "nom": "Agent Comportemental AXM",
        "version": "2.1.4",
        "statut": "Opérationnel",
        "derniere_analyse": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "patterns_surveilles": len(agent_comportemental.patterns_comportementaux),
        "technologies_actives": len(agent_comportemental.technologies_utilisees),
        "performance": {
            "precision": "94.2%",
            "rappel": "89.7%",
            "f1_score": "91.8%",
            "temps_analyse_moyen": "2.3 secondes"
        },
        "analyses_24h": {
            "total": 15847,
            "anomalies_detectees": 234,
            "taux_anomalie": "1.48%",
            "confirmees_fraude": 182
        }
    }
    return jsonify({"success": True, "agent": status})

@agents_avances_bp.route('/agent-comportemental/patterns')
def get_patterns_comportementaux():
    """Récupère les patterns comportementaux détectés"""
    return jsonify({
        "success": True,
        "patterns": agent_comportemental.patterns_comportementaux,
        "technologies": agent_comportemental.technologies_utilisees
    })

@agents_avances_bp.route('/agent-comportemental/analyse-temps-reel')
def analyse_comportementale_temps_reel():
    """Analyse comportementale en temps réel"""
    analyse = {
        "timestamp": datetime.now().isoformat(),
        "patient_analyse": "Simulation temps réel",
        "patterns_detectes": [
            {
                "type": "Temporel",
                "anomalie": "Concentration 78% consultations vendredi 17h-18h",
                "score": 89,
                "niveau": "Élevé"
            },
            {
                "type": "Géographique", 
                "anomalie": "Consultations dans 4 villes différentes en 2h",
                "score": 95,
                "niveau": "Critique"
            },
            {
                "type": "Médical",
                "anomalie": "12 pathologies différentes, 18 médicaments",
                "score": 82,
                "niveau": "Élevé"
            }
        ],
        "score_global": 88,
        "recommandation": "Investigation immédiate",
        "actions_automatiques": [
            "Alerte équipe investigation",
            "Blocage temporaire remboursements",
            "Notification médecin prescripteur"
        ]
    }
    return jsonify({"success": True, "analyse": analyse})

@agents_avances_bp.route('/agent-investigation/status')
def agent_investigation_status():
    """Statut de l'agent d'investigation"""
    status = {
        "nom": "Agent Investigation AXM",
        "version": "1.8.2",
        "statut": "Opérationnel",
        "investigations_actives": 47,
        "investigations_terminees_24h": 12,
        "taux_confirmation_fraude": "87.3%",
        "delai_moyen_investigation": "8.5 jours",
        "montant_recupere_mois": 2340000,
        "outils_actifs": len(agent_investigation.outils_investigation),
        "enqueteurs_assignes": 15,
        "charge_travail_moyenne": "73%"
    }
    return jsonify({"success": True, "agent": status})

@agents_avances_bp.route('/agent-investigation/fonctionnalites')
def get_fonctionnalites_investigation():
    """Récupère les fonctionnalités de l'agent d'investigation"""
    return jsonify({
        "success": True,
        "fonctionnalites": agent_investigation.fonctionnalites,
        "outils": agent_investigation.outils_investigation
    })

@agents_avances_bp.route('/agent-investigation/nouveau-cas')
def nouveau_cas_investigation():
    """Création d'un nouveau cas d'investigation"""
    nouveau_cas = {
        "id_cas": f"INV_{random.randint(1000, 9999)}",
        "type_fraude": "Prescription suspecte",
        "priorite": "Élevée",
        "montant_estime": random.randint(50000, 500000),
        "assignation_automatique": {
            "enqueteur": "Sarah BENALI",
            "specialite": "Fraude médicamenteuse",
            "charge_actuelle": "68%",
            "delai_estime": "7 jours"
        },
        "preuves_collectees": {
            "automatiques": [
                "Historique prescriptions 6 mois",
                "Corrélations médecin-pharmacie",
                "Analyse patterns temporels"
            ],
            "manuelles_requises": [
                "Contrôle terrain pharmacie",
                "Vérification dossier médical",
                "Audition médecin prescripteur"
            ]
        },
        "workflow": {
            "etape_actuelle": "Collecte preuves automatisée",
            "prochaine_etape": "Analyse corrélations",
            "progression": "15%",
            "delai_restant": "6 jours"
        }
    }
    return jsonify({"success": True, "cas": nouveau_cas})

@agents_avances_bp.route('/agent-investigation/rapport-automatique')
def generer_rapport_automatique():
    """Génération automatique de rapport d'investigation"""
    rapport = {
        "id_rapport": f"RPT_{random.randint(10000, 99999)}",
        "date_generation": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "cas_id": "INV_2847",
        "type_fraude": "Réseau frauduleux",
        "resume_executif": {
            "fraude_confirmee": True,
            "montant_fraude": 1250000,
            "acteurs_impliques": 8,
            "periode": "4 mois",
            "impact": "Majeur"
        },
        "faits_etablis": [
            "Prescription coordonnée de médicaments onéreux",
            "Complicité médecin-pharmacien confirmée",
            "Utilisation patients fictifs",
            "Partage bénéfices frauduleux"
        ],
        "preuves_collectees": [
            "47 ordonnances falsifiées",
            "Enregistrements téléphoniques",
            "Relevés bancaires suspects",
            "Témoignages patients"
        ],
        "recommandations": {
            "sanctions_administratives": [
                "Exclusion médecin 2 ans",
                "Suspension pharmacie 6 mois",
                "Remboursement intégral"
            ],
            "poursuites_judiciaires": "Dépôt plainte escroquerie en bande organisée",
            "mesures_preventives": [
                "Surveillance renforcée zone géographique",
                "Contrôles inopinés trimestriels",
                "Formation sensibilisation"
            ]
        },
        "impact_financier": {
            "montant_recupere": 1250000,
            "economies_futures": 2500000,
            "cout_investigation": 45000,
            "roi": "2677%"
        }
    }
    return jsonify({"success": True, "rapport": rapport})

@agents_avances_bp.route('/agents-coordination')
def coordination_agents():
    """Coordination entre agent comportemental et investigation"""
    coordination = {
        "timestamp": datetime.now().isoformat(),
        "agents_actifs": ["Comportemental", "Investigation"],
        "synchronisation": "Temps réel",
        "echange_donnees": {
            "comportemental_vers_investigation": [
                "Anomalies détectées",
                "Scores de risque",
                "Patterns suspects",
                "Priorisation cas"
            ],
            "investigation_vers_comportemental": [
                "Confirmations fraude",
                "Nouveaux patterns identifiés",
                "Feedback précision",
                "Mise à jour modèles"
            ]
        },
        "performance_combinee": {
            "taux_detection": "94.7%",
            "faux_positifs": "8.3%",
            "temps_resolution": "6.2 jours",
            "satisfaction_enqueteurs": "91%"
        },
        "cas_en_cours": {
            "detectes_comportemental": 23,
            "assignes_investigation": 18,
            "en_attente": 5,
            "resolus_24h": 7
        }
    }
    return jsonify({"success": True, "coordination": coordination})

