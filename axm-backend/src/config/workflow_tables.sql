-- Création des tables de workflow (sans les index)

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
    workflow_status VARCHAR(50) DEFAULT 'initiated',
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 7,
    initiated_by VARCHAR(100),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    priority_level VARCHAR(20) DEFAULT 'medium',
    assigned_to VARCHAR(100),
    assigned_role VARCHAR(50),
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
    step_status VARCHAR(50) DEFAULT 'pending',
    agent_type VARCHAR(100),
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
    document_type VARCHAR(100) NOT NULL,
    original_filename VARCHAR(500),
    file_path VARCHAR(500),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    ocr_text TEXT,
    extracted_data JSONB,
    processing_status VARCHAR(50) DEFAULT 'uploaded',
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
    validator_role VARCHAR(50) NOT NULL,
    validation_type VARCHAR(100) NOT NULL,
    decision VARCHAR(50) NOT NULL,
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
    investigation_type VARCHAR(100) NOT NULL,
    investigation_description TEXT NOT NULL,
    assigned_investigator VARCHAR(100),
    priority_level VARCHAR(20) DEFAULT 'medium',
    deadline_date DATE,
    status VARCHAR(50) DEFAULT 'assigned',
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
    procedure_type VARCHAR(100) NOT NULL,
    assigned_bailiff VARCHAR(100) NOT NULL,
    bailiff_office VARCHAR(200),
    bailiff_contact VARCHAR(100),
    target_person VARCHAR(100) NOT NULL,
    target_address TEXT,
    amount_to_recover DECIMAL(12,2),
    procedure_description TEXT,
    status VARCHAR(50) DEFAULT 'assigned',
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
    config_category VARCHAR(100) NOT NULL,
    config_key VARCHAR(200) NOT NULL,
    config_value TEXT NOT NULL,
    config_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(config_category, config_key)
);

