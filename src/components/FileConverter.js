import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileConverter() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [conversionType, setConversionType] = useState("pdf-to-excel");

    const conversionDescriptions = {
        "pdf-to-excel": "📄 Converts a PDF file into an Excel spreadsheet, extracting tables and structured data.",
        "pdf-to-word": "📄 Converts a PDF file into an editable Word document.",
        "pdf-to-image": "📄 Converts each page of a PDF into a separate image.",
        "pdf-to-text": "📄 Extracts plain text from a PDF file.",
        "merge-pdfs": "📑 Combines multiple PDFs into one single document.",
        "split-pdf": "📑 Splits a PDF into multiple smaller PDF files.",
        "compress-pdf": "📉 Reduces the file size of a PDF without losing quality.",
        "image-to-pdf": "🖼️ Converts image files (JPG, PNG) into a PDF document.",
        "image-to-text": "🖼️ Extracts text from an image using OCR technology.",
        "csv-to-excel": "📊 Converts a CSV file into an Excel spreadsheet.",
        "excel-to-csv": "📊 Converts an Excel spreadsheet into a CSV file.",
        "word-to-pdf": "📝 Converts a Word document into a PDF file.",
        "text-to-pdf": "📝 Converts plain text into a formatted PDF document.",
        "json-to-csv": "💾 Converts JSON data into a structured CSV file.",
        "mp3-to-wav": "🎵 Converts an MP3 audio file into a WAV format.",
        "video-to-gif": "🎬 Converts a video clip into an animated GIF file."
    };

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage("⚠️ Please select a file.");
            return;
        }
        
        setMessage("⏳ Uploading and converting... Please wait.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("conversionType", conversionType);

        try {
            const response = await fetch("https://file-converter-backend-jl7o.onrender.com", {
                method: "POST",
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error("❌ File conversion failed.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted.${conversionType.split('-').pop()}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setMessage("✅ Conversion successful! File downloaded.");
        } catch (error) {
            setMessage("❌ Error converting file.");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-green-100 rounded-xl shadow-md space-y-4 text-center">
            <h1 className="text-2xl font-bold text-green-800">🔄 File Converter 🌍</h1>
            <p className="text-green-700">🌟 Select a conversion type and upload your file. 🚀</p>
            
            <select 
                className="w-full p-2 border rounded bg-white text-green-900" 
                value={conversionType} 
                onChange={(e) => setConversionType(e.target.value)}
            >
                {Object.keys(conversionDescriptions).map((key) => (
                    <option key={key} value={key}>{conversionDescriptions[key].split(" ")[0]} {key.replace(/-/g, " ").toUpperCase()}</option>
                ))}
            </select>
            
            <div {...getRootProps()} className="border-2 border-green-500 border-dashed p-6 cursor-pointer bg-green-200">
                <input {...getInputProps()} />
                {file ? <p className="text-green-900">📎 {file.name}</p> : <p className="text-green-900">📥 Drop a file here, or click to select one.</p>}
            </div>
            
            <button onClick={handleSubmit} className="w-full bg-green-600 text-white p-2 rounded mt-3" disabled={!file}>
                🔄 Convert
            </button>
            
            {message && <p className="text-sm text-green-800">{message}</p>}
            
            <p className="text-sm text-green-800 mt-3">ℹ️ {conversionDescriptions[conversionType]}</p>
        </div>
    );
}