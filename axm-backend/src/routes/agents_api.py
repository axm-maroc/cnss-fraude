from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime
import uuid
from werkzeug.utils import secure_filename

agents_api = Blueprint('agents_api', __name__)

# Configuration des agents basée sur la retranscription client
AGENT_CONFIGS = {
    'collecte': {
        'name': 'Agent de Collecte',
        'description': 'Ingestion et normalisation des données AMO',
        'rules': [
            'Validation format ordonnances (PDF, JPG, PNG)',
            'Extraction OCR données médicales',
            'Normalisation codes CIM-10 et ATC',
            'Vérification intégrité données',
            'Enrichissement référentiels CNSS'
        ],
        'data_sources': ['ordonnances', 'factures', 'rapports_medicaux', 'certificats'],
        'processing_time': 120,  # secondes
        'success_rate': 95
    },
    'comportemental': {
        'name': 'Agent Comportemental',
        'description': 'Analyse patterns comportementaux individuels',
        'rules': [
            'Détection changements brutaux consommation',
            'Analyse fréquence consultations par spécialité',
            'Identification patterns temporels suspects',
            'Scoring comportement patient/médecin',
            'Comparaison profils similaires'
        ],
        'data_sources': ['historique_consultations', 'profils_patients', 'donnees_temporelles'],
        'processing_time': 180,
        'success_rate': 88
    },
    'relationnel': {
        'name': 'Agent Relationnel',
        'description': 'Détection réseaux frauduleux organisés',
        'rules': [
            'Analyse graphe relations médecin-pharmacie',
            'Détection clusters suspects',
            'Identification patients fictifs',
            'Analyse géolocalisation anormale',
            'Scoring force relations'
        ],
        'data_sources': ['reseaux_relationnels', 'donnees_geographiques', 'graphes_connexions'],
        'processing_time': 300,
        'success_rate': 92
    },
    'temporel': {
        'name': 'Agent Temporel',
        'description': 'Analyse anomalies temporelles',
        'rules': [
            'Détection prescriptions simultanées',
            'Analyse fenêtres temporelles suspectes',
            'Identification patterns saisonniers',
            'Vérification délais réglementaires',
            'Scoring urgence temporelle'
        ],
        'data_sources': ['series_temporelles', 'calendriers_medicaux', 'donnees_timing'],
        'processing_time': 150,
        'success_rate': 90
    },
    'scoring': {
        'name': 'Agent de Scoring',
        'description': 'Calcul et priorisation scores de risque',
        'rules': [
            'Agrégation scores autres agents',
            'Application pondérations métier',
            'Calcul score global risque',
            'Priorisation alertes',
            'Génération recommandations'
        ],
        'data_sources': ['scores_partiels', 'regles_ponderation', 'seuils_decision'],
        'processing_time': 90,
        'success_rate': 94
    },
    'investigation': {
        'name': 'Agent Investigation',
        'description': 'Investigation approfondie cas complexes',
        'rules': [
            'Analyse croisée multi-sources',
            'Génération hypothèses fraude',
            'Recherche preuves complémentaires',
            'Validation expertise métier',
            'Préparation dossiers juridiques'
        ],
        'data_sources': ['dossiers_complexes', 'preuves_documentaires', 'expertises'],
        'processing_time': 600,
        'success_rate': 85
    }
}

# Stockage temporaire des fichiers uploadés par agent
UPLOADED_FILES = {}

@agents_api.route('/api/agents/list', methods=['GET'])
def get_agents_list():
    """Récupère la liste des agents disponibles"""
    agents = []
    for agent_id, config in AGENT_CONFIGS.items():
        agents.append({
            'id': agent_id,
            'name': config['name'],
            'description': config['description'],
            'rules': config['rules'],
            'data_sources': config['data_sources'],
            'processing_time': config['processing_time'],
            'success_rate': config['success_rate'],
            'status': 'active',
            'last_run': datetime.now().isoformat(),
            'processed_cases': 50 + hash(agent_id) % 100,
            'avg_processing_time': config['processing_time'] + (hash(agent_id) % 60)
        })
    
    return jsonify({
        'success': True,
        'agents': agents,
        'total': len(agents)
    })

@agents_api.route('/api/agents/<agent_id>/upload', methods=['POST'])
def upload_files_for_agent(agent_id):
    """Upload de fichiers pour un agent spécifique"""
    if agent_id not in AGENT_CONFIGS:
        return jsonify({'success': False, 'error': 'Agent non trouvé'}), 404
    
    if 'files' not in request.files:
        return jsonify({'success': False, 'error': 'Aucun fichier fourni'}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []
    
    # Créer le dossier de stockage si nécessaire
    upload_dir = f'/tmp/agent_uploads/{agent_id}'
    os.makedirs(upload_dir, exist_ok=True)
    
    for file in files:
        if file.filename == '':
            continue
            
        filename = secure_filename(file.filename)
        file_id = str(uuid.uuid4())
        file_path = os.path.join(upload_dir, f"{file_id}_{filename}")
        
        try:
            file.save(file_path)
            
            file_info = {
                'id': file_id,
                'original_name': filename,
                'path': file_path,
                'size': os.path.getsize(file_path),
                'upload_time': datetime.now().isoformat(),
                'type': filename.split('.')[-1].lower() if '.' in filename else 'unknown'
            }
            
            uploaded_files.append(file_info)
            
            # Stocker en mémoire pour l'agent
            if agent_id not in UPLOADED_FILES:
                UPLOADED_FILES[agent_id] = []
            UPLOADED_FILES[agent_id].append(file_info)
            
        except Exception as e:
            return jsonify({'success': False, 'error': f'Erreur upload: {str(e)}'}), 500
    
    return jsonify({
        'success': True,
        'uploaded_files': uploaded_files,
        'total_files': len(uploaded_files),
        'agent_id': agent_id
    })

@agents_api.route('/api/agents/<agent_id>/run', methods=['POST'])
def run_agent(agent_id):
    """Exécute un agent spécifique avec ses fichiers"""
    if agent_id not in AGENT_CONFIGS:
        return jsonify({'success': False, 'error': 'Agent non trouvé'}), 404
    
    config = AGENT_CONFIGS[agent_id]
    uploaded_files = UPLOADED_FILES.get(agent_id, [])
    
    # Simulation du traitement basé sur la retranscription client
    processing_results = simulate_agent_processing(agent_id, config, uploaded_files)
    
    return jsonify({
        'success': True,
        'agent_id': agent_id,
        'agent_name': config['name'],
        'processing_results': processing_results,
        'execution_time': datetime.now().isoformat()
    })

@agents_api.route('/api/agents/<agent_id>/results', methods=['GET'])
def get_agent_results(agent_id):
    """Récupère les résultats d'un agent"""
    if agent_id not in AGENT_CONFIGS:
        return jsonify({'success': False, 'error': 'Agent non trouvé'}), 404
    
    # Simulation de résultats basés sur les besoins clients
    results = generate_agent_results(agent_id)
    
    return jsonify({
        'success': True,
        'agent_id': agent_id,
        'results': results
    })

@agents_api.route('/api/agents/<agent_id>/files', methods=['GET'])
def get_agent_files(agent_id):
    """Récupère la liste des fichiers uploadés pour un agent"""
    if agent_id not in AGENT_CONFIGS:
        return jsonify({'success': False, 'error': 'Agent non trouvé'}), 404
    
    files = UPLOADED_FILES.get(agent_id, [])
    
    return jsonify({
        'success': True,
        'agent_id': agent_id,
        'files': files,
        'total_files': len(files)
    })

def simulate_agent_processing(agent_id, config, files):
    """Simule le traitement d'un agent basé sur la retranscription client"""
    
    # Règles spécifiques basées sur les besoins clients identifiés
    if agent_id == 'collecte':
        return {
            'status': 'completed',
            'processed_files': len(files),
            'extracted_data': {
                'ordonnances': len([f for f in files if 'ordonnance' in f.get('original_name', '').lower()]),
                'factures': len([f for f in files if 'facture' in f.get('original_name', '').lower()]),
                'certificats': len([f for f in files if 'certificat' in f.get('original_name', '').lower()])
            },
            'validation_results': {
                'format_valid': True,
                'ocr_success_rate': 95,
                'data_integrity': 'OK'
            },
            'anomalies_detected': 2,
            'score': 85
        }
    
    elif agent_id == 'comportemental':
        return {
            'status': 'completed',
            'behavioral_patterns': {
                'consumption_changes': 'Augmentation brutale +150% sur 3 mois',
                'consultation_frequency': 'Fréquence anormale: 15 consultations/mois',
                'temporal_patterns': 'Concentration 18h-20h suspecte'
            },
            'risk_indicators': [
                'Changement brutal comportement',
                'Fréquence consultations excessive',
                'Pattern temporel inhabituel'
            ],
            'comparison_results': {
                'similar_profiles': 12,
                'deviation_score': 78,
                'risk_level': 'HIGH'
            },
            'score': 78
        }
    
    elif agent_id == 'relationnel':
        return {
            'status': 'completed',
            'network_analysis': {
                'detected_clusters': 3,
                'suspicious_connections': 8,
                'fictitious_patients': 5
            },
            'relationship_strength': {
                'medecin_pharmacie': 0.85,
                'patient_medecin': 0.92,
                'geographic_anomaly': True
            },
            'fraud_network': {
                'network_size': 15,
                'key_actors': ['Dr. ALAMI', 'Pharmacie Atlas', 'Lab BioMed'],
                'estimated_loss': '2.3M MAD'
            },
            'score': 92
        }
    
    elif agent_id == 'temporel':
        return {
            'status': 'completed',
            'temporal_anomalies': {
                'simultaneous_prescriptions': 4,
                'suspicious_windows': ['2024-01-15 18:00-20:00', '2024-01-22 19:30-21:00'],
                'seasonal_patterns': 'Pic anormal janvier-février'
            },
            'regulatory_compliance': {
                'delay_violations': 2,
                'timing_inconsistencies': 3,
                'urgency_score': 85
            },
            'recommendations': [
                'Investigation approfondie période suspecte',
                'Vérification délais réglementaires',
                'Audit prescriptions simultanées'
            ],
            'score': 85
        }
    
    elif agent_id == 'scoring':
        return {
            'status': 'completed',
            'aggregated_scores': {
                'collecte': 85,
                'comportemental': 78,
                'relationnel': 92,
                'temporel': 85
            },
            'weighted_score': 87,
            'risk_level': 'CRITICAL',
            'priority': 1,
            'recommendations': [
                'Investigation immédiate requise',
                'Blocage temporaire remboursements',
                'Audit complet réseau identifié'
            ],
            'confidence': 94
        }
    
    elif agent_id == 'investigation':
        return {
            'status': 'completed',
            'investigation_findings': {
                'evidence_collected': 12,
                'cross_references': 8,
                'expert_validations': 3
            },
            'fraud_hypotheses': [
                'Réseau organisé multi-régional',
                'Complicité interne laboratoire',
                'Patients fictifs coordonnés'
            ],
            'legal_preparation': {
                'documents_prepared': 15,
                'witness_statements': 3,
                'financial_impact': '2.3M MAD'
            },
            'next_actions': [
                'Transmission au parquet',
                'Saisie conservatoire',
                'Audition témoins'
            ],
            'score': 95
        }
    
    return {
        'status': 'completed',
        'processed_files': len(files),
        'score': 75,
        'anomalies_detected': 1
    }

def generate_agent_results(agent_id):
    """Génère des résultats détaillés pour un agent"""
    base_results = {
        'execution_id': str(uuid.uuid4()),
        'timestamp': datetime.now().isoformat(),
        'agent_id': agent_id,
        'agent_name': AGENT_CONFIGS[agent_id]['name']
    }
    
    # Résultats spécifiques selon l'agent et les besoins clients
    if agent_id == 'collecte':
        base_results.update({
            'data_quality': {
                'completeness': 95,
                'accuracy': 92,
                'consistency': 88
            },
            'processing_stats': {
                'total_documents': 127,
                'successfully_processed': 121,
                'errors': 6
            }
        })
    
    elif agent_id == 'comportemental':
        base_results.update({
            'behavioral_insights': {
                'normal_patterns': 85,
                'suspicious_patterns': 15,
                'high_risk_cases': 8
            },
            'trend_analysis': {
                'increasing_risk': 12,
                'stable_risk': 103,
                'decreasing_risk': 12
            }
        })
    
    return base_results

@agents_api.route('/api/agents/health', methods=['GET'])
def agents_health():
    """Vérification de l'état des agents"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'agents_count': len(AGENT_CONFIGS),
        'timestamp': datetime.now().isoformat()
    })

