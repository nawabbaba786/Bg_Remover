'use client';

import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiDownload, FiLock, FiUnlock } from 'react-icons/fi';
import { formatBytes } from '@/lib/utils';

export default function ImageResizer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalInfo, setOriginalInfo] = useState({ width: 0, height: 0, size: 0 });
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quality, setQuality] = useState(90);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [resizedImage, setResizedImage] = useState(null);
  const [newSize, setNewSize] = useState(0);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(event.target.result);
          setOriginalInfo({ width: img.width, height: img.height, size: file.size });
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
          setNewSize(file.size);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!originalImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      canvas.width = width || 0;
      canvas.height = height || 0;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          setResizedImage(URL.createObjectURL(blob));
          setNewSize(blob.size);
        }
      }, 'image/jpeg', quality / 100);
    };
  }, [width, height, quality, originalImage]);

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    if (lockAspectRatio) setHeight(Math.round(newWidth / aspectRatio));
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    if (lockAspectRatio) setWidth(Math.round(newHeight * aspectRatio));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Image Resizer & Compressor</h2>
      {!originalImage ? (
        <div className="w-full flex justify-center">
            <label className="w-full max-w-lg flex flex-col items-center px-4 py-12 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
              <FiUpload className="w-12 h-12"/>
              <span className="mt-2 text-base leading-normal">Click to upload an image</span>
              <input type='file' className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
            </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit">
            <h3 className="text-xl font-semibold mb-4">Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dimensions (px)</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input type="number" value={width} onChange={handleWidthChange} className="w-full border-gray-300 rounded-md shadow-sm p-2" placeholder="Width"/>
                  <button onClick={() => setLockAspectRatio(!lockAspectRatio)} className="p-2 text-gray-500 hover:text-blue-500 text-xl">{lockAspectRatio ? <FiLock/> : <FiUnlock/>}</button>
                  <input type="number" value={height} onChange={handleHeightChange} className="w-full border-gray-300 rounded-md shadow-sm p-2" placeholder="Height"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quality: {quality}%</label>
                <input type="range" min="0" max="100" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"/>
              </div>
              <div className="border-t pt-4 space-y-2">
                <p><strong>Original Size:</strong> {formatBytes(originalInfo.size)}</p>
                <p className="text-lg"><strong>New Size:</strong> <span className="text-green-600 font-bold">{formatBytes(newSize)}</span></p>
              </div>
              <a href={resizedImage} download="resized-image.jpg" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-600 flex items-center justify-center text-center">
                <FiDownload className="mr-2" /> Download Image
              </a>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-lg flex items-center justify-center bg-transparent-grid bg-transparent-grid-size">
            {resizedImage && <img src={resizedImage} alt="Resized preview" className="max-w-full max-h-[80vh] object-contain"/>}
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      )}
    </div>
  );
        }
        
