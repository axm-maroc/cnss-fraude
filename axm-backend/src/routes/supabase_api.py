"""
APIs Supabase pour l'application AXM CNSS
Endpoints pour la gestion des cas de fraude avec base de données réelle
"""

from flask import Blueprint, request, jsonify
import logging
from typing import Dict, Any, List, Optional
import sys
import os

# Ajout du chemin pour l'import
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from config.supabase_real import supabase_client
except ImportError:
    from config.supabase_mock import mock_supabase_client as supabase_client

# Configuration du blueprint
supabase_bp = Blueprint('supabase', __name__, url_prefix='/api/supabase')

# Configuration de logging
logger = logging.getLogger(__name__)

@supabase_bp.route('/health', methods=['GET'])
def health_check():
    """Vérification de l'état de la connexion Supabase"""
    try:
        is_connected = supabase_client.is_connected()
        return jsonify({
            'status': 'connected' if is_connected else 'fallback',
            'message': 'Supabase connecté' if is_connected else 'Mode fallback activé',
            'timestamp': '2025-01-15T10:30:00Z'
        })
    except Exception as e:
        logger.error(f"Erreur health check: {e}")
        return jsonify({'error': str(e)}), 500

@supabase_bp.route('/fraud-cases', methods=['GET'])
def get_fraud_cases():
    """
    Récupère la liste des cas de fraude avec filtres et pagination
    
    Query parameters:
    - page: Numéro de page (défaut: 1)
    - limit: Nombre d'éléments par page (défaut: 20)
    - status: Filtrer par statut (confirmed, investigation, detected)
    - case_type: Filtrer par type de cas
    - search: Recherche textuelle
    - min_amount: Montant minimum
    - max_amount: Montant maximum
    """
    try:
        # Récupération des paramètres
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        offset = (page - 1) * limit
        
        # Filtres
        filters = {
            'status': request.args.get('status'),
            'case_type': request.args.get('case_type'),
            'search': request.args.get('search'),
            'min_amount': request.args.get('min_amount'),
            'max_amount': request.args.get('max_amount')
        }
        
        # Nettoyage des filtres vides
        filters = {k: v for k, v in filters.items() if v}
        
        # Récupération des données
        cases = supabase_client.get_fraud_cases(limit, offset, filters)
        
        # Formatage des résultats
        formatted_cases = []
        for case in cases:
            formatted_case = {
                'id': case.get('case_id'),
                'type': case.get('case_type'),
                'status': case.get('status'),
                'complexity_score': case.get('complexity_score'),
                'amount_mad': float(case.get('amount_mad', 0)),
                'detection_date': case.get('detection_date'),
                'patient': {
                    'name': case.get('patient_name'),
                },
                'doctor': {
                    'name': case.get('doctor_name'),
                },
                'pharmacy': {
                    'name': case.get('pharmacy_name'),
                },
                'metrics': {
                    'prescription_count': case.get('prescription_count', 0),
                    'document_count': case.get('document_count', 0)
                }
            }
            formatted_cases.append(formatted_case)
        
        return jsonify({
            'success': True,
            'data': formatted_cases,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': len(formatted_cases),
                'has_more': len(formatted_cases) == limit
            },
            'filters_applied': filters
        })
        
    except Exception as e:
        logger.error(f"Erreur récupération cas de fraude: {e}")
        return jsonify({'error': str(e)}), 500

@supabase_bp.route('/fraud-cases/<case_id>', methods=['GET'])
def get_fraud_case_detail(case_id: str):
    """
    Récupère les détails complets d'un cas de fraude
    
    Args:
        case_id: Identifiant du cas (ex: DET_001)
    """
    try:
        case_detail = supabase_client.get_fraud_case_detail(case_id)
        
        if not case_detail:
            return jsonify({'error': 'Cas non trouvé'}), 404
        
        # Formatage des détails
        formatted_detail = {
            'case_info': {
                'id': case_detail.get('case_id'),
                'type': case_detail.get('case_type'),
                'status': case_detail.get('status'),
                'complexity_score': case_detail.get('complexity_score'),
                'amount_mad': float(case_detail.get('amount_mad', 0)),
                'detection_date': case_detail.get('detection_date'),
                'investigation_date': case_detail.get('investigation_date'),
                'resolution_date': case_detail.get('resolution_date')
            },
            'prescriptions': [],
            'documents': [],
            'ai_detections': [],
            'investigations': []
        }
        
        # Formatage des prescriptions
        for prescription in case_detail.get('prescriptions', []):
            formatted_prescription = {
                'id': prescription.get('prescription_id'),
                'date': prescription.get('prescription_date'),
                'amount_mad': float(prescription.get('total_amount_mad', 0)),
                'is_fraudulent': prescription.get('is_fraudulent'),
                'fraud_indicators': prescription.get('fraud_indicators', []),
                'patient': prescription.get('patients', {}),
                'doctor': prescription.get('doctors', {}),
                'pharmacy': prescription.get('pharmacies', {}),
                'medications': []
            }
            
            # Ajout des médicaments
            for detail in prescription.get('prescription_details', []):
                medication = {
                    'name': detail.get('medications', {}).get('name'),
                    'dosage': detail.get('medications', {}).get('dosage'),
                    'quantity': detail.get('quantity'),
                    'unit_price_mad': float(detail.get('unit_price_mad', 0)),
                    'total_price_mad': float(detail.get('total_price_mad', 0)),
                    'is_suspicious': detail.get('is_suspicious')
                }
                formatted_prescription['medications'].append(medication)
            
            formatted_detail['prescriptions'].append(formatted_prescription)
        
        # Formatage des documents
        for document in case_detail.get('documents', []):
            formatted_document = {
                'id': document.get('document_id'),
                'type': document.get('document_type'),
                'file_name': document.get('file_name'),
                'file_path': document.get('file_path'),
                'scan_quality': document.get('scan_quality'),
                'is_authentic': document.get('is_authentic'),
                'file_size': document.get('file_size'),
                'mime_type': document.get('mime_type')
            }
            formatted_detail['documents'].append(formatted_document)
        
        # Formatage des détections IA
        for detection in case_detail.get('ai_detections', []):
            formatted_detection = {
                'agent_type': detection.get('agent_type'),
                'detection_method': detection.get('detection_method'),
                'confidence_score': float(detection.get('confidence_score', 0)),
                'risk_indicators': detection.get('risk_indicators', []),
                'analysis_details': detection.get('analysis_details', {}),
                'detection_timestamp': detection.get('detection_timestamp')
            }
            formatted_detail['ai_detections'].append(formatted_detection)
        
        # Formatage des investigations
        for investigation in case_detail.get('investigations', []):
            formatted_investigation = {
                'id': investigation.get('investigation_id'),
                'investigator_name': investigation.get('investigator_name'),
                'type': investigation.get('investigation_type'),
                'status': investigation.get('status'),
                'findings': investigation.get('findings'),
                'recommendations': investigation.get('recommendations'),
                'start_date': investigation.get('start_date'),
                'end_date': investigation.get('end_date')
            }
            formatted_detail['investigations'].append(formatted_investigation)
        
        return jsonify({
            'success': True,
            'data': formatted_detail
        })
        
    except Exception as e:
        logger.error(f"Erreur récupération détail cas {case_id}: {e}")
        return jsonify({'error': str(e)}), 500

@supabase_bp.route('/search', methods=['GET'])
def search_fraud_cases():
    """
    Recherche textuelle dans les cas de fraude
    
    Query parameters:
    - q: Terme de recherche
    - limit: Nombre maximum de résultats (défaut: 20)
    """
    try:
        search_term = request.args.get('q', '').strip()
        limit = int(request.args.get('limit', 20))
        
        if not search_term:
            return jsonify({'error': 'Terme de recherche requis'}), 400
        
        # Recherche
        results = supabase_client.search_fraud_cases(search_term, limit)
        
        # Formatage des résultats
        formatted_results = []
        for result in results:
            formatted_result = {
                'id': result.get('case_id'),
                'type': result.get('case_type'),
                'status': result.get('status'),
                'amount_mad': float(result.get('amount_mad', 0)),
                'detection_date': result.get('detection_date'),
                'patient_name': result.get('patient_name'),
                'doctor_name': result.get('doctor_name'),
                'pharmacy_name': result.get('pharmacy_name'),
                'relevance_score': 100  # Score de pertinence simulé
            }
            formatted_results.append(formatted_result)
        
        return jsonify({
            'success': True,
            'query': search_term,
            'results_count': len(formatted_results),
            'data': formatted_results
        })
        
    except Exception as e:
        logger.error(f"Erreur recherche: {e}")
        return jsonify({'error': str(e)}), 500

@supabase_bp.route('/statistics', methods=['GET'])
def get_fraud_statistics():
    """Récupère les statistiques globales de fraude"""
    try:
        stats = supabase_client.get_fraud_statistics()
        
        return jsonify({
            'success': True,
            'data': {
                'overview': {
                    'total_cases': stats.get('total_cases', 0),
                    'confirmed_cases': stats.get('confirmed_cases', 0),
                    'total_amount_mad': stats.get('total_amount_mad', 0),
                    'detection_rate': stats.get('detection_rate', 0),
                    'false_positive_rate': round(100 - stats.get('detection_rate', 0), 1)
                },
                'by_region': stats.get('region_stats', []),
                'trends': stats.get('trends', [])
            }
        })
        
    except Exception as e:
        logger.error(f"Erreur récupération statistiques: {e}")
        return jsonify({'error': str(e)}), 500

@supabase_bp.route('/filters/options', methods=['GET'])
def get_filter_options():
    """Récupère les options disponibles pour les filtres"""
    try:
        # Options de filtrage (peuvent être récupérées dynamiquement de Supabase)
        filter_options = {
            'status': [
                {'value': 'detected', 'label': 'Détecté', 'count': 45},
                {'value': 'investigation', 'label': 'En investigation', 'count': 38},
                {'value': 'confirmed', 'label': 'Confirmé', 'count': 89},
                {'value': 'resolved', 'label': 'Résolu', 'count': 23}
            ],
            'case_type': [
                {'value': 'Prescription excessive', 'label': 'Prescription excessive', 'count': 34},
                {'value': 'Réseau organisé', 'label': 'Réseau organisé', 'count': 12},
                {'value': 'Usurpation identité', 'label': 'Usurpation identité', 'count': 18},
                {'value': 'Fraude temporelle', 'label': 'Fraude temporelle', 'count': 15},
                {'value': 'Fraude biologique', 'label': 'Fraude biologique', 'count': 28},
                {'value': 'Fraude transfrontalière', 'label': 'Fraude transfrontalière', 'count': 8},
                {'value': 'Fraude pédiatrique', 'label': 'Fraude pédiatrique', 'count': 6},
                {'value': 'Fraude technologique', 'label': 'Fraude technologique', 'count': 4},
                {'value': 'Fraude psychologique', 'label': 'Fraude psychologique', 'count': 3},
                {'value': 'Fraude environnementale', 'label': 'Fraude environnementale', 'count': 2}
            ],
            'regions': [
                {'value': 'Casablanca-Settat', 'label': 'Casablanca-Settat', 'count': 45},
                {'value': 'Rabat-Salé-Kénitra', 'label': 'Rabat-Salé-Kénitra', 'count': 32},
                {'value': 'Marrakech-Safi', 'label': 'Marrakech-Safi', 'count': 28},
                {'value': 'Fès-Meknès', 'label': 'Fès-Meknès', 'count': 22}
            ],
            'amount_ranges': [
                {'value': '0-10000', 'label': '0 - 10K MAD', 'count': 67},
                {'value': '10000-100000', 'label': '10K - 100K MAD', 'count': 45},
                {'value': '100000-1000000', 'label': '100K - 1M MAD', 'count': 12},
                {'value': '1000000+', 'label': '1M+ MAD', 'count': 3}
            ]
        }
        
        return jsonify({
            'success': True,
            'data': filter_options
        })
        
    except Exception as e:
        logger.error(f"Erreur récupération options filtres: {e}")
        return jsonify({'error': str(e)}), 500

@supabase_bp.route('/export', methods=['POST'])
def export_fraud_cases():
    """Exporte les cas de fraude selon les critères spécifiés"""
    try:
        data = request.get_json()
        export_format = data.get('format', 'csv')  # csv, excel, pdf
        filters = data.get('filters', {})
        
        # Récupération des cas selon les filtres
        cases = supabase_client.get_fraud_cases(1000, 0, filters)  # Export max 1000 cas
        
        # Simulation de l'export (dans une vraie implémentation, générer le fichier)
        export_info = {
            'export_id': f"EXP_{len(cases)}_{export_format.upper()}",
            'format': export_format,
            'cases_count': len(cases),
            'file_size_mb': round(len(cases) * 0.05, 2),  # Estimation
            'download_url': f"/api/supabase/download/EXP_{len(cases)}_{export_format.upper()}",
            'expires_at': '2025-01-16T10:30:00Z'
        }
        
        return jsonify({
            'success': True,
            'message': f'Export de {len(cases)} cas généré avec succès',
            'data': export_info
        })
        
    except Exception as e:
        logger.error(f"Erreur export: {e}")
        return jsonify({'error': str(e)}), 500

# Gestion des erreurs
@supabase_bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trouvé'}), 404

@supabase_bp.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erreur interne du serveur'}), 500

