# Individual Component Report — Member 1: Logistic Regression Subsystem
## Wildfire Risk Prediction System
**Module**: Fundamentals of Data Mining (FDM)  
**Assigned Subsystem**: Member 1 — Logistic Regression (Baseline, Optimization, Evaluation & Interpretability)  
**Related Notebook**: [`ml/notebooks/04_logistic_regression.ipynb`](file:///c:/Users/USER/Desktop/fdm-wildfire-risk-prediction/ml/notebooks/04_logistic_regression.ipynb)  
**Exported Artifact**: [`ml/artifacts/logistic_regression_pipeline.joblib`](file:///c:/Users/USER/Desktop/fdm-wildfire-risk-prediction/ml/artifacts/)

---

# 1. Executive Summary & Member 1 Scope of Work

In this group project, the overall objective is to build an end-to-end wildfire risk prediction system. While the team shares the raw dataset, cleaning procedures, and time-based split protocol, each member is independently responsible for developing, tuning, and evaluating a distinct machine learning model family:

* **Member 1 (My Part)**: **Logistic Regression (LR)** — Linear Probabilistic Baseline & Feature Interpretability
* **Member 2**: **Decision Tree (DT)** — Single Rule-based Non-linear Baseline
* **Member 3**: **Random Forest (RF)** — Bagged Ensemble Non-linear Model
* **Member 4**: **XGBoost** — Gradient Boosted Decision Trees

### Member 1 Core Responsibilities:
1. **Model-Specific Preprocessing**: Implement zero-leakage feature standardization (`StandardScaler`), which is uniquely required for Logistic Regression (gradient-based optimization) and not required for Members 2, 3, and 4 (tree-based models).
2. **Handling Severe Class Imbalance**: Formulate class-weighted log-loss optimization (`class_weight='balanced'`) to counter the ~3.75% positive wildfire class.
3. **Validation & Tuning**: Train baseline model on historical train data ($2013–2020$), tune regularization strength $C$ on validation data ($2021–2022$), and optimize decision threshold $\tau^*$ to maximize Wildfire F1-score.
4. **Domain Interpretability**: Extract model coefficients $\beta_j$ and Odds Ratios $\exp(\beta_j)$ to provide transparent, scientifically grounded insights into environmental wildfire drivers.
5. **Fair Comparison Benchmark**: Evaluate champion configuration on held-out test data ($2023–2025$) for the Stage 7 group comparison.
6. **Backend Serialization**: Package the scaler, champion model, and optimal threshold into a production joblib pipeline for FastAPI inference.

---

# 2. Team Workflow & Member 1 Architecture

To prevent data leakage and guarantee a completely fair comparison, all members operate within the same time-series split:

```text
                           FULL PREPROCESSED DATASET
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
      2013–2020                   2021–2022                   2023–2025
        TRAIN                       VALID                       TEST
   (7,319,483 rows)            (1,326,842 rows)             (823,955 rows)
          │                           │                           │
          ▼                           ▼                           │
   ★ Member 1 Work ★           ★ Member 1 Work ★                  │
      Train LR                    Tune & Select                   │
   (Baseline + L2)             (C & Optimal tau*)                 │
          │                           │                           │
          └──────────────────────────►│                           │
                                      ▼                           │
                             Final Configuration                  │
                             (Champion LR Model)                  │
                                      │                           │
                                      ▼                           │
                               Final Evaluation ◄─────────────────┘
```

Stage 7 Fair Comparison:

```text
                                SAME TEST SET (2023–2025)
                                            │
           ┌────────────────────────────────┼────────────────────────────────┬────────────────────────────────┐
           ▼                                ▼                                ▼                                ▼
  ★ Member 1: LR ★                  Member 2: DT                     Member 3: RF                    Member 4: XGBoost
           │                                │                                │                                │
           └────────────────────────────────┼────────────────────────────────┴────────────────────────────────┘
                                            │
                                            ▼
                                     Fair Comparison
                        (ROC-AUC, PR-AUC, F1, Precision, Recall)
```

---

# 3. Mathematical Formulation (My Part: Logistic Regression)

### 3.1 Hypothesis Function
Logistic Regression models the posterior probability of a wildfire event ($Y = 1$) given the standardized feature vector $\mathbf{x} \in \mathbb{R}^{20}$:

$$P(Y = 1 \mid \mathbf{x}) = \sigma(\mathbf{w}^T \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{x} + b)}}$$

Where:
* $\mathbf{w} \in \mathbb{R}^{20}$ is the parameter vector of standardized feature weights.
* $b \in \mathbb{R}$ is the intercept term.
* $\sigma(z) = \frac{1}{1 + e^{-z}}$ is the logistic sigmoid activation mapping $(-\infty, +\infty) \to (0, 1)$.

### 3.2 Weighted Loss Function with $L_2$ Regularization
To overcome severe class imbalance and prevent coefficient divergence:

$$\mathcal{J}(\mathbf{w}, b) = -\frac{1}{N} \sum_{i=1}^N w_{y_i} \left[ y_i \ln \hat{p}_i + (1 - y_i) \ln(1 - \hat{p}_i) \right] + \frac{1}{2C} \|\mathbf{w}\|_2^2$$

* $w_{y_i} = \frac{N}{2 N_{y_i}}$ adjusts the penalty inversely proportional to class frequency.
* $C > 0$ controls the trade-off between margin size and classification error.
* Optimization is solved using the **L-BFGS quasi-Newton algorithm** for rapid second-order convergence.

---

# 4. Pipeline Node 01 — Zero-Leakage Feature Scaling (Member 1 Requirement)

## Concept & Member 1 Justification
A critical technical requirement specific to Member 1 is **feature standardization**:
* Tree-based models (Members 2, 3, 4) split data based on individual feature thresholds and are invariant to scale.
* Logistic Regression computes dot products $\mathbf{w}^T \mathbf{x}$ and penalizes the $L_2$ norm $\|\mathbf{w}\|_2^2$. Unscaled features with huge ranges (e.g., `srad` $\in [0, 440]$) will artificially dominate gradients while smaller range features (e.g., `vpd` $\in [0, 8]$) will be ignored.

## Leakage Prevention Protocol
The scaler is fitted **strictly on `X_train`** ($2013–2020$) and only transforms `X_val` ($2021–2022$) and `X_test` ($2023–2025$):

$$z = \frac{x - \mu_{train}}{\sigma_{train}}$$

```python
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled   = scaler.transform(X_val)
X_test_scaled  = scaler.transform(X_test)
```

---

# 5. Pipeline Node 02 — Class Imbalance Handling

## Observation
* Training set: $7,045,069$ non-fire ($96.25\%$) vs $274,414$ wildfire ($3.75\%$).
* Imbalance ratio: $\approx 25.7 : 1$.

## Decision
Applied `class_weight='balanced'`:
* Non-wildfire weight ($w_0$): $\approx 0.52$
* Wildfire weight ($w_1$): $\approx 13.33$

This heavily penalizes false negatives, ensuring the model actively identifies fire risk rather than trivially predicting all zeros.

---

# 6. Pipeline Node 03 — Baseline Model Training & Validation Evaluation

## Implementation
Trained initial baseline configuration:
* Penalty: $L_2$ (Ridge)
* Regularization strength: $C = 1.0$
* Solver: `lbfgs`
* Evaluated on full Validation Set ($1,326,842$ records) at default threshold $\tau = 0.50$.

## Key Metrics Evaluated
Because accuracy is misleading for imbalanced data, Member 1 tracks:
1. **ROC-AUC**: Global discriminative power across all thresholds.
2. **PR-AUC (Average Precision)**: True performance metric for rare-event detection.
3. **Precision (Class 1)**: Correctness of fire alarms.
4. **Recall (Class 1)**: Proportion of actual wildfires successfully captured.
5. **F1-Score (Class 1)**: Harmonic mean balancing precision and recall.

---

# 7. Pipeline Node 04 — Decision Threshold Optimization ($\tau^*$)

## Concept
The default threshold $\tau = 0.50$ is designed for balanced 50/50 problems. With `class_weight='balanced'`, predicted probabilities shift towards class penalties.
Furthermore, in wildfire defense, a **False Negative (missed fire)** is catastrophic, whereas a **False Positive (false alarm)** results in precautionary vigilance.

## Implementation
Conducted an exhaustive threshold sweep strictly across the validation set:

$$\tau \in [0.10, 0.90] \quad (\text{step } 0.02)$$

$$\tau^* = \arg\max_\tau F_1(\tau; y_{val}, \hat{p}_{val})$$

```python
thresholds = np.arange(0.10, 0.90, 0.02)
# sweep and compute precision, recall, F1 on y_val
best_idx = np.argmax(t_f1s)
optimal_threshold = thresholds[best_idx]
```

## Result
* Derives the empirical optimal threshold $\tau^*$ that maximizes the Wildfire F1-score and establishes a calibrated early-warning operating point.

---

# 8. Pipeline Node 05 — Hyperparameter Tuning (Regularization Strength $C$)

## Search Space
Evaluated $C \in \{0.01, 0.1, 1.0, 10.0\}$ to find the optimal trade-off between bias and variance:

| Parameter $C$ | Penalty | Regularization Intensity | Objective |
| :--- | :--- | :--- | :--- |
| **0.01** | $L_2$ | High | Heavily shrinks coefficients, prevents overfitting to weather noise |
| **0.10** | $L_2$ | Moderate | Standard conservative regularization |
| **1.00** | $L_2$ | Default | Balanced empirical loss vs weight norm |
| **10.00** | $L_2$ | Low | Allows weights to adapt closely to training data |

## Selection Rule
The configuration achieving the highest **Validation PR-AUC and ROC-AUC** is selected as Member 1's **Champion Model**.

---

# 9. Pipeline Node 06 — Feature Interpretability & Physical Fire Dynamics

A major contribution of Member 1's linear model to the group project is **full model transparency**:
* **Standardized Coefficient ($\beta_j$)**: Direct effect on wildfire log-odds per standard deviation change.
* **Odds Ratio ($\text{OR}_j = e^{\beta_j}$)**:
  * $\text{OR}_j > 1$: **Wildfire Promoter**
  * $\text{OR}_j < 1$: **Wildfire Inhibitor**

## Physical Environmental Validation
| Category | Features | Physical Impact on Wildfire Occurrence |
| :--- | :--- | :--- |
| **Top Promoters** ($\text{OR} > 1$) | Max Temperature (`tmmx`), Vapor Pressure Deficit (`vpd`), Burning Index (`bi`), Wind Speed (`vs`) | Atmospheric dryness, severe heat, and wind accelerate fuel drying and flame spread rate. |
| **Top Inhibitors** ($\text{OR} < 1$) | Fuel Moisture (`fm100`, `fm1000`), Relative Humidity (`rmax`, `rmin`), Precipitation (`pr`) | High moisture in vegetative fuel beds absorbs combustion heat, suppressing ignition. |

---

# 10. Pipeline Node 07 — Final Unseen Test Benchmark (2023–2025)

The champion model and optimal threshold $\tau^*$ are applied **once** to the held-out **Test Set ($2023–2025$, $823,955$ rows)**.
* Proves model generalization to future wildfire seasons without temporal overfitting.
* Generates Member 1's final official test metrics for the Stage 7 Fair Comparison table alongside Members 2, 3, and 4.

---

# 11. Pipeline Node 08 — Model Artifact Export & Backend Serving

Member 1's complete pipeline is exported using `joblib` into:
`ml/artifacts/logistic_regression_pipeline.joblib`

```python
pipeline_artifact = {
    "member": "Member 1",
    "model_name": "Logistic Regression",
    "model": champion_lr,
    "scaler": scaler,
    "feature_names": FEATURE_COLS,
    "optimal_threshold": float(optimal_threshold),
    "hyperparameters": { "C": float(best_c), "penalty": "l2", "solver": "lbfgs", "class_weight": "balanced" },
    "metrics": { ... }
}
joblib.dump(pipeline_artifact, EXPORT_FILE)
```

This guarantees that the FastAPI backend (`backend/app/ml/`) can immediately load the pre-fitted scaler, model, and decision threshold to perform real-time wildfire risk predictions.

---

# 12. Member 1 Deliverables Summary

| Deliverable | Location | Description |
| :--- | :--- | :--- |
| **Jupyter Notebook** | [`ml/notebooks/04_logistic_regression.ipynb`](file:///c:/Users/USER/Desktop/fdm-wildfire-risk-prediction/ml/notebooks/04_logistic_regression.ipynb) | Complete runnable code for training, tuning, evaluation, interpretability, and export |
| **Documentation File** | [`docs/stage6_member1_logistic_regression.md`](file:///c:/Users/USER/Desktop/fdm-wildfire-risk-prediction/docs/stage6_member1_logistic_regression.md) | Comprehensive academic report of Member 1's subsystem |
| **Trained Artifact** | `ml/artifacts/logistic_regression_pipeline.joblib` | Serialized scaler, champion model, and threshold for backend inference |
| **Comparison Contribution** | Stage 7 Common Comparison Table | Test set ROC-AUC, PR-AUC, F1, Precision, and Recall benchmark |
