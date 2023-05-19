import cv2

# Captura vídeo da webcam
cap = cv2.VideoCapture(0)

# Loop para exibir o vídeo em tempo real
while True:
    # Lê um frame do vídeo
    ret, frame = cap.read()

    # Exibe o frame em uma janela
    cv2.imshow('Video', frame)

    # Verifica se o usuário pressionou a tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Libera a webcam e destrói a janela
cap.release()
cv2.destroyAllWindows()