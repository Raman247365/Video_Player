#!/usr/bin/env python3
"""
Flask API server for ML voice command detection
Provides REST API for JavaScript integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from voice_ml_engine import VoiceCommandML
import json

app = Flask(__name__)
CORS(app)

# Initialize ML engine
ml_engine = VoiceCommandML()

@app.route('/detect', methods=['POST'])
def detect_command():
    """Detect voice command from text input"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = ml_engine.detect_command(text)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch_detect', methods=['POST'])
def batch_detect():
    """Process multiple commands at once"""
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        results = [ml_engine.detect_command(text) for text in texts]
        return jsonify({'results': results})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'total_patterns': len(ml_engine.command_list)
    })

if __name__ == '__main__':
    print("Starting ML Voice Command API Server...")
    print("Server will be available at http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)