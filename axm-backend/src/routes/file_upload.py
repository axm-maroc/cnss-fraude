from flask import Blueprint, request, jsonify
import os
import uuid
from datetime import datetime
import mimetypes

file_upload_bp = Blueprint('file_upload', __name__)

# Configuration des uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Créer le dossier d'upload s'il n'existe pas
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@file_upload_bp.route('/upload', methods=['POST'])
def upload_files():
    """Upload de fichiers externes pour la détection de fraude"""
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'Aucun fichier fourni'}), 400
        
        files = request.files.getlist('files')
        uploaded_files = []
        
        for file in files:
            if file.filename == '':
                continue
                
            if file and allowed_file(file.filename):
                # Générer un nom unique
                file_id = str(uuid.uuid4())
                filename = f"{file_id}_{file.filename}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                
                # Vérifier la taille du fichier
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                file.seek(0)
                
                if file_size > MAX_FILE_SIZE:
                    return jsonify({'error': f'Fichier {file.filename} trop volumineux (max 16MB)'}), 400
                
                # Sauvegarder le fichier
                file.save(filepath)
                
                # Informations du fichier
                file_info = {
                    'id': file_id,
                    'original_name': file.filename,
                    'filename': filename,
                    'size': file_size,
                    'type': mimetypes.guess_type(file.filename)[0] or 'application/octet-stream',
                    'upload_time': datetime.now().isoformat(),
                    'status': 'uploaded'
                }
                
                uploaded_files.append(file_info)
            else:
                return jsonify({'error': f'Type de fichier non autorisé: {file.filename}'}), 400
        
        return jsonify({
            'success': True,
            'message': f'{len(uploaded_files)} fichier(s) uploadé(s) avec succès',
            'files': uploaded_files
        })
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de l\'upload: {str(e)}'}), 500

@file_upload_bp.route('/files', methods=['GET'])
def list_files():
    """Liste des fichiers uploadés"""
    try:
        files = []
        if os.path.exists(UPLOAD_FOLDER):
            for filename in os.listdir(UPLOAD_FOLDER):
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.isfile(filepath):
                    stat = os.stat(filepath)
                    files.append({
                        'filename': filename,
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
        
        return jsonify({'files': files})
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des fichiers: {str(e)}'}), 500

@file_upload_bp.route('/process/<file_id>', methods=['POST'])
def process_file(file_id):
    """Traitement d'un fichier par les agents IA"""
    try:
        # Simulation du traitement par les agents
        processing_results = {
            'file_id': file_id,
            'status': 'processing',
            'agents_results': {
                'agent_collecte': {
                    'status': 'completed',
                    'extracted_data': {
                        'patient_name': 'Amina BENALI',
                        'doctor_name': 'Dr. Ahmed TAZI',
                        'pharmacy_name': 'Pharmacie Al Andalous',
                        'medication': 'Humira (Adalimumab)',
                        'quantity': 4,
                        'amount': 18000
                    }
                },
                'agent_comportemental': {
                    'status': 'completed',
                    'risk_indicators': [
                        'Fréquence de prescription élevée',
                        'Montant supérieur à la moyenne'
                    ],
                    'behavior_score': 75
                },
                'agent_relationnel': {
                    'status': 'completed',
                    'network_analysis': {
                        'doctor_pharmacy_relation': 'Forte',
                        'exclusivity_rate': 85,
                        'suspicious_patterns': True
                    }
                },
                'agent_temporel': {
                    'status': 'completed',
                    'temporal_patterns': {
                        'prescription_frequency': 'Anormale',
                        'time_clustering': True,
                        'weekend_activity': False
                    }
                },
                'agent_scoring': {
                    'status': 'completed',
                    'final_score': 87,
                    'risk_level': 'Élevé',
                    'recommendation': 'Investigation requise'
                }
            },
            'processing_time': '3.2 secondes',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(processing_results)
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors du traitement: {str(e)}'}), 500

@file_upload_bp.route('/therapeutic-protocols', methods=['GET'])
def get_therapeutic_protocols():
    """Récupération des protocoles thérapeutiques"""
    protocols = [
        {
            'id': 1,
            'pathology': 'Polyarthrite rhumatoïde',
            'medication': 'Humira (Adalimumab)',
            'dosage': '40mg/0.8ml',
            'max_monthly': 2,
            'unit_price': 2500,
            'risk_threshold': 85,
            'specialist_required': 'Rhumatologue',
            'contraindications': ['Infection active', 'Immunodéficience'],
            'monitoring_required': True
        },
        {
            'id': 2,
            'pathology': 'Maladie de Crohn',
            'medication': 'Remicade (Infliximab)',
            'dosage': '100mg',
            'max_monthly': 1,
            'unit_price': 3200,
            'risk_threshold': 90,
            'specialist_required': 'Gastro-entérologue',
            'contraindications': ['Insuffisance cardiaque', 'Tuberculose'],
            'monitoring_required': True
        },
        {
            'id': 3,
            'pathology': 'Cancer du sein',
            'medication': 'Herceptin (Trastuzumab)',
            'dosage': '440mg',
            'max_monthly': 3,
            'unit_price': 5200,
            'risk_threshold': 95,
            'specialist_required': 'Oncologue',
            'contraindications': ['Cardiopathie', 'Grossesse'],
            'monitoring_required': True
        },
        {
            'id': 4,
            'pathology': 'Psoriasis sévère',
            'medication': 'Stelara (Ustekinumab)',
            'dosage': '45mg',
            'max_monthly': 1,
            'unit_price': 4100,
            'risk_threshold': 80,
            'specialist_required': 'Dermatologue',
            'contraindications': ['Infection fongique', 'Cancer actif'],
            'monitoring_required': True
        },
        {
            'id': 5,
            'pathology': 'Sclérose en plaques',
            'medication': 'Tysabri (Natalizumab)',
            'dosage': '300mg',
            'max_monthly': 1,
            'unit_price': 3800,
            'risk_threshold': 92,
            'specialist_required': 'Neurologue',
            'contraindications': ['Leucoencéphalopathie', 'Immunosuppression'],
            'monitoring_required': True
        }
    ]
    
    return jsonify({'protocols': protocols})

@file_upload_bp.route('/validate-protocol', methods=['POST'])
def validate_against_protocol():
    """Validation d'une prescription contre les protocoles thérapeutiques"""
    try:
        data = request.get_json()
        medication = data.get('medication', '')
        quantity = data.get('quantity', 0)
        patient_profile = data.get('patient_profile', {})
        
        # Simulation de la validation
        validation_result = {
            'protocol_matched': True,
            'protocol_id': 1,
            'compliance_score': 75,
            'violations': [
                {
                    'type': 'quantity_exceeded',
                    'message': 'Quantité supérieure au maximum mensuel autorisé',
                    'severity': 'high'
                },
                {
                    'type': 'frequency_high',
                    'message': 'Fréquence de prescription anormalement élevée',
                    'severity': 'medium'
                }
            ],
            'recommendations': [
                'Vérifier la justification médicale',
                'Contrôler les antécédents du patient',
                'Valider avec le médecin spécialiste'
            ],
            'risk_assessment': {
                'score': 87,
                'level': 'Élevé',
                'factors': [
                    'Dépassement de posologie',
                    'Absence de suivi spécialisé',
                    'Prescription répétée'
                ]
            }
        }
        
        return jsonify(validation_result)
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la validation: {str(e)}'}), 500

