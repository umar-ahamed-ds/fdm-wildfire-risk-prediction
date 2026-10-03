## Phase 6.4 — Baseline Decision Tree Validation

### Objective

Evaluate the baseline Decision Tree on the unseen validation dataset
(2021–2022) to measure how well the model generalizes beyond the training data.

### Process

The trained Decision Tree will make predictions using the validation
features. These predictions will then be compared with the actual validation
target values.

### Evaluation Metrics

The model will be evaluated using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC
- Confusion Matrix

Because the wildfire class is highly imbalanced, accuracy will not be used
as the only performance measure.

### Observation

The baseline Decision Tree achieved an accuracy of 89.56%, but its
minority-class performance was poor. The recall was only 4.60%, meaning
that the model detected only a small proportion of actual wildfire cases.

The confusion matrix showed 103,253 false negatives compared with only
4,975 true positives. This indicates that the baseline model has difficulty
identifying wildfire events despite using class weighting.

Therefore, accuracy alone is not an appropriate measure of model quality
for this imbalanced classification problem. Recall, precision, F1-score,
PR-AUC and the confusion matrix provide more useful information about
wildfire detection performance.

The baseline results provide a reference point for later model optimization
in Stage 7.


## Phase 6.5 — Experiment Recording and Baseline Analysis

### Objective

Record the baseline Decision Tree configuration, validation results, and
important observations so that the model can be compared fairly with other
models and with the optimized Decision Tree in Stage 7.

### Experiment

The baseline Decision Tree was trained using the 2013–2020 training data
and evaluated using the 2021–2022 validation data.

The model used the Gini criterion and balanced class weights to account for
the class imbalance in the wildfire target.

### Purpose of the Baseline

The baseline model provides a reference point for Stage 7 optimization.
Changes to hyperparameters or modelling choices can later be compared
against these baseline results.

### Baseline Decision Tree — Key Observation

The baseline Decision Tree achieved an accuracy of 89.56%, but its
minority-class detection performance was poor. The model achieved only
4.60% recall and produced 103,253 false negatives compared with 4,975
true positives.

The low F1-score (6.70%), ROC-AUC (0.5085), and PR-AUC (0.0834) also
indicate limited ability to identify wildfire events.

Therefore, the baseline results provide evidence that further optimization
is required. These results will be used as the reference point when
evaluating different Decision Tree configurations during Stage 7.


## Phase 7.2 — Hyperparameter Experiment Design

### Objective

Investigate whether controlling Decision Tree complexity can improve
validation performance compared with the baseline model.

### Parameters Selected

The main hyperparameters investigated will be:

- max_depth
- min_samples_leaf
- min_samples_split
- criterion

These parameters were selected because they directly influence the
complexity of the Decision Tree and the way splits are created.

### Experimental Approach

The baseline configuration will be used as the reference point. Different
controlled configurations will then be trained and evaluated on the same
validation dataset.

The final test dataset will not be used during hyperparameter
experimentation.

## Phase 7.3 — Experiment 1: max_depth

### Objective

Investigate whether limiting the maximum depth of the Decision Tree
improves its ability to generalize to unseen validation data.

### Baseline

The baseline Decision Tree used:

- max_depth = None
- criterion = Gini
- class_weight = balanced
- min_samples_leaf = 1
- min_samples_split = 2

### Experiment

Different maximum tree depths will be tested while keeping the other
parameters unchanged.

The validation dataset will be used to compare the resulting models.

### Reason

A tree with unrestricted depth can become highly complex and may learn
very specific patterns from the training data. Limiting max_depth can
reduce model complexity and potentially improve generalization.

### Evaluation

Each configuration will be evaluated using the same metrics as the
baseline:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC

The test dataset will remain untouched.

### Experiment 1 Observation — max_depth = 10

Limiting the Decision Tree to a maximum depth of 10 substantially changed
the validation performance compared with the baseline model.

Recall increased from 4.60% to 76.26%, indicating that the model detected a
much larger proportion of actual wildfire observations. F1-score increased
from 6.70% to 17.77%, while ROC-AUC increased from 0.5085 to 0.6037 and
PR-AUC increased from 0.0834 to 0.1139.

However, accuracy decreased from 89.56% to 42.43% and precision decreased
from 12.35% to 10.06%. This indicates a trade-off between detecting more
wildfire cases and producing more incorrect wildfire predictions.

The max_depth=10 configuration will therefore be retained as an experiment
for comparison with other configurations rather than being selected as the
final model at this stage.

## Phase 7.3 — Experiment 2: max_depth = 15

### Objective

Investigate whether increasing the maximum depth from 10 to 15 improves
the Decision Tree's validation performance.

### Experimental Control

The following settings remain unchanged:

- criterion = Gini
- class_weight = balanced
- random_state = 42

Only max_depth is changed from 10 to 15.

### Evaluation

The model will be evaluated on the same 2021–2022 validation dataset using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC

The final test dataset remains untouched.

### Experiment 2 Observation — max_depth = 15

Increasing the maximum depth from 10 to 15 increased validation accuracy
from 42.43% to 53.47% and slightly increased precision from 10.06% to
10.11%.

However, recall decreased from 76.26% to 59.63%, while F1-score decreased
slightly from 17.77% to 17.29%. ROC-AUC also decreased from 0.6037 to
0.5743, and PR-AUC decreased from 0.1139 to 0.1066.

Therefore, increasing the tree depth from 10 to 15 did not improve the
minority-class detection metrics compared with the depth=10 configuration.
The results demonstrate that increasing tree complexity does not
necessarily improve validation performance.

### Confusion Matrix Observation — max_depth = 15

The max_depth=15 configuration produced 64,534 true positives and 43,694
false negatives. Compared with the baseline model, the number of missed
wildfire observations decreased substantially, while the number of correctly
detected wildfire observations increased.

However, the model produced 573,695 false positives. This indicates that
the model classified a large number of actual non-wildfire observations as
wildfire, which contributed to the low precision of 10.11%.

Compared with max_depth=10, the depth=15 configuration had lower recall,
F1-score, ROC-AUC and PR-AUC. Therefore, increasing the depth from 10 to 15
did not improve the validation performance of the Decision Tree according
to these metrics.

## Phase 7.3 — Experiment 3: max_depth = 20

### Objective

Investigate whether increasing the maximum depth from 15 to 20 improves
the Decision Tree's validation performance.

### Experimental Control

The following settings remain unchanged:

- criterion = Gini
- class_weight = balanced
- random_state = 42

Only max_depth is changed to 20.

### Evaluation

The model will be evaluated on the same 2021–2022 validation dataset using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC
- Confusion Matrix

The final test dataset remains untouched.

### Experiment 3 Observation — max_depth = 20

Increasing the maximum depth from 15 to 20 increased validation accuracy
from 53.47% to 69.47% and slightly increased precision from 10.11% to
10.48%.

However, recall decreased from 59.63% to 36.38%, F1-score decreased from
17.29% to 16.28%, ROC-AUC decreased from 0.5743 to 0.5476, and PR-AUC
decreased from 0.1066 to 0.0976.

The confusion matrix contained 68,850 false negatives and 39,378 true
positives. Therefore, the depth=20 configuration detected fewer wildfire
observations than the depth=15 configuration.

Overall, increasing the maximum depth beyond 10 did not improve the
minority-class validation performance in these experiments.




## Phase 7.4 — Experiment: min_samples_leaf

### Objective

Investigate whether controlling the minimum number of observations allowed
in each leaf can improve the Decision Tree's validation performance.

### Baseline

The baseline Decision Tree used:

- min_samples_leaf = 1
- criterion = Gini
- class_weight = balanced
- random_state = 42

### Experiment

Different min_samples_leaf values will be tested while keeping the other
model settings controlled.

### Reason

A very small leaf size allows the tree to create highly specific rules
based on very few observations. Increasing min_samples_leaf constrains the
tree and can encourage more general rules, potentially reducing overfitting.

### Evaluation

Each configuration will be evaluated using the same validation dataset
and the common performance metrics:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC

The final test dataset will remain untouched.

### Experiment Observation — min_samples_leaf = 10

Increasing min_samples_leaf from the baseline value of 1 to 10 produced
an accuracy of 85.13%. However, recall decreased substantially to 12.02%,
with only 13,007 true positives compared with 95,221 false negatives.

The F1-score was 11.65%, ROC-AUC was 0.5187, and PR-AUC was 0.0869.
Although the model achieved relatively high accuracy, its ability to
detect the minority wildfire class remained limited.

The results indicate that increasing the minimum leaf size constrained
the Decision Tree's predictions and reduced its wildfire detection
capability in this experiment.

## Phase 7.4 — Experiment 2: min_samples_leaf = 5

### Objective

Investigate whether a smaller increase in min_samples_leaf can provide a
better balance between model flexibility and generalization compared with
the baseline value of 1.

### Experimental Control

The following settings remain unchanged:

- criterion = Gini
- class_weight = balanced
- random_state = 42

Only min_samples_leaf is changed to 5.

### Evaluation

The model will be evaluated using the same 2021–2022 validation dataset
and the common performance metrics:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC

The final test dataset remains untouched.

### Experiment Observation — min_samples_leaf = 5

Increasing min_samples_leaf from 1 to 5 resulted in an accuracy of
87.44%, precision of 11.84%, recall of 8.37%, F1-score of 9.80%,
ROC-AUC of 0.5143 and PR-AUC of 0.0856.

Compared with the baseline configuration, recall, F1-score, ROC-AUC and
PR-AUC improved slightly, while accuracy decreased.

The confusion matrix contained 99,174 false negatives and 9,054 true
positives. Therefore, although the model showed a small improvement in
minority-class metrics, it still failed to detect a large proportion of
actual wildfire observations.

Compared with min_samples_leaf=10, the leaf=10 configuration produced
higher recall, F1-score, ROC-AUC and PR-AUC. This suggests that increasing
the minimum leaf size from 1 to 10 provided a stronger improvement within
this experiment series.

## Phase 7.5 — Combined Hyperparameter Experiment

### Objective

Investigate whether combining the best-performing configurations from the
individual hyperparameter experiments can further improve Decision Tree
validation performance.

### Configuration

The combined model will use:

- max_depth = 10
- min_samples_leaf = 10
- criterion = Gini
- class_weight = balanced
- random_state = 42

### Reason

The max_depth=10 experiment produced the strongest minority-class
performance among the tested depth configurations, while
min_samples_leaf=10 produced the strongest minority-class performance
within the leaf-size experiment.

Combining these settings allows us to determine whether controlling both
tree depth and minimum leaf size simultaneously improves generalization.

### Evaluation

The combined model will be evaluated using the same validation dataset
and performance metrics:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC
- Confusion Matrix

The final test dataset remains untouched.

### Combined Hyperparameter Observation

The combined configuration using max_depth=10 and min_samples_leaf=10
produced exactly the same validation metrics and confusion matrix as the
max_depth=10 configuration alone.

The model achieved 42.43% accuracy, 10.06% precision, 76.26% recall,
17.77% F1-score, 0.6037 ROC-AUC and 0.1139 PR-AUC.

The identical results indicate that adding min_samples_leaf=10 did not
further change the model predictions when the maximum tree depth was
restricted to 10. Therefore, the additional leaf-size constraint did not
provide a measurable improvement in this configuration.

This experiment demonstrates that combining hyperparameters does not
necessarily produce additional performance improvements and that the
effect of one hyperparameter can depend on the value of another.

## Phase 7.6 — Experiment: Entropy Splitting Criterion

### Objective

Investigate whether changing the Decision Tree splitting criterion from
Gini impurity to entropy improves validation performance.

### Experimental Control

The following settings remain consistent with the baseline model:

- criterion = entropy
- class_weight = balanced
- random_state = 42
- max_depth = None
- min_samples_leaf = 1

Only the splitting criterion is changed.

### Reason

Gini impurity and entropy are alternative measures used to evaluate the
quality of Decision Tree splits. Comparing them allows us to determine
whether the choice of splitting criterion affects wildfire classification
performance.

### Evaluation

The model will be evaluated using the same validation dataset and:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC
- Confusion Matrix

The final test dataset remains untouched.

### Experiment Observation — criterion = entropy

Changing the Decision Tree splitting criterion from Gini to entropy
resulted in a small change in validation performance.

Accuracy decreased slightly from 89.56% to 89.26%, while precision
increased from 12.35% to 13.03% and recall increased from 4.60% to 5.58%.
The F1-score also improved from 6.70% to 7.82%.

ROC-AUC increased from 0.5085 to 0.5114 and PR-AUC increased from 0.0834
to 0.0843. The confusion matrix contained 6,042 true positives and
102,186 false negatives.

Therefore, entropy provided a small improvement in minority-class
performance compared with the baseline Gini criterion, although the
overall improvement was limited.

## Phase 7.7 — Experiment: min_samples_split

### Objective

Investigate whether changing the minimum number of training observations
required to split an internal Decision Tree node can improve validation
performance.

### Baseline

The baseline Decision Tree used:

- min_samples_split = 2
- criterion = Gini
- class_weight = balanced
- max_depth = None
- min_samples_leaf = 1
- random_state = 42

### Experiment

A higher min_samples_split value will be tested while keeping the other
model settings unchanged.

### Reason

A very small min_samples_split value allows the tree to continue making
splits using very small groups of observations. Increasing this value
restricts splitting and can produce more general decision rules.

### Evaluation

The model will be evaluated on the same validation dataset using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC
- Confusion Matrix

The final test dataset remains untouched.

### Experiment Observation — min_samples_split = 10

Increasing min_samples_split from 2 to 10 resulted in a small reduction
in accuracy from 89.56% to 88.67% and precision from 12.35% to 11.90%.

However, recall increased from 4.60% to 6.07%, while F1-score increased
from 6.70% to 8.04%. ROC-AUC also increased from 0.5085 to 0.5105 and
PR-AUC increased from 0.0834 to 0.0842.

The confusion matrix contained 101,655 false negatives and 6,573 true
positives, indicating that the model continued to miss a large number of
actual wildfire observations.

Overall, increasing min_samples_split to 10 produced a small improvement
in minority-class metrics but did not substantially improve wildfire
detection performance.


## Phase 7.8 — Experiment: class_weight

### Objective

Investigate whether changing the class weighting strategy can improve
Decision Tree performance for the imbalanced wildfire classification
problem.

### Baseline

The baseline Decision Tree uses:

- class_weight = "balanced"
- criterion = Gini
- max_depth = None
- min_samples_leaf = 1
- min_samples_split = 2
- random_state = 42

### Experiment

The baseline balanced weighting strategy will be compared with a manually
specified class weighting configuration.

### Reason

The wildfire class represents a much smaller proportion of the dataset.
Class weighting changes the importance given to each class during model
training and may affect the balance between detecting wildfire cases and
avoiding false-positive predictions.

### Evaluation

The model will be evaluated using the same validation dataset and:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- PR-AUC
- Confusion Matrix

The final test dataset remains untouched.

### Experiment Observation — class_weight = {0:1, 1:2}

Changing the class weighting strategy from "balanced" to {0:1, 1:2}
resulted in a decrease in accuracy from 89.56% to 88.31%. Precision also
decreased slightly from 12.35% to 12.27%.

However, minority-class performance improved. Recall increased from 4.60%
to 7.04%, while F1-score increased from 6.70% to 8.94%. ROC-AUC increased
from 0.5085 to 0.5128 and PR-AUC increased from 0.0834 to 0.0844.

The confusion matrix showed an increase in true positives from 4,975 to
7,616, indicating that the manually weighted model detected more actual
wildfire observations. However, 100,612 wildfire observations were still
classified as false negatives.

Overall, manually increasing the wildfire class weight produced a small
improvement in minority-class detection, but the improvement was limited.

## Phase 7.9 — Hyperparameter Experiment Comparison

### Objective

Consolidate the results of all Decision Tree hyperparameter experiments
and compare them with the baseline model.

### Experiments Conducted

The following hyperparameters were investigated:

- max_depth
- min_samples_leaf
- criterion
- min_samples_split
- class_weight
- Combined max_depth and min_samples_leaf configuration

### Evaluation

All experiments were evaluated using the same validation dataset and the
same performance metrics.

The final test dataset was not used during hyperparameter optimization.

### Purpose

The comparison is used to identify configurations that provide useful
improvements over the baseline, particularly for detecting the minority
wildfire class.

Because the dataset is highly imbalanced, recall, F1-score and PR-AUC are
given particular attention rather than relying only on accuracy.

### Overall Hyperparameter Experiment Observation

The hyperparameter experiments demonstrated that different Decision Tree
parameters produced substantially different validation behaviour.

The baseline unrestricted Decision Tree achieved high accuracy of 89.56%
but detected only 4.60% of wildfire observations, demonstrating the
limitations of accuracy for this highly imbalanced classification problem.

The max_depth experiments produced the most substantial change in
minority-class performance. The max_depth=10 configuration achieved
76.26% recall, 17.77% F1-score, 0.6037 ROC-AUC and 0.1139 PR-AUC.
However, this improvement was accompanied by a substantial reduction in
accuracy to 42.43%.

The min_samples_leaf, min_samples_split, entropy and manual class-weight
experiments produced smaller improvements in minority-class metrics.
The combined max_depth=10 and min_samples_leaf=10 configuration produced
the same validation predictions and metrics as max_depth=10 alone,
indicating that the additional leaf constraint did not provide a
measurable improvement in this configuration.

Overall, the experiments demonstrate that Decision Tree hyperparameters
have a significant effect on the trade-off between wildfire detection
and false-positive predictions. Therefore, multiple evaluation metrics
must be considered when determining the final model configuration rather
than relying on accuracy alone.

## Overall Hyperparameter Comparison

The results of all Decision Tree hyperparameter experiments were
consolidated and compared against the baseline model.

The baseline Decision Tree achieved an accuracy of 89.56%, but its recall
was only 4.60%, demonstrating that high accuracy does not necessarily
indicate effective wildfire detection in this highly imbalanced dataset.

The max_depth experiments produced the most significant change in model
behaviour. The max_depth=10 configuration achieved the highest recall
(76.26%), F1-score (17.77%), ROC-AUC (0.6037) and PR-AUC (0.1139) among
the tested configurations. However, this configuration also produced a
substantial reduction in accuracy to 42.43% and precision to 10.06%,
indicating a significant increase in false-positive predictions.

The min_samples_leaf, min_samples_split, entropy and manual class-weight
experiments produced smaller improvements in minority-class performance.
The combined max_depth=10 and min_samples_leaf=10 configuration produced
essentially identical results to max_depth=10 alone.

Overall, max_depth=10 was identified as the strongest candidate for
further consideration because it provided the strongest wildfire
detection performance according to recall, F1-score, ROC-AUC and PR-AUC.
However, the associated low precision and accuracy represent an important
trade-off that must be considered before final model selection.

## Phase 7.10 — Final Candidate Selection

### Objective

Select a Decision Tree configuration for final evaluation based on the
validation results obtained during hyperparameter optimization.

### Selection Considerations

Because the wildfire class represents a small proportion of the dataset,
accuracy alone is not sufficient for selecting the final configuration.

The selection focuses particularly on:

- Recall
- F1-score
- PR-AUC
- ROC-AUC

Precision and accuracy are also considered to understand the trade-offs
associated with each configuration.

The test dataset remains completely untouched during this selection process.

### Final Decision Tree Candidate

Based on the validation results, the configuration with
max_depth=10 was selected as the final Decision Tree candidate for
further evaluation.

This configuration achieved the highest recall (76.26%), F1-score
(17.77%), ROC-AUC (0.6037) and PR-AUC (0.1139) among the tested
configurations.

However, the model achieved a relatively low accuracy of 42.43% and
precision of 10.06%. This indicates a significant trade-off, where the
model detects substantially more wildfire observations but also produces
a large number of false-positive predictions.

The selection was therefore based on the wildfire detection objective
and the highly imbalanced target distribution rather than accuracy alone.

The final test dataset was not used during this selection process.

## Final Test Evaluation — Decision Tree

After completing hyperparameter optimization using the validation
dataset, the selected Decision Tree configuration was retrained using
the combined training and validation datasets.

The final configuration used max_depth=10, criterion='gini',
class_weight='balanced', and random_state=42.

The model was then evaluated on the previously untouched test dataset.

The final test results were:

- Accuracy: 35.89%
- Precision: 16.52%
- Recall: 85.38%
- F1-score: 27.68%
- ROC-AUC: 0.6043
- PR-AUC: 0.1872

The confusion matrix was:

[[194674 510891]
 [ 17306 101084]]

The model correctly detected 101,084 wildfire observations and missed
17,306 wildfire observations, resulting in a recall of 85.38%. However,
the model also produced 510,891 false-positive predictions, resulting in
a relatively low precision of 16.52% and accuracy of 35.89%.

Compared with the validation results, recall and F1-score increased on
the test dataset. This indicates that the model's classification
behaviour differed between the validation and later test period.

The test dataset also contained a higher proportion of wildfire
observations than the earlier overall class distribution, indicating a
change in target distribution across the temporal data split.

The test dataset was used only for this final evaluation and was not used
during hyperparameter optimization or final candidate selection.