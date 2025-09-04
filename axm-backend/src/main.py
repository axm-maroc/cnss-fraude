import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.fraud_detection import fraud_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

from src.routes.ai_generative import ai_generative_bp
from src.routes.investigation import investigation_bp
from src.routes.agents_avances import agents_avances_bp
from src.routes.drill_down import drill_down_bp
from src.routes.file_upload import file_upload_bp

# Import conditionnel pour éviter les erreurs de déploiement
try:
    from src.routes.supabase_api import supabase_bp
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

try:
    from src.routes.workflow_api import workflow_bp
    WORKFLOW_AVAILABLE = True
except ImportError:
    WORKFLOW_AVAILABLE = False

try:
    from src.routes.agents_api import agents_api
    AGENTS_AVAILABLE = True
except ImportError:
    AGENTS_AVAILABLE = False

# Activation CORS pour permettre les requêtes cross-origin
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(fraud_bp, url_prefix='/api/fraud')
app.register_blueprint(ai_generative_bp, url_prefix='/api/ai')
app.register_blueprint(investigation_bp, url_prefix='/api/investigation')
app.register_blueprint(agents_avances_bp, url_prefix='/api/agents')
app.register_blueprint(drill_down_bp, url_prefix='/api/drill-down')
app.register_blueprint(file_upload_bp, url_prefix='/api/files')

# Enregistrement conditionnel
if SUPABASE_AVAILABLE:
    app.register_blueprint(supabase_bp, url_prefix='/api/supabase')

if WORKFLOW_AVAILABLE:
    app.register_blueprint(workflow_bp, url_prefix='/api/workflow')

if AGENTS_AVAILABLE:
    app.register_blueprint(agents_api)

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
