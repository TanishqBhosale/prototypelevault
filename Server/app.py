# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import model_test
import json
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Create temporary file to store the input data
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump([data], f)
        temp_filename = f.name
    
    # Get prediction using model_test
    predictions = model_test.predict_labels(
        temp_filename,
        'isolation_forest_model.joblib',
        'selector.joblib',
        'scaler.joblib'
    )
    
    return jsonify({'label': int(predictions[0])})

if __name__ == '__main__':
    app.run(debug=True)