import { useState, useRef, useEffect } from "react";
import { Upload, Image, X, Clipboard } from "lucide-react";

const FileUploader = ({ onFileSelect, selectedFile, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [pasteSupported, setPasteSupported] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if clipboard API is supported safely
    const checkClipboardSupport = () => {
      try {
        return !!(
          navigator.clipboard && typeof navigator.clipboard.read === "function"
        );
      } catch (error) {
        return false;
      }
    };

    setPasteSupported(checkClipboardSupport());

    // Add paste event listener to the document
    const handlePaste = (e) => {
      if (disabled) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleFileSelection(file);
          }
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [disabled]);

  const handlePasteClick = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        alert(
          "Clipboard API not supported in this browser. Try using Ctrl+V instead."
        );
        return;
      }

      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], "pasted-image.png", { type });
            handleFileSelection(file);
            return;
          }
        }
      }

      alert("No image found in clipboard");
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      alert(
        "Failed to access clipboard. Try using Ctrl+V instead or check browser permissions."
      );
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Copy-Paste Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Clipboard className="w-5 h-5 text-emerald-600" />
            <h3 className="font-medium text-slate-700">Paste from Clipboard</h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-2">
              Copy an image and paste it here using Ctrl+V or click the button
              below
            </p>
            <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
              💡 Tip: You can paste images directly anywhere on this page
            </div>
          </div>

          {pasteSupported && (
            <button
              onClick={handlePasteClick}
              disabled={disabled}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clipboard className="w-4 h-4" />
              <span>Paste Image</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />

          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-emerald-100 rounded-full">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Upload an Image
              </h3>
              <p className="text-slate-500 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-slate-400">
                Supports JPG, PNG, GIF, BMP, TIFF formats
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Image className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {!disabled && (
              <button
                onClick={clearFile}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg border border-slate-200"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
