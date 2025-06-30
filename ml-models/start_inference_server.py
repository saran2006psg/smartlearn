"""
Start the ISL inference server
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from inference_server import app
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting ISL Inference Server...")
    logger.info("Server will be available at http://localhost:5001")
    logger.info("Endpoints:")
    logger.info("  - GET  /health - Health check")
    logger.info("  - POST /translate/text - Translate text to ISL")
    logger.info("  - POST /translate/speech - Translate speech to ISL")
    logger.info("  - POST /avatar/preview - Generate avatar preview")
    logger.info("  - GET  /models/info - Model information")
    
    app.run(host='0.0.0.0', port=5001, debug=False)