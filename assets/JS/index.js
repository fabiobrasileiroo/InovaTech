const cam = document.getElementById('cam')// pra ter mais performace declarei aqui

/*navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        if (Array.isArray(devices)){
            devices.forEach(device => {
                if(device.kind === 'videoinput') {
                   if(device.label.includes('')){ // se tiver uma câmera internar definir aqui
                    navigator.getUserMedia(
                        {video:{
                            deviceId: devicePixelRatio.deviceId
                        }},
                        stream => cam.srcObject = stream, 
                        error => console.log(error)
                        )
                   } 
                }
            })
        }
    })
*/
const startVideo = () => {
    navigator.getUserMedia(
        {video:{
        deviceId: devicePixelRatio.deviceId
        }},
        stream => cam.srcObject = stream, // função de callback, pega stream e seta ele
        error => console.log(error) // ser não tiver vai ter erro
    )
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models'),
]).then(startVideo)

cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)
    setInverval(async () => {
        const detections = await faceapi
        .detectAllFaces(
            cam,
            new faceapi.tinyFaceDetectorOptions()
        )
    const resizeResultsDEtections = faceapi.resizeResults(detections, canvasSize)
    console.log(detections)
    }, 100)
})
