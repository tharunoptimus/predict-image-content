// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = async function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");

    // Predict the imaage with the model
    let prediction = await predictModal();
    showResults(prediction);
    // track.stop();
};

function showResults(props) {
    let html = "<ul>"
    props.forEach(element => {
      html  += "<li>" + element.className + ": " + element.probability + "</li>";
    });
    html += "</ul>";
    document.getElementById("prediction").innerHTML = html;
}


async function predictModal () {
  let prediction;
  let img = document.getElementById('camera--output');

// Load the model.
  await mobilenet.load().then(async model => {
  // Classify the image.
      await model.classify(img).then(predictions => {
          prediction = predictions;
      });
  });

  return prediction;
}
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
