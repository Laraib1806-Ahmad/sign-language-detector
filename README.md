# 🤟 SignSpeak AI — Real-Time ASL Sign Language Detector

SignSpeak AI is a full-stack application that recognizes American Sign Language (ASL) alphabet signs in real time using your webcam. A React frontend streams video frames to a Flask backend, which uses **MediaPipe** to extract hand landmarks and a **TensorFlow/Keras** neural network to classify the sign being shown.

---

## ✨ Features

- 📷 **Live webcam capture** — no upload needed, everything runs from your browser
- ✋ **21-point hand landmark detection** powered by MediaPipe's `HandLandmarker`
- 🧠 **Trained Keras classifier** that recognizes the full ASL alphabet (A–Z) plus `space` and `del`
- 📊 **Confidence score** shown for every prediction
- 📝 **Sentence builder** — save detected letters into a running sentence
- 🕒 **Prediction history** of the last 10 detected signs
- 🎨 Clean, modern React UI (Vite + custom components)

---

## 🧱 Tech Stack

| Layer      | Technology                                                |
|------------|-------------------------------------------------------------|
| Frontend   | React 18, Vite, react-icons                                 |
| Backend    | Flask, Flask-CORS                                            |
| ML / CV    | MediaPipe (HandLandmarker), TensorFlow / Keras, scikit-learn, OpenCV, NumPy |
| Model      | Feed-forward neural network trained on hand-landmark coordinates |

---

## 📁 Project Structure

```
sign_language/
├── backend/
│   ├── app.py                  # Flask API — receives frames, runs detection + prediction
│   ├── asl_model.keras         # Trained Keras classification model
│   ├── label_encoder.pkl       # scikit-learn LabelEncoder for sign labels
│   ├── hand_landmarker.task    # MediaPipe hand landmark detection model
│   ├── landmarks_dataset.csv   # Training dataset (21 landmarks × x,y,z + label)
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Camera.jsx      # Webcam capture + calls backend /predict endpoint
│   │   │   ├── Prediction.jsx  # Displays predicted letter + confidence
│   │   │   ├── BottomCards.jsx # Instructions, history, sentence builder
│   │   │   ├── Navbar.jsx
│   │   │   └── DemoModal.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ How It Works

1. The **Camera** component captures a frame from the webcam every interval and sends it as a base64-encoded JPEG to the Flask backend (`POST /predict`).
2. The backend decodes the image and runs **MediaPipe HandLandmarker** to extract 21 hand landmarks (x, y, z coordinates → 63 features).
3. The 63 features are fed into the trained **Keras model**, which outputs a probability distribution over the sign classes.
4. The predicted label is decoded back to a letter using the saved `LabelEncoder`, and the letter + confidence score are returned to the frontend.
5. The frontend displays the prediction, updates the rolling history, and lets the user append confirmed letters into a sentence.

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10–3.12** (TensorFlow does not yet support all 3.13 features — if you hit install issues on 3.13, use 3.11)
- **Node.js 18+** and npm
- A webcam-enabled device and a modern browser (Chrome/Edge recommended for `getUserMedia`)

### 1. Clone the repository

```bash
git clone https://github.com/Laraib1806-Ahmad/sign-language-detector.git
cd sign-language-detector
```

### 2. Backend setup (Flask + ML)

```bash
cd backend
python -m venv .venv

# Activate the virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

The API will start on **http://127.0.0.1:5000**.

### 3. Frontend setup (React + Vite)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

> ⚠️ The frontend currently calls the backend at a hardcoded `http://127.0.0.1:5000/predict` (see `frontend/src/components/Camera.jsx`). If you deploy the backend elsewhere, update this URL or move it into a `.env` variable (e.g. `VITE_API_URL`).

### 4. Use it

1. Open the app in your browser and allow camera access.
2. Click **Start** to begin streaming frames.
3. Hold up an ASL sign — the detected letter and confidence appear in real time.
4. Use **Save** to append the current letter to your sentence, and **Clear** to reset.

---

## 🧠 Model & Dataset

- `landmarks_dataset.csv` contains 63 numeric features (21 landmarks × x, y, z) per row plus a `label` column, covering the letters **A–Z**, `space`, and `del`.
- `asl_model.keras` is the trained classifier loaded by the backend at startup.
- `label_encoder.pkl` maps the model's numeric output back to the original letter/label.

If you want to retrain the model, you'll need to add a training script (e.g. `train.py`) that:
1. Loads `landmarks_dataset.csv`
2. Splits into train/test sets
3. Trains a classifier (e.g. a small dense neural network)
4. Fits and saves a `LabelEncoder` on the `label` column
5. Saves the model with `model.save("asl_model.keras")`

*(Not included in this repo — add your own script under `backend/` if you plan to retrain.)*

---

## 🔌 API Reference

### `POST /predict`

**Request body:**
```json
{
  "image": "data:image/jpeg;base64,<base64-encoded-frame>"
}
```

**Response:**
```json
{
  "detected": true,
  "sign": "A",
  "confidence": 97.3
}
```

If no hand is detected or an error occurs, `detected` is `false` and `sign` is `null`.

---

## 🗺️ Roadmap / Ideas

- [ ] Move the backend URL into an environment variable for the frontend
- [ ] Add a `train.py` script for reproducible model training
- [ ] Support word/phrase-level (dynamic gesture) recognition, not just static letters
- [ ] Add unit tests for the Flask API
- [ ] Dockerize backend + frontend for easier deployment
- [ ] Deploy a hosted demo

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [MediaPipe](https://developers.google.com/mediapipe) for hand landmark detection
- [TensorFlow / Keras](https://www.tensorflow.org/) for the classification model
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) for the frontend tooling
