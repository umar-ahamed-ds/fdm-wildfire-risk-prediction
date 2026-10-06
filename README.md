🔥Wildfire Risk Prediction System

A machine-learning-based wildfire ignition risk prediction system developed as an FDM Mini Project.

The system uses environmental and geographical conditions to estimate the probability of wildfire ignition using a trained **XGBoost classification model**. The predicted probability is converted into an easy-to-understand wildfire risk category and presented through a user-friendly web application.

---

## 📌 Project Overview

Wildfire ignition can be influenced by several environmental and geographical conditions such as temperature, humidity, precipitation, wind speed, fuel moisture and atmospheric dryness.

This project develops an end-to-end machine learning system that:

- Accepts geographical and environmental conditions from the user
- Validates the provided inputs
- Processes the required model features
- Uses a trained XGBoost model to predict wildfire ignition probability
- Converts the probability into a risk category
- Provides risk-related guidance
- Stores prediction records in MongoDB Atlas
- Displays prediction history
- Generates downloadable assessment reports

The system is intended to support wildfire preparedness and risk assessment rather than replace official emergency or environmental assessments.

---

## 🎯 Prediction Objective

The objective is to estimate the probability of wildfire ignition based on historical environmental and geographical conditions.

The target variable is:

| Value | Meaning |
|---|---|
| `0` | No wildfire ignition |
| `1` | Wildfire ignition |

The XGBoost model generates a probability for wildfire ignition.

The application then converts the probability into the following risk categories:

| Probability | Risk Level |
|---|---|
| `0%` | No Risk |
| `>0% – 30%` | Low Risk |
| `31% – 70%` | Medium Risk |
| `71% – 100%` | High Risk |

These risk categories are application-level classifications based on the model probability.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ React + TypeScript   │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
                         REST API Request
                               │
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │  Input Validation │      │  XGBoost Model   │
        │    (Pydantic)     │      │                  │
        └──────────────────┘      └────────┬─────────┘
                                           │
                                           ▼
                                  Wildfire Probability
                                           │
                                           ▼
                                  Risk Classification
                                           │
                         ┌─────────────────┴─────────────────┐
                         │                                   │
                         ▼                                   ▼
                ┌──────────────────┐              ┌──────────────────┐
                │   MongoDB Atlas  │              │ React Frontend   │
                │ Prediction History│              │ Prediction Result│
                └──────────────────┘              └──────────────────┘
```

---

# 🧠 Machine Learning

## Algorithm

The final machine learning model is **XGBoost (Extreme Gradient Boosting)**.

XGBoost is an ensemble learning algorithm based on decision trees. Multiple trees are built sequentially, where each new tree attempts to improve the errors made by previous trees.

It was selected because it performs well on structured/tabular datasets and can model complex relationships between environmental variables.

## Final Model

The trained model is stored as:

```text
ml/models/xgboost_final.joblib
```

The corresponding feature layout is stored as:

```text
ml/models/xgboost_feature_names.joblib
```

---

# 📊 Model Features

The final model uses 20 features.

### Geographical Features

- Latitude
- Longitude

### Weather Features

- Precipitation
- Relative Humidity Maximum
- Relative Humidity Minimum
- Specific Humidity
- Solar Radiation
- Minimum Temperature
- Maximum Temperature
- Wind Speed

### Fire / Fuel Features

- Burning Index
- Fuel Moisture 100hr
- Fuel Moisture 1000hr
- Energy Release Component

### Atmospheric Features

- Reference Evapotranspiration
- Potential Evapotranspiration
- Vapor Pressure Deficit

### Date Features

- Year
- Month
- Day of Year

The user provides the assessment date, and the backend derives the required date features automatically.

---

# 🖥️ Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- Axios
- React Hook Form
- Recharts

## Backend

- Python
- FastAPI
- Pydantic
- Pandas
- XGBoost
- Joblib
- Uvicorn

## Database

- MongoDB Atlas
- PyMongo

## Machine Learning

- XGBoost
- Scikit-learn
- Pandas
- NumPy

---

# 📁 Project Structure

```text
fdm-mini-project/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── prediction.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   ├── ml/
│   │   │   └── predictor.py
│   │   ├── schemas/
│   │   │   └── prediction.py
│   │   ├── services/
│   │   │   └── prediction_service.py
│   │   └── main.py
│   ├── tests/
│   │   └── test_prediction.py
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── ml/
│   ├── models/
│   │   ├── xgboost_final.joblib
│   │   └── xgboost_feature_names.joblib
│   ├── notebooks/
│   │   ├── 01_data_understanding.ipynb
│   │   ├── 02_data_preprocessing.ipynb
│   │   ├── 03_data_preparation.ipynb
│   │   ├── 04_decision_tree.ipynb
│   │   ├── 04_logistic_regression.ipynb
│   │   ├── 04_random_forest.ipynb
│   │   └── 04_xgboost_model.ipynb
│   └── ...
│
├── data/
├── docs/
├── .gitignore
└── README.md
```

---

# 🔌 Backend API

The backend provides REST API endpoints for prediction, history, reports and system health.

## API Documentation

When the backend is running:

```text
http://127.0.0.1:8000/docs
```

FastAPI provides an interactive Swagger interface for testing the API.

## Main Endpoints

### Predict Wildfire Risk

```http
POST /api/v1/predictions
```

Receives environmental and geographical conditions and returns the wildfire prediction.

### Get Prediction History

```http
GET /api/v1/predictions
```

Returns previously saved prediction records.

### Get Individual Prediction

```http
GET /api/v1/predictions/{prediction_id}
```

Returns a specific prediction.

### Download Prediction Report

```http
GET /api/v1/predictions/{prediction_id}/report
```

Returns the assessment report for a prediction.

### Health Check

```http
GET /health
```

Checks whether the backend is running.

### Database Health

```http
GET /api/database-health
```

Checks the MongoDB connection.

---

# 🚀 Running the Project

## Backend Setup

Navigate to the backend:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=wildfire_prediction
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```powershell
npm start
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Create the frontend `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```powershell
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Prediction Workflow

```text
1. User opens the application
          ↓
2. User selects "Predict Wildfire Risk"
          ↓
3. User enters location and environmental conditions
          ↓
4. Frontend validates the input
          ↓
5. Frontend sends POST request
          ↓
6. FastAPI validates the request
          ↓
7. Backend prepares the 20 model features
          ↓
8. Trained XGBoost model is loaded
          ↓
9. Model generates wildfire probability
          ↓
10. Probability is converted to risk level
          ↓
11. Prediction is saved to MongoDB Atlas
          ↓
12. Result is returned to React
          ↓
13. Prediction result is displayed
          ↓
14. User can download the assessment report
```

---

# 🧪 Input Validation

The system validates inputs on both the frontend and backend.

Examples include:

- Latitude between `-90` and `90`
- Longitude between `-180` and `180`
- Relative humidity between `0` and `100`
- Non-negative precipitation
- Non-negative wind speed
- Required environmental fields
- Valid assessment date

Invalid input is rejected before prediction is performed.

---

# 📈 Prediction Output

A prediction response contains information such as:

```json
{
  "probability": 0.765,
  "percentage": 76.5,
  "risk_level": "High Risk",
  "model_name": "XGBoost",
  "assessment_date": "2026-10-05",
  "location": {
    "latitude": 7.29,
    "longitude": 80.63
  }
}
```

The frontend presents the result using:

- Risk probability
- Risk level
- Risk gauge
- Location
- Assessment date
- Risk guidance
- Environmental summary
- Prediction ID

---

# 🗄️ MongoDB Integration

MongoDB Atlas is used to store prediction records.

Stored information includes:

- Prediction ID
- User-provided environmental conditions
- Latitude
- Longitude
- Assessment date
- Prediction probability
- Risk level
- Model information
- Prediction metadata

The stored records are used by the Prediction History feature.

---

# 📄 Assessment Reports

The system provides downloadable prediction assessment reports.

A report can contain:

- Prediction details
- Location
- Assessment date
- Environmental conditions
- Predicted probability
- Risk level
- Risk guidance
- Model information

Reports can be downloaded from the prediction result and prediction history.

---

# 🧪 System Testing

The backend includes automated tests using `pytest`.

Testing covers areas such as:

- API health checks
- Input validation
- Risk classification
- Prediction functionality
- Model integration
- End-to-end prediction flow

Run tests using:

```powershell
pytest
```

---

# ⚠️ Limitations

- The prediction is based on historical patterns learned by the machine learning model.
- The system does not guarantee that a wildfire will or will not occur.
- It does not replace official wildfire warnings or professional environmental assessments.
- Prediction quality depends on the quality and representativeness of the training data.
- Environmental conditions entered by the user may differ from actual conditions.
- The current system does not provide live wildfire detection.

---

# 🔮 Future Improvements

Possible future improvements include:

- Integration with live weather data
- Satellite-based wildfire monitoring
- Interactive geographical risk maps
- Real-time environmental data
- Automated alerts for high-risk conditions
- Improved location identification through reverse geocoding
- Model retraining using newer wildfire datasets
- Explainable AI for understanding important prediction factors
- Deployment to a cloud environment

---

# 👥 Project

**FDM Mini Project – Wildfire Risk Prediction System**

Developed as part of the **Fundamentals of Data Mining (FDM)** module.

### Technology Focus

```text
Machine Learning
Data Mining
XGBoost
React
FastAPI
MongoDB Atlas
```

---

## ⚠️ Disclaimer

This system provides a **machine-learning-based estimate of wildfire ignition probability** for educational and analytical purposes.

It should not be used as a replacement for official emergency warnings, professional wildfire assessments, or disaster-management authorities.

---

**FDM Wildfire Risk Prediction System © 2026**
'''
