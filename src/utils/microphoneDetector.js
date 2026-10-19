/**
 * Privacy-conscious local microphone blow detector using Web Audio API.
 * Never records or transmits audio. Only evaluates root-mean-square amplitude locally.
 */

let audioContext = null;
let mediaStream = null;
let analyser = null;
let checkInterval = null;

export async function startBlowDetection(onBlowDetected) {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return { success: false, reason: 'unsupported' };
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    const source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let sustainedHits = 0;

    checkInterval = setInterval(() => {
      if (!analyser) return;
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;

      // Blow detection threshold: sustained low-to-mid frequency rush of air
      if (avg > 42) {
        sustainedHits++;
        if (sustainedHits >= 3) {
          stopBlowDetection();
          onBlowDetected();
        }
      } else {
        sustainedHits = Math.max(0, sustainedHits - 1);
      }
    }, 60);

    return { success: true };
  } catch (err) {
    console.warn('Microphone access denied or error:', err);
    stopBlowDetection();
    return { success: false, error: err };
  }
}

export function stopBlowDetection() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
    audioContext = null;
  }
  analyser = null;
}
