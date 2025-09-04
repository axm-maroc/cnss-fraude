"""
APIs pour le workflow actif de détection de fraude AXM CNSS
Gestion complète du processus depuis l'injection jusqu'à la validation
"""

from flask import Blueprint, request, jsonify
import logging
from typing import Dict, Any, List, Optional
import sys
import os
import json
from datetime import datetime, timedelta
import uuid

# Ajout du chemin pour l'import
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from config.supabase_real import supabase_client
except ImportError:
    from config.supabase_mock import mock_supabase_client as supabase_client

# Configuration du blueprint
workflow_bp = Blueprint('workflow', __name__, url_prefix='/api/workflow')

# Configuration de logging
logger = logging.getLogger(__name__)

@workflow_bp.route('/health', methods=['GET'])
def health_check():
    """Vérification de l'état du système de workflow"""
    try:
        if supabase_client.is_connected():
            return jsonify({
                'status': 'healthy',
                'message': 'Workflow system operational',
                'timestamp': datetime.now().isoformat(),
                'database': 'connected'
            })
        else:
            return jsonify({
                'status': 'unhealthy',
                'message': 'Database connection failed',
                'timestamp': datetime.now().isoformat()
            }), 500
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/protocols', methods=['GET'])
def get_therapeutic_protocols():
    """Récupération des protocoles thérapeutiques"""
    try:
        query = """
        SELECT protocol_id, pathology_name, medication_name, standard_dosage,
               max_monthly_quantity, max_annual_quantity, unit_price_mad,
               risk_threshold_score, requires_specialist, specialist_type,
               max_duration_days
        FROM therapeutic_protocols
        ORDER BY pathology_name, medication_name
        """
        
        protocols = supabase_client.execute_query(query)
        
        if protocols is not None:
            protocols_list = [dict(protocol) for protocol in protocols]
            return jsonify({
                'success': True,
                'data': protocols_list,
                'total': len(protocols_list)
            })
        else:
            return jsonify({'error': 'Failed to fetch protocols'}), 500
            
    except Exception as e:
        logger.error(f"Error fetching protocols: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/initiate', methods=['POST'])
def initiate_workflow():
    """Initiation d'un nouveau workflow de détection"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        required_fields = ['case_id', 'initiated_by']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Création du workflow
        workflow_data = (
            data['case_id'],
            data.get('workflow_status', 'initiated'),
            data.get('current_step', 1),
            data.get('total_steps', 7),
            data['initiated_by'],
            data.get('priority_level', 'medium'),
            data.get('assigned_to'),
            data.get('assigned_role'),
            data.get('notes')
        )
        
        workflow_query = """
        INSERT INTO detection_workflows (case_id, workflow_status, current_step, total_steps,
                                       initiated_by, priority_level, assigned_to, assigned_role, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING workflow_id
        """
        
        result = supabase_client.execute_query(workflow_query, workflow_data)
        
        if result and len(result) > 0:
            workflow_id = result[0]['workflow_id']
            
            # Création des étapes de workflow par défaut
            default_steps = [
                (1, 'Injection de documents', 'Upload et traitement des documents', 'collection'),
                (2, 'Analyse comportementale', 'Analyse des patterns individuels', 'behavioral'),
                (3, 'Analyse relationnelle', 'Détection des réseaux frauduleux', 'relational'),
                (4, 'Analyse temporelle', 'Détection des anomalies temporelles', 'temporal'),
                (5, 'Calcul de score', 'Génération du score de risque', 'scoring'),
                (6, 'Validation médicale', 'Validation par un médecin expert', 'medical'),
                (7, 'Décision finale', 'Validation finale et actions', 'validation')
            ]
            
            for step_num, step_name, step_desc, agent_type in default_steps:
                step_query = """
                INSERT INTO workflow_steps (workflow_id, step_number, step_name, step_description, agent_type)
                VALUES (%s, %s, %s, %s, %s)
                """
                supabase_client.execute_query(step_query, (workflow_id, step_num, step_name, step_desc, agent_type))
            
            return jsonify({
                'success': True,
                'workflow_id': workflow_id,
                'message': 'Workflow initiated successfully'
            })
        else:
            return jsonify({'error': 'Failed to create workflow'}), 500
            
    except Exception as e:
        logger.error(f"Error initiating workflow: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/upload-document', methods=['POST'])
def upload_document():
    """Upload et traitement d'un document dans le workflow"""
    try:
        data = request.get_json()
        
        # Validation des données
        required_fields = ['workflow_id', 'document_type', 'filename', 'uploaded_by']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Simulation du traitement OCR et extraction
        extracted_data = {
            'patient_name': data.get('patient_name', 'Extraction automatique'),
            'doctor_name': data.get('doctor_name', 'Dr. Extraction'),
            'medications': data.get('medications', []),
            'amounts': data.get('amounts', []),
            'dates': data.get('dates', [])
        }
        
        # Insertion du document
        doc_data = (
            data['workflow_id'],
            data['document_type'],
            data['filename'],
            f"/uploads/{data['filename']}",
            data.get('file_size', 0),
            data.get('mime_type', 'application/pdf'),
            data.get('ocr_text', 'Texte extrait par OCR'),
            json.dumps(extracted_data),
            'processed',
            data['uploaded_by']
        )
        
        doc_query = """
        INSERT INTO injected_documents (workflow_id, document_type, original_filename,
                                      file_path, file_size_bytes, mime_type, ocr_text,
                                      extracted_data, processing_status, uploaded_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING document_id
        """
        
        result = supabase_client.execute_query(doc_query, doc_data)
        
        if result and len(result) > 0:
            document_id = result[0]['document_id']
            
            # Mise à jour de l'étape du workflow
            update_step_query = """
            UPDATE workflow_steps 
            SET step_status = 'completed', completed_at = CURRENT_TIMESTAMP
            WHERE workflow_id = %s AND step_number = 1
            """
            supabase_client.execute_query(update_step_query, (data['workflow_id'],))
            
            # Avancement du workflow
            update_workflow_query = """
            UPDATE detection_workflows 
            SET current_step = 2, updated_at = CURRENT_TIMESTAMP
            WHERE workflow_id = %s
            """
            supabase_client.execute_query(update_workflow_query, (data['workflow_id'],))
            
            return jsonify({
                'success': True,
                'document_id': document_id,
                'extracted_data': extracted_data,
                'message': 'Document uploaded and processed successfully'
            })
        else:
            return jsonify({'error': 'Failed to upload document'}), 500
            
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/process-agents/<int:workflow_id>', methods=['POST'])
def process_agents(workflow_id):
    """Traitement par les agents IA spécialisés"""
    try:
        # Simulation du traitement par les agents
        agents_results = {
            'behavioral': {
                'score': 85,
                'risk_factors': ['Prescription inhabituelle', 'Fréquence élevée'],
                'confidence': 92.5
            },
            'relational': {
                'score': 78,
                'risk_factors': ['Réseau suspect détecté', 'Relations multiples'],
                'confidence': 88.0
            },
            'temporal': {
                'score': 91,
                'risk_factors': ['Pattern temporel anormal', 'Concentration horaire'],
                'confidence': 95.2
            }
        }
        
        # Insertion des scores pour chaque agent
        for agent_type, result in agents_results.items():
            score_data = (
                workflow_id,
                None,  # case_id sera récupéré via le workflow
                agent_type,
                result['score'],
                json.dumps(result),
                json.dumps(result['risk_factors']),
                result['confidence']
            )
            
            score_query = """
            INSERT INTO detection_scores (workflow_id, case_id, agent_type, score_value,
                                        score_details, risk_factors, confidence_level)
            VALUES (%s, (SELECT case_id FROM detection_workflows WHERE workflow_id = %s), %s, %s, %s, %s, %s)
            """
            supabase_client.execute_query(score_query, (workflow_id, workflow_id, agent_type, result['score'], json.dumps(result), json.dumps(result['risk_factors']), result['confidence']))
        
        # Calcul du score global
        global_score = sum(result['score'] for result in agents_results.values()) // len(agents_results)
        
        # Mise à jour des étapes du workflow
        for step_num in [2, 3, 4]:
            update_step_query = """
            UPDATE workflow_steps 
            SET step_status = 'completed', completed_at = CURRENT_TIMESTAMP,
                score_generated = %s
            WHERE workflow_id = %s AND step_number = %s
            """
            supabase_client.execute_query(update_step_query, (global_score, workflow_id, step_num))
        
        # Avancement du workflow vers le scoring
        update_workflow_query = """
        UPDATE detection_workflows 
        SET current_step = 5, updated_at = CURRENT_TIMESTAMP
        WHERE workflow_id = %s
        """
        supabase_client.execute_query(update_workflow_query, (workflow_id,))
        
        return jsonify({
            'success': True,
            'agents_results': agents_results,
            'global_score': global_score,
            'message': 'Agents processing completed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error processing agents: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/validate/<int:workflow_id>', methods=['POST'])
def validate_workflow(workflow_id):
    """Validation par un expert (médecin, agent, investigateur)"""
    try:
        data = request.get_json()
        
        # Validation des données
        required_fields = ['validator_name', 'validator_role', 'decision']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Insertion de la validation
        validation_data = (
            workflow_id,
            data['validator_name'],
            data['validator_role'],
            data.get('validation_type', 'review'),
            data['decision'],
            data.get('justification', ''),
            data.get('recommended_action', ''),
            data.get('next_assignee'),
            data.get('next_assignee_role')
        )
        
        validation_query = """
        INSERT INTO workflow_validations (workflow_id, validator_name, validator_role,
                                        validation_type, decision, justification,
                                        recommended_action, next_assignee, next_assignee_role)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING validation_id
        """
        
        result = supabase_client.execute_query(validation_query, validation_data)
        
        if result and len(result) > 0:
            validation_id = result[0]['validation_id']
            
            # Mise à jour du workflow selon la décision
            if data['decision'] == 'approved':
                new_status = 'completed'
                new_step = 7
            elif data['decision'] == 'investigation_required':
                new_status = 'investigation'
                new_step = 6
            elif data['decision'] == 'legal_action':
                new_status = 'legal_action'
                new_step = 7
            else:
                new_status = 'rejected'
                new_step = 7
            
            # Mise à jour du workflow
            update_workflow_query = """
            UPDATE detection_workflows 
            SET workflow_status = %s, current_step = %s, assigned_to = %s, 
                assigned_role = %s, updated_at = CURRENT_TIMESTAMP
            WHERE workflow_id = %s
            """
            supabase_client.execute_query(update_workflow_query, (
                new_status, new_step, data.get('next_assignee'), 
                data.get('next_assignee_role'), workflow_id
            ))
            
            # Si investigation requise, créer l'investigation
            if data['decision'] == 'investigation_required':
                investigation_data = (
                    workflow_id,
                    data.get('investigation_type', 'field_audit'),
                    data.get('justification', 'Investigation complémentaire requise'),
                    data.get('next_assignee'),
                    data.get('priority_level', 'medium'),
                    (datetime.now() + timedelta(days=30)).date(),
                    data['validator_name']
                )
                
                investigation_query = """
                INSERT INTO complementary_investigations (workflow_id, investigation_type,
                                                        investigation_description, assigned_investigator,
                                                        priority_level, deadline_date, requested_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                supabase_client.execute_query(investigation_query, investigation_data)
            
            # Si action légale, créer la procédure
            elif data['decision'] == 'legal_action':
                # Récupération du montant du cas
                case_query = """
                SELECT fc.amount_mad, fc.patient_name 
                FROM fraud_cases fc 
                JOIN detection_workflows dw ON fc.case_id = dw.case_id 
                WHERE dw.workflow_id = %s
                """
                case_result = supabase_client.execute_query(case_query, (workflow_id,))
                
                if case_result and len(case_result) > 0:
                    amount = case_result[0]['amount_mad']
                    patient_name = case_result[0]['patient_name']
                    
                    legal_data = (
                        workflow_id,
                        None,  # case_id sera récupéré via le workflow
                        'warning',
                        data.get('assigned_bailiff', 'Huissier BENALI'),
                        'Étude BENALI & Associés',
                        '+212 522 123 456',
                        patient_name,
                        'Adresse à déterminer',
                        amount,
                        f'Procédure de recouvrement pour fraude détectée - Montant: {amount} MAD',
                        data['validator_name']
                    )
                    
                    legal_query = """
                    INSERT INTO legal_procedures (workflow_id, case_id, procedure_type,
                                                assigned_bailiff, bailiff_office, bailiff_contact,
                                                target_person, target_address, amount_to_recover,
                                                procedure_description, assigned_at)
                    VALUES (%s, (SELECT case_id FROM detection_workflows WHERE workflow_id = %s), 
                            %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                    """
                    supabase_client.execute_query(legal_query, (workflow_id, workflow_id) + legal_data[2:])
            
            return jsonify({
                'success': True,
                'validation_id': validation_id,
                'workflow_status': new_status,
                'message': f'Validation completed: {data["decision"]}'
            })
        else:
            return jsonify({'error': 'Failed to create validation'}), 500
            
    except Exception as e:
        logger.error(f"Error validating workflow: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/status/<int:workflow_id>', methods=['GET'])
def get_workflow_status(workflow_id):
    """Récupération du statut complet d'un workflow"""
    try:
        # Récupération du workflow principal
        workflow_query = """
        SELECT dw.*, fc.patient_name, fc.doctor_name, fc.amount_mad
        FROM detection_workflows dw
        LEFT JOIN fraud_cases fc ON dw.case_id = fc.case_id
        WHERE dw.workflow_id = %s
        """
        
        workflow = supabase_client.execute_query(workflow_query, (workflow_id,))
        
        if not workflow or len(workflow) == 0:
            return jsonify({'error': 'Workflow not found'}), 404
        
        workflow_data = dict(workflow[0])
        
        # Récupération des étapes
        steps_query = """
        SELECT * FROM workflow_steps 
        WHERE workflow_id = %s 
        ORDER BY step_number
        """
        steps = supabase_client.execute_query(steps_query, (workflow_id,))
        workflow_data['steps'] = [dict(step) for step in (steps or [])]
        
        # Récupération des documents
        docs_query = """
        SELECT * FROM injected_documents 
        WHERE workflow_id = %s 
        ORDER BY uploaded_at DESC
        """
        docs = supabase_client.execute_query(docs_query, (workflow_id,))
        workflow_data['documents'] = [dict(doc) for doc in (docs or [])]
        
        # Récupération des scores
        scores_query = """
        SELECT * FROM detection_scores 
        WHERE workflow_id = %s 
        ORDER BY calculated_at DESC
        """
        scores = supabase_client.execute_query(scores_query, (workflow_id,))
        workflow_data['scores'] = [dict(score) for score in (scores or [])]
        
        # Récupération des validations
        validations_query = """
        SELECT * FROM workflow_validations 
        WHERE workflow_id = %s 
        ORDER BY validated_at DESC
        """
        validations = supabase_client.execute_query(validations_query, (workflow_id,))
        workflow_data['validations'] = [dict(validation) for validation in (validations or [])]
        
        return jsonify({
            'success': True,
            'data': workflow_data
        })
        
    except Exception as e:
        logger.error(f"Error getting workflow status: {e}")
        return jsonify({'error': str(e)}), 500

@workflow_bp.route('/active', methods=['GET'])
def get_active_workflows():
    """Récupération des workflows actifs"""
    try:
        query = """
        SELECT dw.workflow_id, dw.case_id, dw.workflow_status, dw.current_step,
               dw.total_steps, dw.priority_level, dw.assigned_to, dw.assigned_role,
               dw.initiated_at, fc.patient_name, fc.doctor_name, fc.amount_mad
        FROM detection_workflows dw
        LEFT JOIN fraud_cases fc ON dw.case_id = fc.case_id
        WHERE dw.workflow_status NOT IN ('completed', 'rejected', 'closed')
        ORDER BY dw.priority_level DESC, dw.initiated_at DESC
        LIMIT 20
        """
        
        workflows = supabase_client.execute_query(query)
        
        if workflows is not None:
            workflows_list = [dict(workflow) for workflow in workflows]
            return jsonify({
                'success': True,
                'data': workflows_list,
                'total': len(workflows_list)
            })
        else:
            return jsonify({'error': 'Failed to fetch workflows'}), 500
            
    except Exception as e:
        logger.error(f"Error fetching active workflows: {e}")
        return jsonify({'error': str(e)}), 500

