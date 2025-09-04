"""
Client Supabase mock pour le déploiement sans psycopg2
"""

import logging
from typing import Dict, Any, List, Optional
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class MockSupabaseClient:
    def __init__(self):
        self.connected = True
        logger.info("MockSupabaseClient initialisé")
    
    def is_connected(self):
        return self.connected
    
    def execute_query(self, query, params=None):
        """Simulation d'exécution de requête"""
        try:
            # Simulation de données pour différents types de requêtes
            if "fraud_cases" in query and "SELECT" in query.upper():
                return self._get_mock_fraud_cases()
            elif "therapeutic_protocols" in query and "SELECT" in query.upper():
                return self._get_mock_protocols()
            elif "detection_workflows" in query and "SELECT" in query.upper():
                return self._get_mock_workflows()
            elif "COUNT(*)" in query:
                return [{"count": 127}]
            elif "INSERT" in query.upper() or "UPDATE" in query.upper() or "CREATE" in query.upper():
                return True
            else:
                return []
        except Exception as e:
            logger.error(f"Erreur simulation requête: {e}")
            return None
    
    def _get_mock_fraud_cases(self):
        """Données simulées de cas de fraude"""
        return [
            {
                "case_id": "DET_127",
                "patient_name": "Aicha FASSI",
                "doctor_name": "Dr. Rachid BENALI",
                "pharmacy_name": "Pharmacie Al Andalous",
                "amount_mad": 3345217,
                "status": "resolved",
                "risk_score": 95,
                "detection_date": "2025-01-15",
                "fraud_type": "temporal"
            },
            {
                "case_id": "DET_116", 
                "patient_name": "Rachid ALAMI",
                "doctor_name": "Dr. Fatima ZAHRA",
                "pharmacy_name": "Pharmacie Atlas",
                "amount_mad": 3341770,
                "status": "pending",
                "risk_score": 87,
                "detection_date": "2025-01-14",
                "fraud_type": "prescription"
            },
            {
                "case_id": "DET_112",
                "patient_name": "Rachid ALAMI", 
                "doctor_name": "Dr. Ahmed TAZI",
                "pharmacy_name": "Pharmacie Centrale",
                "amount_mad": 2104161,
                "status": "pending",
                "risk_score": 92,
                "detection_date": "2025-01-13",
                "fraud_type": "network"
            },
            {
                "case_id": "DET_105",
                "patient_name": "Nadia ZAHRA",
                "doctor_name": "Dr. Youssef CHAKIR", 
                "pharmacy_name": "Pharmacie Moderne",
                "amount_mad": 1726683,
                "status": "investigation",
                "risk_score": 89,
                "detection_date": "2025-01-12",
                "fraud_type": "identity"
            },
            {
                "case_id": "DET_100",
                "patient_name": "Zineb CHAKIR",
                "doctor_name": "Dr. Hassan IDRISSI",
                "pharmacy_name": "Pharmacie Nouvelle",
                "amount_mad": 2359019,
                "status": "resolved", 
                "risk_score": 94,
                "detection_date": "2025-01-11",
                "fraud_type": "coordinated"
            }
        ]
    
    def _get_mock_protocols(self):
        """Données simulées de protocoles thérapeutiques"""
        return [
            {
                "protocol_id": 1,
                "pathology_name": "Polyarthrite rhumatoïde",
                "medication_name": "Humira (Adalimumab)",
                "standard_dosage": "40mg/0.8ml",
                "max_monthly_quantity": 2,
                "max_annual_quantity": 24,
                "unit_price_mad": 2500.00,
                "risk_threshold_score": 85,
                "requires_specialist": True,
                "specialist_type": "Rhumatologue",
                "max_duration_days": 365
            },
            {
                "protocol_id": 2,
                "pathology_name": "Maladie de Crohn",
                "medication_name": "Remicade (Infliximab)",
                "standard_dosage": "100mg",
                "max_monthly_quantity": 1,
                "max_annual_quantity": 8,
                "unit_price_mad": 3200.00,
                "risk_threshold_score": 90,
                "requires_specialist": True,
                "specialist_type": "Gastro-entérologue",
                "max_duration_days": 365
            },
            {
                "protocol_id": 3,
                "pathology_name": "Cancer du sein",
                "medication_name": "Herceptin (Trastuzumab)",
                "standard_dosage": "440mg",
                "max_monthly_quantity": 3,
                "max_annual_quantity": 18,
                "unit_price_mad": 5200.00,
                "risk_threshold_score": 95,
                "requires_specialist": True,
                "specialist_type": "Oncologue",
                "max_duration_days": 365
            }
        ]
    
    def _get_mock_workflows(self):
        """Données simulées de workflows"""
        return [
            {
                "workflow_id": 1,
                "case_id": "DET_001",
                "workflow_status": "processing",
                "current_step": 3,
                "total_steps": 7,
                "priority_level": "high",
                "assigned_to": "Dr. Sarah BENALI",
                "assigned_role": "doctor",
                "patient_name": "Amina BENALI",
                "doctor_name": "Dr. Ahmed TAZI",
                "amount_mad": 18000,
                "initiated_at": "2025-01-15T10:30:00Z"
            },
            {
                "workflow_id": 2,
                "case_id": "DET_002", 
                "workflow_status": "investigation",
                "current_step": 6,
                "total_steps": 7,
                "priority_level": "critical",
                "assigned_to": "Investigateur ALAMI",
                "assigned_role": "investigator",
                "patient_name": "Hassan IDRISSI",
                "doctor_name": "Dr. Fatima ALAOUI",
                "amount_mad": 2300000,
                "initiated_at": "2025-01-14T14:15:00Z"
            }
        ]

# Instance globale
mock_supabase_client = MockSupabaseClient()

