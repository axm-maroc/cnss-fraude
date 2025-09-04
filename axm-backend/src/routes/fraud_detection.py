from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random
import time

fraud_bp = Blueprint('fraud', __name__)

# Données simulées pour la démonstration
class FraudDetectionSimulator:
    def __init__(self):
        self.agents_data = {
            "collecte": {
                "name": "Agent de Collecte",
                "status": "active",
                "transactions_per_sec": 167,
                "success_rate": 99.8,
                "last_update": datetime.now()
            },
            "comportemental": {
                "name": "Agent Comportemental", 
                "status": "active",
                "profiles_analyzed": 1247,
                "anomalies_detected": 23,
                "last_update": datetime.now()
            },
            "relationnel": {
                "name": "Agent Relationnel",
                "status": "active", 
                "networks_identified": 7,
                "connections_analyzed": 15432,
                "last_update": datetime.now()
            },
            "temporel": {
                "name": "Agent Temporel",
                "status": "active",
                "sequences_analyzed": 892,
                "suspicious_patterns": 12,
                "last_update": datetime.now()
            },
            "scoring": {
                "name": "Agent de Scoring",
                "status": "active",
                "scores_calculated": 2156,
                "alerts_generated": 47,
                "last_update": datetime.now()
            }
        }
        
        self.kpis = {
            "detection_rate": 90,
            "false_positives": 12,
            "transactions_per_min": 10000,
            "amount_detected": 300,
            "system_uptime": 99.5
        }
        
        self.alerts = [
            {
                "id": 1,
                "type": "critical",
                "title": "Réseau frauduleux détecté",
                "description": "Détection d'un réseau organisé impliquant 7 prescripteurs et 3 pharmacies",
                "score": 95,
                "amount": "2.3M MAD",
                "region": "Casablanca",
                "timestamp": datetime.now() - timedelta(minutes=5),
                "status": "open"
            },
            {
                "id": 2,
                "type": "high",
                "title": "Prescription anormale détectée",
                "description": "Volume de prescriptions 400% supérieur à la moyenne pour ce praticien",
                "score": 87,
                "amount": "450K MAD",
                "region": "Dr. M****",
                "timestamp": datetime.now() - timedelta(minutes=12),
                "status": "investigating"
            },
            {
                "id": 3,
                "type": "medium",
                "title": "Pattern temporel suspect",
                "description": "Concentration anormale de consultations en fin de journée",
                "score": 72,
                "amount": "180K MAD",
                "region": "18h-20h",
                "timestamp": datetime.now() - timedelta(minutes=25),
                "status": "open"
            }
        ]

simulator = FraudDetectionSimulator()

@fraud_bp.route('/kpis', methods=['GET'])
def get_kpis():
    """Retourne les KPIs en temps réel"""
    # Simulation de variations en temps réel
    kpis = simulator.kpis.copy()
    kpis['transactions_per_min'] = random.randint(9000, 11000)
    kpis['detection_rate'] = random.randint(88, 92)
    kpis['false_positives'] = random.randint(10, 14)
    
    return jsonify({
        "status": "success",
        "data": kpis,
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/agents', methods=['GET'])
def get_agents():
    """Retourne l'état des agents IA"""
    agents_list = []
    for agent_id, agent_data in simulator.agents_data.items():
        agent_info = agent_data.copy()
        agent_info['id'] = agent_id
        agent_info['last_update'] = agent_info['last_update'].isoformat()
        agents_list.append(agent_info)
    
    return jsonify({
        "status": "success",
        "data": agents_list,
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/agents/<agent_id>', methods=['GET'])
def get_agent_details(agent_id):
    """Retourne les détails d'un agent spécifique"""
    if agent_id not in simulator.agents_data:
        return jsonify({"status": "error", "message": "Agent not found"}), 404
    
    agent_data = simulator.agents_data[agent_id].copy()
    agent_data['last_update'] = agent_data['last_update'].isoformat()
    
    return jsonify({
        "status": "success",
        "data": agent_data,
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Retourne la liste des alertes"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    alert_type = request.args.get('type', None)
    
    alerts = simulator.alerts.copy()
    
    # Filtrage par type si spécifié
    if alert_type:
        alerts = [alert for alert in alerts if alert['type'] == alert_type]
    
    # Conversion des timestamps
    for alert in alerts:
        alert['timestamp'] = alert['timestamp'].isoformat()
    
    # Pagination simple
    start = (page - 1) * per_page
    end = start + per_page
    paginated_alerts = alerts[start:end]
    
    return jsonify({
        "status": "success",
        "data": paginated_alerts,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": len(simulator.alerts),
            "pages": (len(simulator.alerts) + per_page - 1) // per_page
        },
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/alerts/<int:alert_id>', methods=['GET'])
def get_alert_details(alert_id):
    """Retourne les détails d'une alerte spécifique"""
    alert = next((a for a in simulator.alerts if a['id'] == alert_id), None)
    if not alert:
        return jsonify({"status": "error", "message": "Alert not found"}), 404
    
    alert_data = alert.copy()
    alert_data['timestamp'] = alert_data['timestamp'].isoformat()
    
    return jsonify({
        "status": "success",
        "data": alert_data,
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/alerts/<int:alert_id>/investigate', methods=['POST'])
def investigate_alert(alert_id):
    """Marque une alerte comme en cours d'investigation"""
    alert = next((a for a in simulator.alerts if a['id'] == alert_id), None)
    if not alert:
        return jsonify({"status": "error", "message": "Alert not found"}), 404
    
    alert['status'] = 'investigating'
    
    return jsonify({
        "status": "success",
        "message": "Alert marked as investigating",
        "data": alert,
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/analytics/performance', methods=['GET'])
def get_performance_analytics():
    """Retourne les analytics de performance"""
    # Données simulées pour les graphiques
    detection_trend = []
    for i in range(30):
        date = datetime.now() - timedelta(days=29-i)
        detection_trend.append({
            "date": date.strftime("%Y-%m-%d"),
            "detection_rate": random.randint(85, 95),
            "false_positives": random.randint(8, 15),
            "transactions": random.randint(8000, 12000)
        })
    
    fraud_types = [
        {"type": "Prescriptions", "count": 35, "percentage": 35},
        {"type": "Actes médicaux", "count": 28, "percentage": 28},
        {"type": "Identité", "count": 20, "percentage": 20},
        {"type": "Réseaux", "count": 12, "percentage": 12},
        {"type": "Autres", "count": 5, "percentage": 5}
    ]
    
    regional_stats = [
        {"region": "Casablanca", "detection_rate": 85},
        {"region": "Rabat", "detection_rate": 72},
        {"region": "Marrakech", "detection_rate": 68},
        {"region": "Fès", "detection_rate": 61},
        {"region": "Tanger", "detection_rate": 55}
    ]
    
    return jsonify({
        "status": "success",
        "data": {
            "detection_trend": detection_trend,
            "fraud_types": fraud_types,
            "regional_stats": regional_stats,
            "roi_metrics": {
                "annual_gains": 127,
                "roi_percentage": 406,
                "savings": 18,
                "payback_months": 2.7
            }
        },
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/system/status', methods=['GET'])
def get_system_status():
    """Retourne l'état du système"""
    return jsonify({
        "status": "success",
        "data": {
            "system_status": "operational",
            "uptime": "99.5%",
            "active_agents": 5,
            "total_agents": 5,
            "last_update": datetime.now().isoformat(),
            "version": "1.0.0",
            "environment": "production"
        },
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/transactions/simulate', methods=['POST'])
def simulate_transaction():
    """Simule le traitement d'une transaction"""
    data = request.get_json()
    
    # Simulation du traitement par les agents
    processing_time = random.uniform(0.5, 3.0)
    time.sleep(processing_time)
    
    risk_score = random.randint(0, 100)
    is_fraud = risk_score > 70
    
    result = {
        "transaction_id": data.get('transaction_id', f"TXN_{int(time.time())}"),
        "risk_score": risk_score,
        "is_fraud": is_fraud,
        "processing_time": round(processing_time, 2),
        "agents_analysis": {
            "collecte": {"status": "completed", "score": random.randint(0, 30)},
            "comportemental": {"status": "completed", "score": random.randint(0, 30)},
            "relationnel": {"status": "completed", "score": random.randint(0, 25)},
            "temporel": {"status": "completed", "score": random.randint(0, 20)},
            "scoring": {"status": "completed", "final_score": risk_score}
        },
        "recommendation": "investigate" if is_fraud else "approve",
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify({
        "status": "success",
        "data": result,
        "timestamp": datetime.now().isoformat()
    })

@fraud_bp.route('/health', methods=['GET'])
def health_check():
    """Point de contrôle de santé de l'API"""
    return jsonify({
        "status": "healthy",
        "service": "AXM Fraud Detection API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

