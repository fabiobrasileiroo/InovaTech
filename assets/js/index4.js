const cam = document.getElementById('cam');
cam.width = 320; // Reduz a largura do vídeo
cam.height = 240; // Reduz a altura do vídeo

const startVideo = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');

  for (const device of videoDevices) {
    if (device.label.includes('')) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
        cam.srcObject = stream;
        break;
      } catch (error) {
        console.error(error);
      }
    }
  }
};

const loadLabels = async () => {
  const labels = ['Fabio Brasileiro','Josefa','Jordan','Karson','Jhonny','Murilo','Luanna','Fabricio','Jorge','Lucas Minervino','Guilherme', 'Gabriel','Felipe','Richard Belarmino'];
  const labeledFaceDescriptors = [];

  for (const label of labels) {
    const descriptions = [];
    const img = await faceapi.fetchImage(`/assets/lib/face-api/labels/${label}/1.jpg`);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    descriptions.push(detections.descriptor);

    labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptions));
  }

  return labeledFaceDescriptors;
};

(async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models');
  await faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models');
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models');

  await startVideo();

  cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam);
    const canvasSize = { width: cam.width, height: cam.height };
    const labels = await loadLabels();

    faceapi.matchDimensions(canvas, canvasSize);
    document.body.appendChild(canvas);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(cam, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, canvasSize);
      const faceMatcher = new faceapi.FaceMatcher(labels, 0.6);
      const results = resizedDetections.map(d =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      resizedDetections.slice(0, 2).forEach(detection => { // Limita o número de detecções
        const { age, gender, genderProbability } = detection;
        new faceapi.draw.DrawTextField([
          `${parseInt(age, 10)} years`,
          `${gender} (${parseInt(genderProbability * 100, 10)})`
        ], detection.detection.box.topRight).draw(canvas);
      });

      results.forEach((result, index) => {
        const box = resizedDetections[index].detection.box;
        const { label, distance } = result;
        new faceapi.draw.DrawTextField([
          `${label} (${parseInt(distance * 100, 10)})`
        ], box.bottomRight).draw(canvas);
      });
    }, 200); // Diminui a taxa de quadros
  });
})();
