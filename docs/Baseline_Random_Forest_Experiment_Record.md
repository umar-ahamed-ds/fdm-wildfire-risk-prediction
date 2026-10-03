# STEP 11 --- Baseline Random Forest Experiment Record

## Model

Random Forest Classifier

## Configuration

-   `n_estimators = 100`
-   `class_weight = "balanced"`
-   `random_state = 42`
-   `n_jobs = -1`

## Validation Strategy

Chronological train/validation/test split.

The validation dataset was not used during model training.

## Validation Results

-   Accuracy = 0.9184
-   Precision = 0.2542
-   Recall = 0.0001
-   F1-score = 0.0003
-   ROC-AUC = 0.6006
-   PR-AUC = 0.1132

## Confusion Matrix

-   TN = 1,218,570
-   FP = 44
-   FN = 108,213
-   TP = 15

## Important Observation

The baseline Random Forest achieved high overall accuracy, but its
ability to detect the minority wildfire class was extremely poor. The
model missed 108,213 actual wildfire cases and correctly detected only
15 wildfire cases.

This shows that accuracy alone is not sufficient for evaluating this
highly imbalanced wildfire prediction problem. Precision, recall,
F1-score, ROC-AUC and PR-AUC provide additional information about model
performance.

## Stage 6 Status

Baseline Random Forest development and validation evaluation completed.
The results will be compared with the other three baseline machine
learning models.
