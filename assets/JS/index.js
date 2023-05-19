// Carrega a imagem
const imagem = document.getElementById('imagem');
// Cria um canvas para desenhar a imagem
const canvas = document.createElement('canvas');
canvas.width = imagem.width;
canvas.height = imagem.height;
// Desenha a imagem no canvas
const ctx = canvas.getContext('2d');
ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);
// Detecta os rostos na imagem
faceapi.detectAllFaces(canvas).then((faces) => {
  // Desenha um retângulo ao redor de cada rosto
  faces.forEach((face) => {
    const { x, y, width, height } = face.box;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, width, height);
  });
  // Exibe a imagem com os retângulos ao redor dos rostos
  document.body.appendChild(canvas);
});
