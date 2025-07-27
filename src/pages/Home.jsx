import { useState } from "react";
import { Scan, Zap, Shield, Globe } from "lucide-react";
import FileUploader from "../components/FileUploader";
import TextOutput from "../components/TextOutput";
import LoadingSpinner from "../components/LoadingSpinner";
import { tesseractService } from "../utils/tesseractWorker";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [pasteNotification, setPasteNotification] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setExtractedText("");
    setError("");
    setProgress(0);

    // Show paste notification if file name suggests it was pasted
    if (file.name.includes("pasted") || file.name.includes("clipboard")) {
      setPasteNotification(true);
      setTimeout(() => setPasteNotification(false), 3000);
    }
  };

  const extractText = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");
    setProgress(0);

    try {
      const text = await tesseractService.extractText(
        selectedFile,
        (progressValue) => {
          // Ensure progress updates happen safely
          if (
            typeof progressValue === "number" &&
            progressValue >= 0 &&
            progressValue <= 100
          ) {
            setProgress(progressValue);
          }
        }
      );

      setExtractedText(text);
    } catch (err) {
      setError(err.message || "Failed to extract text from image");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetApp = () => {
    setSelectedFile(null);
    setExtractedText("");
    setError("");
    setProgress(0);
    tesseractService.terminate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Scan className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Image to Text
                </h1>
                <p className="text-slate-600">
                  Extract text from images using OCR technology
                </p>
              </div>
            </div>

            {(selectedFile || extractedText) && (
              <button
                onClick={resetApp}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Paste Notification */}
        {pasteNotification && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Scan className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-800 font-medium">
                Image pasted successfully!
              </p>
              <p className="text-emerald-700 text-sm">
                Your image is ready for text extraction.
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Upload Image
              </h2>
              <p className="text-slate-600">
                Select an image containing text you want to extract
              </p>
            </div>

            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              disabled={isProcessing}
            />

            {selectedFile && !isProcessing && (
              <button
                onClick={extractText}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
              >
                <Scan className="w-5 h-5" />
                <span>Extract Text</span>
              </button>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Extracted Text
              </h2>
              <p className="text-slate-600">
                Your extracted text will appear here
              </p>
            </div>

            {isProcessing ? (
              <div className="bg-white border border-slate-200 rounded-xl">
                <LoadingSpinner
                  progress={progress}
                  message="Extracting text from image..."
                />
              </div>
            ) : extractedText ? (
              <TextOutput
                text={extractedText}
                filename={selectedFile?.name?.split(".")[0] || "extracted-text"}
              />
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                <div className="p-4 bg-slate-100 rounded-full mx-auto mb-4 w-fit">
                  <Scan className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">
                  Upload an image to extract text
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Fast Processing
            </h3>
            <p className="text-slate-600">
              Quick and efficient text extraction from your images using
              advanced OCR technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Privacy First</h3>
            <p className="text-slate-600">
              All processing happens in your browser. Your images never leave
              your device.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Multiple Formats
            </h3>
            <p className="text-slate-600">
              Supports various image formats including JPG, PNG, GIF, BMP, and
              TIFF.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-slate-500">
            <p>
              © 2025 Image to Text Converter. Built with React and Tesseract.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
