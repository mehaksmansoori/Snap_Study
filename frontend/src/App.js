// import React, { useState } from "react";

// function App() {
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a file first.");

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true); // Show loading while request is processing

//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error(`Server responded with status ${res.status}`);
//       }

//       const data = await res.json();
//       setResponse(data);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Failed to upload or process the video. Make sure the backend is running and all Python files are error-free.");
//     } finally {
//       setLoading(false); // Always stop loading
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2>🎥 SnapStudy - Upload a Video</h2>
//       <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
//       <br />
//       <button onClick={handleUpload} style={{ marginTop: "10px" }}>Upload</button>

//       {loading && <p style={{ color: "blue" }}>⏳ Processing video, please wait...</p>}

//       {response && !loading && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>📝 Summary:</h3>
//           <p>{response.summary}</p>

//           <h3>🗣️ Transcript:</h3>
//           <p>{response.transcript}</p>

//           <h3>❓ Quiz:</h3>
//           <pre>{response.quiz}</pre>

//           <h3>🌐 Translated Summary (Hindi):</h3>
//           <p>{response.translated_summary}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useState } from "react";

// function App() {
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a file first.");

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Upload failed");

//       const data = await res.json();
//       setResponse(data);
//     } catch (err) {
//       alert("Failed to process video. Check backend and logs.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 font-sans">
//       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
//         <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
//           🎓 SnapStudy - Your Smart Study Partner
//         </h1>

//         <div className="flex flex-col items-center gap-4">
//           <input
//             type="file"
//             accept="video/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//           />

//           <button
//             onClick={handleUpload}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             🚀 Upload & Process
//           </button>

//           {loading && (
//             <p className="text-blue-500 mt-4 animate-pulse">
//               ⏳ Processing video... Please wait...
//             </p>
//           )}
//         </div>

//         {response && !loading && (
//           <div className="mt-8 space-y-6">
//             <div>
//               <h2 className="text-xl font-semibold text-green-700">📝 Summary</h2>
//               <p className="text-gray-700 mt-2">{response.summary}</p>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-indigo-700">🗣️ Transcript</h2>
//               <p className="text-gray-700 mt-2">{response.transcript}</p>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-yellow-700">❓ Quiz</h2>
//               <pre className="bg-yellow-50 p-3 rounded-lg text-gray-800">{response.quiz}</pre>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-red-700">
//                 🌐 Translated Summary (Hindi)
//               </h2>
//               <p className="text-gray-700 mt-2">{response.translated_summary}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    if (!file.type.startsWith("video/")) {
      return alert("Please upload a valid video file.");
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unknown error occurred");
      }

      setResponse(data);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Failed to process video. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          🎓 SnapStudy - Your Smart Study Partner
        </h1>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

          {file && (
            <video
              src={URL.createObjectURL(file)}
              controls
              className="mt-2 rounded shadow-md max-w-full"
            />
          )}

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            🚀 Upload & Process
          </button>

          {loading && (
            <p className="text-blue-500 mt-4 animate-pulse">
              ⏳ Processing video... Please wait...
            </p>
          )}
          {error && (
            <p className="text-red-600 font-medium mt-2">
              ❌ {error}
            </p>
          )}
        </div>

        {response && !loading && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-green-700">📝 Summary</h2>
              <div className="max-h-60 overflow-y-auto p-3 bg-green-50 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">{response.summary}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-700">🗣️ Transcript</h2>
              <div className="max-h-60 overflow-y-auto p-3 bg-indigo-50 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">{response.transcript}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-700">❓ Quiz</h2>
              <div className="max-h-60 overflow-y-auto p-3 bg-yellow-50 rounded">
                <pre className="text-gray-800 whitespace-pre-wrap">{response.quiz}</pre>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-red-700">
                🌐 Translated Summary (Hindi)
              </h2>
              <div className="max-h-60 overflow-y-auto p-3 bg-red-50 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">{response.translated_summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;



