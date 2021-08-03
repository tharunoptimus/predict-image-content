// Set constraints for the video stream
let constraints = { video: { facingMode: "user" }, audio: false };
let track = null;

let showingResults = false;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
    predictionSpan = document.querySelector("#prediction")
    currentTaskImage = document.querySelector("#currentTask");

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

  if(!showingResults) {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");

    applyStyleAndShowStatus(true);
    let prediction = await predictModal();
    predictionSpan.innerHTML = showResults(prediction);
    changeCurrentTask(false);
    showingResults = true;
  }
  else {
    applyStyleAndShowStatus(false);
    removePhotoFromFrame();
    changeCurrentTask(true);
    showingResults = false;
  }
    

};

function applyStyleAndShowStatus(show) {
  if(show) {
    // add class to the predictionSpan element without jquery
    predictionSpan.classList.add("prediction");
    predictionSpan.innerHTML = "<img src='searching.gif' alt='Scanning'>";
  }
  else {
    predictionSpan.classList.remove("prediction");
    predictionSpan.innerHTML = "";
  }
}

function removePhotoFromFrame () {
  cameraOutput.classList.remove("taken");
  cameraOutput.src = "";
}

function changeCurrentTask (ready) {
  if(ready) {
    currentTaskImage.src = "search.png";
  }
  else {
    currentTaskImage.src = "cancel.png";
  }
}

function showResults(props) {
    let html = "<div style='margin-bottom: 0.5rem;'>Results:</div><ul class='predictions'>"
    props.forEach(element => {
      html  += "<li>" + 
                  "<div class='predictionDiv'>" + element.className + "</div>"
                  + "<div class='predictionPercentage'>" + getPercentage(parseFloat(element.probability)) + "</div>" 
              + "</li>";
    });
    html += "</ul>";
    return html;
}


// function to conver the string input 0.5909343 to a percentage
function getPercentage (number) {
    return (number * 100).toFixed(2) + "%";
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
