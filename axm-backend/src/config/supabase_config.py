"""
Configuration Supabase pour l'application AXM CNSS
Gestion de la connexion à la base de données Supabase
"""

import os
from supabase import create_client, Client
from typing import Optional, Dict, Any, List
import logging

# Configuration Supabase
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', 'your-anon-key')

# Configuration de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseClient:
    """Client Supabase pour l'application AXM"""
    
    def __init__(self):
        """Initialise le client Supabase"""
        try:
            self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
            logger.info("Connexion Supabase établie avec succès")
        except Exception as e:
            logger.error(f"Erreur connexion Supabase: {e}")
            # Fallback vers données simulées si Supabase indisponible
            self.client = None
    
    def is_connected(self) -> bool:
        """Vérifie si la connexion Supabase est active"""
        return self.client is not None
    
    def get_fraud_cases(self, limit: int = 50, offset: int = 0, 
                       filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Récupère les cas de fraude avec filtres et pagination
        
        Args:
            limit: Nombre maximum de résultats
            offset: Décalage pour la pagination
            filters: Filtres à appliquer (status, case_type, etc.)
        
        Returns:
            Liste des cas de fraude
        """
        if not self.is_connected():
            return self._get_mock_fraud_cases(limit, offset, filters)
        
        try:
            query = self.client.table('fraud_cases_summary').select('*')
            
            # Application des filtres
            if filters:
                if 'status' in filters and filters['status']:
                    query = query.eq('status', filters['status'])
                if 'case_type' in filters and filters['case_type']:
                    query = query.eq('case_type', filters['case_type'])
                if 'min_amount' in filters and filters['min_amount']:
                    query = query.gte('amount_mad', filters['min_amount'])
                if 'max_amount' in filters and filters['max_amount']:
                    query = query.lte('amount_mad', filters['max_amount'])
                if 'search' in filters and filters['search']:
                    search_term = f"%{filters['search']}%"
                    query = query.or_(f"case_id.ilike.{search_term},patient_name.ilike.{search_term},doctor_name.ilike.{search_term}")
            
            # Tri par date de détection (plus récent en premier)
            query = query.order('detection_date', desc=True)
            
            # Pagination
            query = query.range(offset, offset + limit - 1)
            
            result = query.execute()
            return result.data if result.data else []
            
        except Exception as e:
            logger.error(f"Erreur récupération cas de fraude: {e}")
            return self._get_mock_fraud_cases(limit, offset, filters)
    
    def get_fraud_case_detail(self, case_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère les détails complets d'un cas de fraude
        
        Args:
            case_id: Identifiant du cas
        
        Returns:
            Détails du cas ou None si non trouvé
        """
        if not self.is_connected():
            return self._get_mock_case_detail(case_id)
        
        try:
            # Récupération du cas principal
            case_result = self.client.table('fraud_cases').select('*').eq('case_id', case_id).execute()
            if not case_result.data:
                return None
            
            case = case_result.data[0]
            
            # Récupération des prescriptions associées
            prescriptions_result = self.client.table('prescriptions').select('''
                *,
                patients(*),
                doctors(*),
                pharmacies(*),
                prescription_details(*, medications(*))
            ''').eq('case_id', case['id']).execute()
            
            # Récupération des documents
            documents_result = self.client.table('documents').select('*').eq('case_id', case['id']).execute()
            
            # Récupération des détections IA
            ai_detections_result = self.client.table('ai_detections').select('*').eq('case_id', case['id']).execute()
            
            # Récupération des investigations
            investigations_result = self.client.table('investigations').select('*').eq('case_id', case['id']).execute()
            
            # Assemblage des données
            case['prescriptions'] = prescriptions_result.data if prescriptions_result.data else []
            case['documents'] = documents_result.data if documents_result.data else []
            case['ai_detections'] = ai_detections_result.data if ai_detections_result.data else []
            case['investigations'] = investigations_result.data if investigations_result.data else []
            
            return case
            
        except Exception as e:
            logger.error(f"Erreur récupération détail cas {case_id}: {e}")
            return self._get_mock_case_detail(case_id)
    
    def search_fraud_cases(self, search_term: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Recherche textuelle dans les cas de fraude
        
        Args:
            search_term: Terme de recherche
            limit: Nombre maximum de résultats
        
        Returns:
            Liste des cas correspondants
        """
        if not self.is_connected():
            return self._search_mock_cases(search_term, limit)
        
        try:
            search_pattern = f"%{search_term}%"
            
            result = self.client.table('fraud_cases_summary').select('*').or_(
                f"case_id.ilike.{search_pattern},"
                f"patient_name.ilike.{search_pattern},"
                f"doctor_name.ilike.{search_pattern},"
                f"pharmacy_name.ilike.{search_pattern},"
                f"case_type.ilike.{search_pattern}"
            ).order('detection_date', desc=True).limit(limit).execute()
            
            return result.data if result.data else []
            
        except Exception as e:
            logger.error(f"Erreur recherche cas: {e}")
            return self._search_mock_cases(search_term, limit)
    
    def get_fraud_statistics(self) -> Dict[str, Any]:
        """
        Récupère les statistiques globales de fraude
        
        Returns:
            Dictionnaire avec les statistiques
        """
        if not self.is_connected():
            return self._get_mock_statistics()
        
        try:
            # Statistiques générales
            total_cases = self.client.table('fraud_cases').select('*', count='exact').execute()
            confirmed_cases = self.client.table('fraud_cases').select('*', count='exact').eq('status', 'confirmed').execute()
            total_amount = self.client.table('fraud_cases').select('amount_mad').execute()
            
            # Statistiques par région
            region_stats = self.client.table('fraud_stats_by_region').select('*').execute()
            
            # Tendances temporelles
            trends = self.client.table('fraud_trends').select('*').limit(12).execute()
            
            total_amount_sum = sum(case['amount_mad'] for case in total_amount.data) if total_amount.data else 0
            
            return {
                'total_cases': total_cases.count if total_cases.count else 0,
                'confirmed_cases': confirmed_cases.count if confirmed_cases.count else 0,
                'total_amount_mad': total_amount_sum,
                'detection_rate': round((confirmed_cases.count / total_cases.count * 100), 1) if total_cases.count > 0 else 0,
                'region_stats': region_stats.data if region_stats.data else [],
                'trends': trends.data if trends.data else []
            }
            
        except Exception as e:
            logger.error(f"Erreur récupération statistiques: {e}")
            return self._get_mock_statistics()
    
    def _get_mock_fraud_cases(self, limit: int, offset: int, filters: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Données simulées en cas d'indisponibilité Supabase"""
        mock_cases = [
            {
                'case_id': 'DET_001',
                'case_type': 'Prescription excessive',
                'status': 'confirmed',
                'complexity_score': 95,
                'amount_mad': 18000.00,
                'detection_date': '2025-01-15T10:30:00Z',
                'patient_name': 'Amina BENALI',
                'doctor_name': 'Dr. Ahmed TAZI',
                'pharmacy_name': 'Pharmacie Al Andalous',
                'prescription_count': 1,
                'document_count': 3
            },
            {
                'case_id': 'DET_002',
                'case_type': 'Réseau organisé',
                'status': 'investigation',
                'complexity_score': 98,
                'amount_mad': 2300000.00,
                'detection_date': '2025-01-14T14:20:00Z',
                'patient_name': 'Hassan IDRISSI',
                'doctor_name': 'Dr. Fatima ALAOUI',
                'pharmacy_name': 'Pharmacie Atlas',
                'prescription_count': 15,
                'document_count': 47
            },
            {
                'case_id': 'DET_003',
                'case_type': 'Usurpation identité',
                'status': 'confirmed',
                'complexity_score': 94,
                'amount_mad': 1200000.00,
                'detection_date': '2025-01-13T16:45:00Z',
                'patient_name': 'Khadija BENNANI',
                'doctor_name': 'Dr. Youssef ALAMI',
                'pharmacy_name': 'Pharmacie Centrale',
                'prescription_count': 8,
                'document_count': 12
            }
        ]
        
        # Application des filtres simulés
        filtered_cases = mock_cases
        if filters:
            if 'search' in filters and filters['search']:
                search_term = filters['search'].lower()
                filtered_cases = [case for case in filtered_cases 
                                if search_term in case['case_id'].lower() 
                                or search_term in case['patient_name'].lower()
                                or search_term in case['doctor_name'].lower()]
        
        return filtered_cases[offset:offset + limit]
    
    def _get_mock_case_detail(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Détail simulé d'un cas"""
        if case_id == 'DET_001':
            return {
                'case_id': 'DET_001',
                'case_type': 'Prescription excessive',
                'status': 'confirmed',
                'complexity_score': 95,
                'amount_mad': 18000.00,
                'detection_date': '2025-01-15T10:30:00Z',
                'prescriptions': [
                    {
                        'prescription_id': 'PRES_001',
                        'prescription_date': '2025-01-10',
                        'total_amount_mad': 18000.00,
                        'patients': {'full_name': 'Amina BENALI', 'cin': 'BE123456'},
                        'doctors': {'full_name': 'Dr. Ahmed TAZI', 'specialty': 'Rhumatologie'},
                        'pharmacies': {'name': 'Pharmacie Al Andalous'},
                        'prescription_details': [
                            {
                                'medications': {'name': 'Humira', 'dosage': '40mg'},
                                'quantity': 12,
                                'total_price_mad': 15000.00
                            }
                        ]
                    }
                ],
                'documents': [
                    {
                        'document_id': 'DOC_001',
                        'document_type': 'Ordonnance',
                        'file_name': 'ordonnance_001.pdf',
                        'scan_quality': 'Haute'
                    }
                ],
                'ai_detections': [
                    {
                        'agent_type': 'Agent Comportemental',
                        'confidence_score': 95.5,
                        'risk_indicators': ['Quantité anormale', 'Fréquence excessive']
                    }
                ]
            }
        return None
    
    def _search_mock_cases(self, search_term: str, limit: int) -> List[Dict[str, Any]]:
        """Recherche simulée"""
        mock_cases = self._get_mock_fraud_cases(limit, 0, {'search': search_term})
        return mock_cases
    
    def _get_mock_statistics(self) -> Dict[str, Any]:
        """Statistiques simulées"""
        return {
            'total_cases': 127,
            'confirmed_cases': 89,
            'total_amount_mad': 12300000.00,
            'detection_rate': 94.2,
            'region_stats': [
                {'region': 'Casablanca-Settat', 'case_count': 45, 'total_amount': 5200000},
                {'region': 'Rabat-Salé-Kénitra', 'case_count': 32, 'total_amount': 3100000},
                {'region': 'Marrakech-Safi', 'case_count': 28, 'total_amount': 2800000}
            ],
            'trends': [
                {'month': '2025-01-01', 'case_count': 127, 'total_amount': 12300000},
                {'month': '2024-12-01', 'case_count': 98, 'total_amount': 8900000}
            ]
        }

# Instance globale du client Supabase
supabase_client = SupabaseClient()

