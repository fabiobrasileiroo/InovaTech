import cv2

# Carrega o classificador de cascata de Haar para detecção de faces
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Carrega a imagem
img = cv2.imread('imagem.jpg')

# Converte a imagem para escala de cinza
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detecta as faces na imagem
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

# Desenha retângulos ao redor das faces detectadas
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

# Exibe a imagem com as faces detectadas
cv2.imshow('Imagem com faces detectadas', img)
cv2.waitKey(0)
cv2.destroyAllWindows() 