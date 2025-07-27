import { createWorker } from "tesseract.js";

class TesseractService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    this.worker = await createWorker("eng");
    this.isInitialized = true;
  }

  async extractText(imageFile, onProgress = () => {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Start progress simulation since we can't use logger safely
      let progressInterval;
      let currentProgress = 0;

      const simulateProgress = () => {
        if (currentProgress < 90) {
          currentProgress += Math.random() * 15;
          currentProgress = Math.min(currentProgress, 90);
          onProgress(Math.round(currentProgress));
        }
      };

      progressInterval = setInterval(simulateProgress, 300);
      onProgress(5); // Initial progress

      // Perform OCR without logger to avoid cloning issues
      const {
        data: { text },
      } = await this.worker.recognize(imageFile);

      // Clear interval and set completion
      clearInterval(progressInterval);
      onProgress(100);

      return text.trim();
    } catch (error) {
      console.error("OCR Error:", error);
      throw new Error("Failed to extract text from image");
    }
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

export const tesseractService = new TesseractService();
