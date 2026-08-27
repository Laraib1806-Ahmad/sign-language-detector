from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import base64
import cv2
import mediapipe as mp
from tensorflow.keras.models import load_model
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

app = Flask(__name__)
CORS(app)

# Model aur label encoder load karo
model = load_model("asl_model.keras")
with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

# MediaPipe setup
base_options = mp_python.BaseOptions(model_asset_path='hand_landmarker.task')
options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=1)
landmarker = vision.HandLandmarker.create_from_options(options)

print("Model and MediaPipe loaded! Server ready.")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data or "image" not in data:
            return jsonify({"detected": False, "sign": None, "confidence": 0})

        image_data = data["image"]

        # base64 string clean karo
        if "," in image_data:
            image_data = image_data.split(",")[1]

        # padding fix karo
        image_data += "=" * (4 - len(image_data) % 4)

        image_bytes = base64.b64decode(image_data)

        if len(image_bytes) == 0:
            return jsonify({"detected": False, "sign": None, "confidence": 0})

        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"detected": False, "sign": None, "confidence": 0})

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        result = landmarker.detect(mp_image)

        if result.hand_landmarks:
            row = []
            for lm in result.hand_landmarks[0]:
                row += [lm.x, lm.y, lm.z]

            input_data = np.array([row])
            prediction = model.predict(input_data, verbose=0)
            predicted_label = le.inverse_transform([np.argmax(prediction)])[0]
            confidence = float(np.max(prediction) * 100)

            return jsonify({
                "detected": True,
                "sign": predicted_label,
                "confidence": round(confidence, 1)
            })
        else:
            return jsonify({"detected": False, "sign": None, "confidence": 0})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"detected": False, "sign": None, "confidence": 0})


if __name__ == "__main__":
    app.run(debug=True, port=5000)