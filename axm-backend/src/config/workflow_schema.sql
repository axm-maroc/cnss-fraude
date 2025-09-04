-- Schéma de base de données pour le workflow actif AXM CNSS
-- Tables pour la gestion complète du processus de détection de fraude

-- Table des protocoles thérapeutiques (paramétrage)
CREATE TABLE IF NOT EXISTS therapeutic_protocols (
    protocol_id SERIAL PRIMARY KEY,
    pathology_name VARCHAR(200) NOT NULL,
    medication_name VARCHAR(200) NOT NULL,
    standard_dosage VARCHAR(100),
    max_monthly_quantity INTEGER,
    max_annual_quantity INTEGER,
    unit_price_mad DECIMAL(10,2),
    risk_threshold_score INTEGER DEFAULT 70,
    requires_specialist BOOLEAN DEFAULT FALSE,
    specialist_type VARCHAR(100),
    max_duration_days INTEGER,
    contraindications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des workflows de détection
CREATE TABLE IF NOT EXISTS detection_workflows (
    workflow_id SERIAL PRIMARY KEY,
    case_id VARCHAR(20) REFERENCES fraud_cases(case_id),
    workflow_status VARCHAR(50) DEFAULT 'initiated', -- initiated, processing, agent_review, medical_review, investigation, legal_action, closed
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 7,
    initiated_by VARCHAR(100),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    priority_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    assigned_to VARCHAR(100),
    assigned_role VARCHAR(50), -- agent, doctor, investigator, bailiff
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des étapes de workflow
CREATE TABLE IF NOT EXISTS workflow_steps (
    step_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES detection_workflows(workflow_id),
    step_number INTEGER NOT NULL,
    step_name VARCHAR(200) NOT NULL,
    step_description TEXT,
    step_status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, skipped, failed
    agent_type VARCHAR(100), -- collection, behavioral, relational, temporal, scoring
    agent_result JSONB,
    score_generated INTEGER,
    processing_time_seconds INTEGER,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des documents injectés
CREATE TABLE IF NOT EXISTS injected_documents (
    document_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES detection_workflows(workflow_id),
    document_type VARCHAR(100) NOT NULL, -- prescription, medical_report, invoice, identity_card, etc.
    original_filename VARCHAR(500),
    file_path VARCHAR(500),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    ocr_text TEXT,
    extracted_data JSONB,
    processing_status VARCHAR(50) DEFAULT 'uploaded', -- uploaded, processing, processed, failed
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Table des scores de détection
CREATE TABLE IF NOT EXISTS detection_scores (
    score_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES detection_workflows(workflow_id),
    case_id VARCHAR(20) REFERENCES fraud_cases(case_id),
    agent_type VARCHAR(100) NOT NULL,
    score_value INTEGER NOT NULL CHECK (score_value >= 0 AND score_value <= 100),
    score_details JSONB,
    risk_factors JSONB,
    confidence_level DECIMAL(5,2),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    algorithm_version VARCHAR(20) DEFAULT '1.0'
);

-- Table des validations et décisions
CREATE TABLE IF NOT EXISTS workflow_validations (
    validation_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES detection_workflows(workflow_id),
    validator_name VARCHAR(100) NOT NULL,
    validator_role VARCHAR(50) NOT NULL, -- agent, doctor, investigator
    validation_type VARCHAR(100) NOT NULL, -- approve, reject, request_investigation, escalate_legal
    decision VARCHAR(50) NOT NULL, -- approved, rejected, investigation_required, legal_action
    justification TEXT,
    recommended_action VARCHAR(200),
    next_assignee VARCHAR(100),
    next_assignee_role VARCHAR(50),
    validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des investigations complémentaires
CREATE TABLE IF NOT EXISTS complementary_investigations (
    investigation_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES detection_workflows(workflow_id),
    investigation_type VARCHAR(100) NOT NULL, -- field_audit, medical_expertise, document_verification
    investigation_description TEXT NOT NULL,
    assigned_investigator VARCHAR(100),
    priority_level VARCHAR(20) DEFAULT 'medium',
    deadline_date DATE,
    status VARCHAR(50) DEFAULT 'assigned', -- assigned, in_progress, completed, cancelled
    findings TEXT,
    evidence_documents JSONB,
    cost_mad DECIMAL(10,2),
    requested_by VARCHAR(100),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Table des procédures d'avertissement (huissiers)
CREATE TABLE IF NOT EXISTS legal_procedures (
    procedure_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES detection_workflows(workflow_id),
    case_id VARCHAR(20) REFERENCES fraud_cases(case_id),
    procedure_type VARCHAR(100) NOT NULL, -- warning, formal_notice, legal_action, recovery
    assigned_bailiff VARCHAR(100) NOT NULL,
    bailiff_office VARCHAR(200),
    bailiff_contact VARCHAR(100),
    target_person VARCHAR(100) NOT NULL,
    target_address TEXT,
    amount_to_recover DECIMAL(12,2),
    procedure_description TEXT,
    status VARCHAR(50) DEFAULT 'assigned', -- assigned, in_progress, served, completed, failed
    served_date DATE,
    response_deadline DATE,
    response_received BOOLEAN DEFAULT FALSE,
    response_details TEXT,
    recovery_amount DECIMAL(12,2),
    fees_mad DECIMAL(10,2),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Table des configurations système
CREATE TABLE IF NOT EXISTS system_configurations (
    config_id SERIAL PRIMARY KEY,
    config_category VARCHAR(100) NOT NULL, -- scoring, thresholds, notifications
    config_key VARCHAR(200) NOT NULL,
    config_value TEXT NOT NULL,
    config_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(config_category, config_key)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_workflows_status ON detection_workflows(workflow_status);
CREATE INDEX IF NOT EXISTS idx_workflows_assigned ON detection_workflows(assigned_to, assigned_role);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow ON workflow_steps(workflow_id, step_number);
CREATE INDEX IF NOT EXISTS idx_documents_workflow ON injected_documents(workflow_id);
CREATE INDEX IF NOT EXISTS idx_scores_workflow ON detection_scores(workflow_id, agent_type);
CREATE INDEX IF NOT EXISTS idx_validations_workflow ON workflow_validations(workflow_id);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON complementary_investigations(status);
CREATE INDEX IF NOT EXISTS idx_legal_procedures_bailiff ON legal_procedures(assigned_bailiff, status);
CREATE INDEX IF NOT EXISTS idx_protocols_medication ON therapeutic_protocols(medication_name);

-- Insertion des protocoles thérapeutiques de base
INSERT INTO therapeutic_protocols (pathology_name, medication_name, standard_dosage, max_monthly_quantity, max_annual_quantity, unit_price_mad, risk_threshold_score, requires_specialist, specialist_type, max_duration_days) VALUES
('Polyarthrite rhumatoïde', 'Humira (Adalimumab)', '40mg/0.8ml', 2, 24, 2500.00, 85, TRUE, 'Rhumatologue', 365),
('Polyarthrite rhumatoïde', 'Methotrexate', '15mg', 4, 48, 45.00, 70, TRUE, 'Rhumatologue', 365),
('Maladie de Crohn', 'Remicade (Infliximab)', '100mg', 1, 8, 3200.00, 90, TRUE, 'Gastro-entérologue', 365),
('Psoriasis sévère', 'Stelara (Ustekinumab)', '45mg/0.5ml', 1, 4, 4500.00, 95, TRUE, 'Dermatologue', 365),
('Hépatite C', 'Sovaldi (Sofosbuvir)', '400mg', 28, 84, 850.00, 80, TRUE, 'Hépatologue', 84),
('Cancer du sein', 'Herceptin (Trastuzumab)', '440mg', 3, 18, 5200.00, 95, TRUE, 'Oncologue', 365),
('Diabète type 2', 'Lantus (Insuline glargine)', '100UI/ml', 5, 60, 120.00, 60, FALSE, NULL, 365),
('Hypertension', 'Cozaar (Losartan)', '50mg', 30, 360, 25.00, 50, FALSE, NULL, 365),
('Asthme sévère', 'Xolair (Omalizumab)', '150mg', 2, 24, 1800.00, 85, TRUE, 'Pneumologue', 365),
('Sclérose en plaques', 'Tysabri (Natalizumab)', '300mg', 1, 12, 6500.00, 95, TRUE, 'Neurologue', 365)
ON CONFLICT DO NOTHING;

-- Insertion des configurations système de base
INSERT INTO system_configurations (config_category, config_key, config_value, config_description) VALUES
('scoring', 'fraud_threshold_high', '85', 'Seuil de score pour fraude probable élevée'),
('scoring', 'fraud_threshold_medium', '70', 'Seuil de score pour fraude probable moyenne'),
('scoring', 'fraud_threshold_low', '50', 'Seuil de score pour fraude possible'),
('workflow', 'auto_assign_high_risk', 'true', 'Assignation automatique des cas à haut risque'),
('workflow', 'max_processing_time_hours', '48', 'Temps maximum de traitement en heures'),
('notifications', 'email_alerts_enabled', 'true', 'Activation des alertes email'),
('legal', 'bailiff_assignment_threshold', '100000', 'Montant minimum pour assignation huissier (MAD)'),
('investigation', 'max_investigation_duration_days', '30', 'Durée maximum d''investigation en jours')
ON CONFLICT (config_category, config_key) DO NOTHING;

