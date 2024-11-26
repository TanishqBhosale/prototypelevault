import json
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

def load_data(filename):
    """Load and parse JSON data"""
    with open(filename, 'r') as f:
        data = json.load(f)
    return data

def extract_advanced_features(data):
    """Extract features with consistent number of features (18)"""
    features = []
    for entry in data:
        # Mouse features
        mouse_path = entry['mousePath']
        mouse_x = [p['x'] for p in mouse_path]
        mouse_y = [p['y'] for p in mouse_path]
        
        # Calculate velocities and accelerations
        velocities_x = np.diff(mouse_x)
        velocities_y = np.diff(mouse_y)
        accelerations_x = np.diff(velocities_x) if len(velocities_x) > 1 else [0]
        accelerations_y = np.diff(velocities_y) if len(velocities_y) > 1 else [0]
        
        # Keystroke features
        keystrokes = entry['keystrokes']
        hold_durations = [k['hold_duration'] for k in keystrokes if 'hold_duration' in k]
        
        # Calculate basic statistics
        feature_vector = [
            np.mean(mouse_x),
            np.std(mouse_x),
            np.mean(mouse_y),
            np.std(mouse_y),
            np.mean(velocities_x),
            np.std(velocities_x),
            np.mean(velocities_y),
            np.std(velocities_y),
            np.mean(accelerations_x),
            np.std(accelerations_x),
            np.mean(accelerations_y),
            np.std(accelerations_y),
            len(mouse_path),
            np.mean(hold_durations) if hold_durations else 0,
            np.std(hold_durations) if hold_durations else 0,
            max(hold_durations) if hold_durations else 0,
            min(hold_durations) if hold_durations else 0,
            len(keystrokes)
        ]
        features.append(feature_vector)
    return np.array(features)

def predict_labels(input_filename, model_filename, selector_filename, scaler_filename):
    # Load the saved model, selector, and scaler
    model = joblib.load(model_filename)
    selector = joblib.load(selector_filename)
    scaler = joblib.load(scaler_filename)
    
    # Load and preprocess the input data
    input_data = load_data(input_filename)
    X_input = extract_advanced_features(input_data)
    
    # Apply feature selection and scaling
    X_input_selected = selector.transform(X_input)
    X_input_scaled = scaler.transform(X_input_selected)
    
    # Get anomaly scores
    scores = model.score_samples(X_input_scaled)
    
    # Convert scores to predictions using a dynamic threshold
    threshold = np.percentile(scores, 20)  # Adjust this percentile to control sensitivity
    predictions = (scores > threshold).astype(int)
    
    # Print detailed results
    for i, (prediction, score) in enumerate(zip(predictions, scores)):
        username = input_data[i]['username']
        print(f"Entry {i + 1}: Username: {username}")
        print(f"Anomaly Score: {score:.3f}")
        print(f"Label: {prediction}")
        print("-" * 50)
    
    # Visualize the results
    # plt.figure(figsize=(10, 6))
    # plt.scatter(range(len(scores)), scores, c=predictions, cmap='coolwarm')
    # plt.axhline(y=threshold, color='r', linestyle='--', label='Threshold')
    # plt.title('Anomaly Scores')
    # plt.xlabel('Sample Index')
    # plt.ylabel('Anomaly Score')
    # plt.legend()
    # plt.show()

    return predictions

# Example usage
predictions = predict_labels('formData_test_single.json', 'isolation_forest_model.joblib', 'selector.joblib', 'scaler.joblib')