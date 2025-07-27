# Image to Text Converter

A modern, responsive web application that extracts text from images using OCR (Optical Character Recognition) technology. Built with React, Vite, Tailwind CSS, and Tesseract.js with a beautiful emerald and slate color scheme.

## ✨ Features

- **Multiple Input Methods**: Drag & drop, file upload, or paste images directly from clipboard (Ctrl+V)
- **Real-time Progress**: Visual progress indicator during text extraction with smooth animations
- **Privacy First**: All processing happens locally in your browser - images never leave your device
- **Export Options**: Copy extracted text to clipboard or download as .txt file
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with emerald and slate styling
- **Multiple Formats**: Supports JPG, PNG, GIF, BMP, and TIFF image formats

Perfect for digitizing documents, extracting text from screenshots, or converting images to editable text quickly and securely.

## 🚀 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Tesseract.js** - OCR engine for text extraction
- **Lucide React** - Beautiful icons

## Installation

1. Clone the repository:
```bash
git clone [<your-repo-url>](https://github.com/sarkuzb/image-to-text.git)
cd image-to-text
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload an Image**: 
   - Drag and drop an image onto the upload area, or
   - Click to browse and select an image file

2. **Extract Text**: 
   - Click the "Extract Text" button to start OCR processing
   - Wait for the progress bar to complete

3. **Use Extracted Text**:
   - Copy text to clipboard using the "Copy" button
   - Download text as a .txt file using the "Download" button

## Project Structure

```
image-to-text/
├── public/                     # Static files
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── FileUploader.jsx    # File upload component
│   │   ├── TextOutput.jsx      # Text display and export
│   │   └── LoadingSpinner.jsx  # Progress indicator
│   ├── pages/                  # Page components
│   │   └── Home.jsx            # Main application page
│   ├── utils/                  # Utility functions
│   │   └── tesseractWorker.js  # OCR service wrapper
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) for the OCR engine
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide](https://lucide.dev/) for the beautiful icons
