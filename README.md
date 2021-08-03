# Prediction using Image Classification Model - ImageNet Database

## Predicts the object in the captured image using a trained model

## ML Libraries used
- [TensorFlowJS](https://www.tensorflow.org/js)
- [Mobinet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)

## How this works
- The model is loaded from the from the Library
- The image is captured by the device camera
- The image is converted to a tensor
- The tensor is passed to the model
- The model outputs the predicted object

## Issues in v1
- The first prediction takes longer time to be completed because the model is loaded from the library for the first time
- Could not cache the model using service worker because it depends on other online resources
- Passess 100% of the lighthouse audit except for the Performance because the model is loaded from the library

## Install it as PWA
## Enjoy!
