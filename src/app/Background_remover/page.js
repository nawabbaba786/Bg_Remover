'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiDownload, FiLayers, FiTrash2 } from 'react-icons/fi';

const mockApiCall = async (imageFile) => {
  console.log('Simulating API call for:', imageFile.name);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        objects: [
          { id: 'obj1', name: 'Person 1', mask: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
          { id: 'obj2', name: 'Object A', mask: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
        ],
      });
    }, 2000);
  });
};

export default function BackgroundRemover() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState(new Set());
  const [finalImage, setFinalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        resetState();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetState = () => {
    setDetectedObjects([]);
    setSelectedObjects(new Set());
    setFinalImage(null);
  }

  const processImage = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setFinalImage(null);

    const response = await mockApiCall(imageFile);

    if (response.success) {
      setDetectedObjects(response.objects);
      const allObjectIds = new Set(response.objects.map(obj => obj.id));
      setSelectedObjects(allObjectIds);
    } else {
      alert("Failed to detect objects.");
    }
    setIsLoading(false);
  };

  const toggleObjectSelection = (objectId) => {
    const newSelection = new Set(selectedObjects);
    if (newSelection.has(objectId)) newSelection.delete(objectId);
    else newSelection.add(objectId);
    setSelectedObjects(newSelection);
  };

  const removeBackground = () => {
    if (!image || detectedObjects.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const originalImg = new window.Image();
    originalImg.src = image;

    originalImg.onload = () => {
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maskPromises = detectedObjects
        .filter(obj => selectedObjects.has(obj.id))
        .map(obj => new Promise(resolve => {
          const maskImg = new window.Image();
          maskImg.src = obj.mask;
          maskImg.onload = () => resolve(maskImg);
        }));

      Promise.all(maskPromises).then(loadedMasks => {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = originalImg.width;
        maskCanvas.height = originalImg.height;
        const maskCtx = maskCanvas.getContext('2d');

        loadedMasks.forEach(mask => maskCtx.drawImage(mask, 0, 0, originalImg.width, originalImg.height));

        ctx.drawImage(originalImg, 0, 0);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';

        setFinalImage(canvas.toDataURL('image/png'));
      });
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Advanced Background Remover</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit">
          <h3 className="text-xl font-semibold mb-4">Controls</h3>
          <div className="space-y-4">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-blue-500 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-600">
              <FiUpload className="w-8 h-8"/>
              <span className="mt-2 text-base leading-normal">{imageFile ? "Change Image" : "Select an image"}</span>
              <input type='file' className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
            </label>

            <button onClick={processImage} disabled={!image || isLoading || detectedObjects.length > 0} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center">
              <FiLayers className="mr-2" />
              {isLoading ? 'Processing...' : '1. Detect Objects'}
            </button>

            {detectedObjects.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Detected Objects:</h4>
                <div className="space-y-2">
                  {detectedObjects.map(obj => (
                    <div key={obj.id} className="flex items-center">
                      <input type="checkbox" id={obj.id} checked={selectedObjects.has(obj.id)} onChange={() => toggleObjectSelection(obj.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                      <label htmlFor={obj.id} className="ml-3 block text-sm font-medium text-gray-700">{obj.name}</label>
                    </div>
                  ))}
                </div>
                 <button onClick={removeBackground} disabled={detectedObjects.length === 0} className="mt-4 w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400">
                   2. Remove Background
                </button>
              </div>
            )}

            {finalImage && (
              <a href={finalImage} download="result.png" className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 flex items-center justify-center text-center">
                <FiDownload className="mr-2" /> Download Image
              </a>
            )}
          </div>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-lg flex items-center justify-center min-h-[400px] bg-transparent-grid bg-transparent-grid-size">
          {!image && <p className="text-gray-500">Upload an image to start</p>}
          {isLoading && <div className="text-center"><p className="text-lg font-semibold">Detecting objects...</p></div>}
          {finalImage ? (<img src={finalImage} alt="Final result" className="max-w-full max-h-[80vh] object-contain"/>) : (image && !isLoading && <img src={image} alt="Uploaded" className="max-w-full max-h-[80vh] object-contain"/>)}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      </div>
    </div>
  );
                                   }
    
