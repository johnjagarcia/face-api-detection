function startRecognition() {
  const video = document.getElementById("video");

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models")
  ]).then(startVideo);

  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(function(mediaStream) {
        video.srcObject = mediaStream;
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  var videoWidth = 0;
  var videoHeight = 0;

  video.addEventListener(
    "loadedmetadata",
    function(e) {
      videoWidth = this.videoWidth;
      videoHeight = this.videoHeight;
    },
    false
  );
  video.addEventListener("play", () => {
    document.getElementById("recognitionState").innerHTML = "Reconociendo....";
    document.getElementById("detectedPeople").value = "";

    const canvas = $("#overlay").get(0);

    let timer = setInterval(async () => {
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        const dims = faceapi.matchDimensions(canvas, video, true);
        const resizedDetections = faceapi.resizeResults(detection, dims);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        //faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detection.score > 0.8) {
          clearInterval(timer);
          video.pause();
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

          const snapshotCanvas = document.getElementById("canvas");
          const snapshotContext = snapshotCanvas.getContext("2d");

          //draw image to canvas. scale to target dimensions
          snapshotContext.drawImage(video, 0, 0, videoWidth, videoHeight);

          //convert to desired file format
          var dataURI = snapshotCanvas.toDataURL();

          detectFace(dataURI);
        }
      }
    }, 100);
  });
}
