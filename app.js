document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const resultText = document.getElementById('resultText');

    // Solicitar acceso a la cámara
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.setAttribute('playsinline', true); // Para que funcione en iPhone
            video.play();
            requestAnimationFrame(scanQRCode);
        })
        .catch(err => {
            console.error('Error al acceder a la cámara: ', err);
            resultText.textContent = 'No se puede acceder a la cámara. Verifica los permisos.';
        });

    function scanQRCode() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height, {
                inversionAttempts: 'dontInvert',
            });
            if (code) {
                resultText.textContent = code.data;
            }
        }
        requestAnimationFrame(scanQRCode);
    }
});
