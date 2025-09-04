"""
Configuration de la vraie connexion Supabase pour AXM CNSS
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from typing import Dict, Any, List, Optional

# Configuration de logging
logger = logging.getLogger(__name__)

class RealSupabaseClient:
    def __init__(self):
        # Configuration avec les vrais paramètres Supabase
        self.host = "aws-1-eu-north-1.pooler.supabase.com"
        self.port = 5432
        self.database = "postgres"
        self.user = "postgres.dhpszprmwkeuewmpmyiu"
        self.password = "axm@123"
        
        # Encodage URL du mot de passe pour gérer le caractère @
        import urllib.parse
        encoded_password = urllib.parse.quote(self.password, safe='')
        
        self.connection_string = f"postgresql://{self.user}:{encoded_password}@{self.host}:{self.port}/{self.database}"
        self.connection = None
        self._connect()
    
    def _connect(self):
        """Établit la connexion à la base de données"""
        try:
            self.connection = psycopg2.connect(
                self.connection_string,
                cursor_factory=RealDictCursor
            )
            logger.info("Connexion Supabase établie avec succès")
        except Exception as e:
            logger.error(f"Erreur de connexion Supabase: {e}")
            self.connection = None
    
    def is_connected(self):
        """Vérifie si la connexion est active"""
        if not self.connection:
            return False
        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            return True
        except:
            return False
    
    def execute_query(self, query: str, params: tuple = None):
        """Exécute une requête SQL"""
        if not self.is_connected():
            self._connect()
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
                cursor.close()
                return result
            else:
                self.connection.commit()
                cursor.close()
                return True
        except Exception as e:
            logger.error(f"Erreur d'exécution requête: {e}")
            if self.connection:
                self.connection.rollback()
            return None
    
    def create_tables(self):
        """Crée les tables nécessaires"""
        schema_sql = """
        -- Table des cas de fraude
        CREATE TABLE IF NOT EXISTS fraud_cases (
            case_id VARCHAR(20) PRIMARY KEY,
            case_type VARCHAR(100) NOT NULL,
            status VARCHAR(50) NOT NULL,
            complexity_score INTEGER NOT NULL,
            amount_mad DECIMAL(12,2) NOT NULL,
            detection_date TIMESTAMP NOT NULL,
            patient_name VARCHAR(100) NOT NULL,
            doctor_name VARCHAR(100) NOT NULL,
            pharmacy_name VARCHAR(100) NOT NULL,
            prescription_count INTEGER DEFAULT 1,
            document_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Table des prescriptions
        CREATE TABLE IF NOT EXISTS prescriptions (
            prescription_id SERIAL PRIMARY KEY,
            case_id VARCHAR(20) REFERENCES fraud_cases(case_id),
            medication_name VARCHAR(200) NOT NULL,
            dosage VARCHAR(100),
            quantity INTEGER,
            unit_price DECIMAL(10,2),
            total_amount DECIMAL(10,2),
            prescription_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Table des documents
        CREATE TABLE IF NOT EXISTS documents (
            document_id SERIAL PRIMARY KEY,
            case_id VARCHAR(20) REFERENCES fraud_cases(case_id),
            document_type VARCHAR(50) NOT NULL,
            document_name VARCHAR(200) NOT NULL,
            file_path VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Index pour améliorer les performances
        CREATE INDEX IF NOT EXISTS idx_fraud_cases_status ON fraud_cases(status);
        CREATE INDEX IF NOT EXISTS idx_fraud_cases_type ON fraud_cases(case_type);
        CREATE INDEX IF NOT EXISTS idx_fraud_cases_amount ON fraud_cases(amount_mad);
        CREATE INDEX IF NOT EXISTS idx_fraud_cases_date ON fraud_cases(detection_date);
        """
        
        return self.execute_query(schema_sql)
    
    def insert_fraud_cases(self):
        """Insère les cas de fraude de test"""
        cases_data = [
            ('DET_001', 'Prescription excessive', 'confirmed', 95, 18000.00, '2025-01-15 10:30:00', 'Amina BENALI', 'Dr. Ahmed TAZI', 'Pharmacie Al Andalous', 1, 3),
            ('DET_002', 'Réseau organisé', 'investigation', 98, 2300000.00, '2025-01-14 14:20:00', 'Hassan IDRISSI', 'Dr. Fatima ALAOUI', 'Pharmacie Atlas', 15, 47),
            ('DET_003', 'Usurpation identité', 'confirmed', 94, 1200000.00, '2025-01-13 09:15:00', 'Khadija BENNANI', 'Dr. Youssef ALAMI', 'Pharmacie Centrale', 8, 12),
            ('DET_004', 'Fraude temporelle', 'investigation', 92, 950000.00, '2025-01-12 16:45:00', 'Mohamed CHAKIR', 'Dr. Aicha BENALI', 'Pharmacie Moderne', 12, 8),
            ('DET_005', 'Fraude biologique', 'confirmed', 96, 1100000.00, '2025-01-11 11:30:00', 'Fatima ZAHRA', 'Dr. Omar FASSI', 'Pharmacie Santé', 6, 15),
            ('DET_006', 'Prescription fictive', 'pending', 89, 750000.00, '2025-01-10 13:20:00', 'Rachid BENNANI', 'Dr. Laila AMRANI', 'Pharmacie Espoir', 4, 6),
            ('DET_007', 'Réseau multi-régional', 'investigation', 97, 3200000.00, '2025-01-09 08:45:00', 'Nadia ALAOUI', 'Dr. Khalid TAZI', 'Pharmacie Royaume', 25, 89),
            ('DET_008', 'Fraude médicaments onéreux', 'confirmed', 93, 1800000.00, '2025-01-08 15:10:00', 'Youssef IDRISSI', 'Dr. Samira FASSI', 'Pharmacie Liberté', 7, 21),
            ('DET_009', 'Usurpation médecin', 'investigation', 91, 680000.00, '2025-01-07 12:00:00', 'Aicha CHAKIR', 'Dr. Mehdi ALAMI', 'Pharmacie Progrès', 9, 14),
            ('DET_010', 'Fraude coordonnée', 'confirmed', 95, 1450000.00, '2025-01-06 10:25:00', 'Omar BENALI', 'Dr. Zineb TAZI', 'Pharmacie Avenir', 11, 18)
        ]
        
        # Suppression des données existantes
        self.execute_query("DELETE FROM documents")
        self.execute_query("DELETE FROM prescriptions") 
        self.execute_query("DELETE FROM fraud_cases")
        
        # Insertion des nouveaux cas
        insert_query = """
        INSERT INTO fraud_cases (case_id, case_type, status, complexity_score, amount_mad, 
                               detection_date, patient_name, doctor_name, pharmacy_name, 
                               prescription_count, document_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        success_count = 0
        for case_data in cases_data:
            if self.execute_query(insert_query, case_data):
                success_count += 1
        
        logger.info(f"{success_count} cas de fraude insérés avec succès")
        return success_count
    
    def get_fraud_cases(self, limit: int = 10, offset: int = 0, filters: Dict = None):
        """Récupère les cas de fraude avec filtres"""
        query = """
        SELECT case_id, case_type, status, complexity_score, amount_mad, 
               detection_date, patient_name, doctor_name, pharmacy_name,
               prescription_count, document_count
        FROM fraud_cases
        WHERE 1=1
        """
        params = []
        
        if filters:
            if filters.get('status'):
                query += " AND status = %s"
                params.append(filters['status'])
            
            if filters.get('case_type'):
                query += " AND case_type = %s"
                params.append(filters['case_type'])
            
            if filters.get('min_amount'):
                query += " AND amount_mad >= %s"
                params.append(filters['min_amount'])
        
        query += " ORDER BY detection_date DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        return self.execute_query(query, tuple(params))
    
    def search_fraud_cases(self, search_term: str, limit: int = 10):
        """Recherche textuelle dans les cas de fraude"""
        query = """
        SELECT case_id, case_type, status, complexity_score, amount_mad, 
               detection_date, patient_name, doctor_name, pharmacy_name,
               prescription_count, document_count
        FROM fraud_cases
        WHERE case_id ILIKE %s 
           OR patient_name ILIKE %s 
           OR doctor_name ILIKE %s 
           OR pharmacy_name ILIKE %s
           OR case_type ILIKE %s
        ORDER BY detection_date DESC
        LIMIT %s
        """
        search_pattern = f"%{search_term}%"
        params = (search_pattern, search_pattern, search_pattern, search_pattern, search_pattern, limit)
        
        return self.execute_query(query, params)
    
    def get_fraud_statistics(self):
        """Récupère les statistiques globales"""
        stats_query = """
        SELECT 
            COUNT(*) as total_cases,
            COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_cases,
            SUM(amount_mad) as total_amount_mad,
            ROUND(AVG(complexity_score), 1) as avg_detection_rate
        FROM fraud_cases
        """
        
        result = self.execute_query(stats_query)
        if result and len(result) > 0:
            stats = dict(result[0])
            return {
                'total_cases': int(stats['total_cases']),
                'confirmed_cases': int(stats['confirmed_cases']),
                'total_amount_mad': float(stats['total_amount_mad'] or 0),
                'detection_rate': float(stats['avg_detection_rate'] or 0)
            }
        return {
            'total_cases': 0,
            'confirmed_cases': 0,
            'total_amount_mad': 0,
            'detection_rate': 0
        }
    
    def get_fraud_case_detail(self, case_id: str):
        """Récupère les détails d'un cas spécifique"""
        case_query = """
        SELECT * FROM fraud_cases WHERE case_id = %s
        """
        
        prescriptions_query = """
        SELECT * FROM prescriptions WHERE case_id = %s
        """
        
        documents_query = """
        SELECT * FROM documents WHERE case_id = %s
        """
        
        case = self.execute_query(case_query, (case_id,))
        prescriptions = self.execute_query(prescriptions_query, (case_id,))
        documents = self.execute_query(documents_query, (case_id,))
        
        if case and len(case) > 0:
            case_detail = dict(case[0])
            case_detail['prescriptions'] = [dict(p) for p in (prescriptions or [])]
            case_detail['documents'] = [dict(d) for d in (documents or [])]
            return case_detail
        
        return None

# Instance globale du client Supabase réel
supabase_client = RealSupabaseClient()

