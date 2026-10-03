# Random Forest Experiment Observations

## 1. Baseline Random Forest

The baseline Random Forest was trained using the common training dataset and evaluated on the validation dataset.

### Validation Results

| Metric | Result |
|---|---:|
| Accuracy | 0.918410 |
| Precision | 0.254237 |
| Recall | 0.000139 |
| F1-score | 0.000277 |
| ROC-AUC | 0.600557 |

### Observation

The baseline model achieved high overall accuracy, but its recall and F1-score for the wildfire class were extremely low. The confusion matrix showed that the model detected only a very small number of actual wildfire cases.

This demonstrates that accuracy alone is not sufficient for evaluating this wildfire prediction problem because the dataset is highly imbalanced.

---

## 2. Hyperparameter Optimization

RandomizedSearchCV was used to investigate suitable Random Forest hyperparameters. The search used 3-fold `TimeSeriesSplit` cross-validation and F1-score as the optimization metric.

### Best Hyperparameters

| Hyperparameter | Selected Value |
|---|---:|
| n_estimators | 250 |
| max_depth | 10 |
| min_samples_split | 2 |
| min_samples_leaf | 5 |
| max_features | log2 |
| class_weight | balanced |

Best cross-validation F1-score: **0.1298**

### Optimized Validation Results

| Metric | Result |
|---|---:|
| Accuracy | 0.543298 |
| Precision | 0.107568 |
| Recall | 0.630308 |
| F1-score | 0.183773 |
| ROC-AUC | 0.622228 |

### Observation

Hyperparameter optimization substantially changed the behaviour of the Random Forest. Recall increased from **0.000139** to **0.630308**, and F1-score increased from **0.000277** to **0.183773**. ROC-AUC also increased from **0.600557** to **0.622228**.

However, accuracy decreased from **0.918410** to **0.543298**. This shows why multiple performance metrics are important for this imbalanced classification problem. The optimized model identifies substantially more wildfire cases than the baseline model.

---

## 3. Feature Selection Experiment

The baseline Random Forest feature importance values were used to select the top 15 features.

### Selected Features

1. longitude
2. latitude
3. fuel_moisture_1000hr
4. day_of_year
5. solar_radiation
6. year
7. temperature_min
8. specific_humidity
9. fuel_moisture_100hr
10. temperature_max
11. relative_humidity_min
12. relative_humidity_max
13. energy_release_component
14. vapor_pressure_deficit
15. wind_speed

The selected-feature Random Forest used the best hyperparameters identified during the hyperparameter search.

### Validation Results

| Metric | Result |
|---|---:|
| Accuracy | 0.528843 |
| Precision | 0.106553 |
| Recall | 0.646746 |
| F1-score | 0.182962 |
| ROC-AUC | 0.621741 |

### Observation

Compared with the optimized Random Forest, feature selection increased recall from **0.630308** to **0.646746**. However, F1-score decreased slightly from **0.183773** to **0.182962**, and ROC-AUC decreased slightly from **0.622228** to **0.621741**.

Therefore, reducing the feature set did not produce an improvement across all evaluation metrics. The experiment shows that removing lower-ranked features can change model behaviour, but the effect should be evaluated using multiple metrics rather than accuracy alone.

---

## 4. Overall Random Forest Experiment Comparison

| Model | Accuracy | Precision | Recall | F1-score | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Baseline Random Forest | 0.918410 | 0.254237 | 0.000139 | 0.000277 | 0.600557 |
| Optimized Random Forest | 0.543298 | 0.107568 | 0.630308 | 0.183773 | 0.622228 |
| Random Forest - Selected Features | 0.528843 | 0.106553 | 0.646746 | 0.182962 | 0.621741 |

## 5. Overall Observations

- The baseline Random Forest produced high accuracy but extremely low recall and F1-score for the wildfire class.
- Hyperparameter optimization substantially increased recall and F1-score and produced a higher ROC-AUC than the baseline.
- Feature selection further increased recall compared with the optimized model, but produced slightly lower F1-score and ROC-AUC.
- The results demonstrate that model configuration and feature selection can substantially affect the behaviour of the classifier.
- Because the wildfire class is highly imbalanced, accuracy should not be considered in isolation.
- Precision, recall, F1-score and ROC-AUC provide additional information for comparing the Random Forest experiments.
- These results are based on the validation data. The test set was not used during these experiments.
- Final model selection will be performed after comparing the Random Forest results with the other models developed by the team.
