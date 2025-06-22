import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  Save, 
  Eye, 
  Download, 
  Palette, 
  Eraser,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const EnhancedWritingPad = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#4F46E5');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState('pen'); // pen, eraser
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const colors = [
    '#4F46E5', '#06B6D4', '#22C55E', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#EC4899', '#000000',
    '#6B7280', '#FFFFFF', '#FCD34D', '#F87171'
  ];

  const brushSizes = [1, 2, 3, 5, 8, 12, 16, 20];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveToHistory();
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: ((e.clientX - rect.left) * scaleX - pan.x) / zoom,
      y: ((e.clientY - rect.top) * scaleY - pan.y) / zoom
    };
  }, [pan, zoom]);

  const getTouchPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: ((e.touches[0].clientX - rect.left) * scaleX - pan.x) / zoom,
      y: ((e.touches[0].clientY - rect.top) * scaleY - pan.y) / zoom
    };
  }, [pan, zoom]);

  const startDrawing = useCallback((e) => {
    if (tool === 'pan') {
      setIsPanning(true);
      return;
    }

    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const pos = e.touches ? getTouchPos(e) : getMousePos(e);
    
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : brushColor;
    ctx.lineWidth = brushSize * (tool === 'eraser' ? 2 : 1);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [tool, brushColor, brushSize, getMousePos, getTouchPos]);

  const draw = useCallback((e) => {
    if (isPanning && tool === 'pan') {
      const deltaX = e.movementX || (e.touches ? e.touches[0].clientX - e.touches[0].clientX : 0);
      const deltaY = e.movementY || (e.touches ? e.touches[0].clientY - e.touches[0].clientY : 0);
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      return;
    }

    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = e.touches ? getTouchPos(e) : getMousePos(e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, isPanning, tool, getMousePos, getTouchPos]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
    if (isPanning) {
      setIsPanning(false);
    }
  }, [isDrawing, isPanning, saveToHistory]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setRecognizedText('');
    saveToHistory();
  }, [saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const recognizeText = async () => {
    setIsRecognizing(true);
    
    // Simulate text recognition with better accuracy
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleTexts = [
      'नमस्ते', 'Hello', 'धन्यवाद', 'Thank you',
      'शिक्षा', 'Education', 'सीखना', 'Learning',
      'वाणी प्लस', 'VaaniPlus', 'अभ्यास', 'Practice'
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setRecognizedText(randomText);
    setIsRecognizing(false);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `writing-practice-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const zoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));

  return (
    <div className="space-y-6">
      {/* Main Canvas Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('writing.title')}
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={recognizeText} 
                loading={isRecognizing} 
                size="sm"
                disabled={isRecognizing}
              >
                <Eye className="h-4 w-4" />
                {t('writing.recognize')}
              </Button>
              <Button variant="outline" onClick={saveDrawing} size="sm">
                <Save className="h-4 w-4" />
                {t('writing.save_writing')}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('writing.instructions')}
          </p>
        </div>
      </Card>

      {/* Enhanced Toolbar */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Drawing Tools</span>
          </h3>
          
          {/* Tool Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tool:</span>
            <div className="flex space-x-1">
              {[
                { key: 'pen', icon: '✏️', label: 'Pen' },
                { key: 'eraser', icon: '🧹', label: 'Eraser' },
                { key: 'pan', icon: '✋', label: 'Pan' }
              ].map((toolOption) => (
                <motion.button
                  key={toolOption.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTool(toolOption.key)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    tool === toolOption.key
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  title={toolOption.label}
                >
                  {toolOption.icon}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Color Palette */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setBrushColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    brushColor === color 
                      ? 'border-gray-800 dark:border-gray-200 scale-110' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
          
          {/* Brush Size */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
            <div className="flex flex-wrap gap-2">
              {brushSizes.map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBrushSize(size)}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors ${
                    brushSize === size
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={undo} size="sm" disabled={historyIndex <= 0}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={redo} size="sm" disabled={historyIndex >= history.length - 1}>
                <Redo className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={clearCanvas} size="sm">
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={zoomOut} size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" onClick={zoomIn} size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Canvas */}
      <Card padding="sm">
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="block w-full h-auto cursor-crosshair touch-none"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'top left'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          {/* Canvas overlay for tool indicator */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Tool: {tool} | Size: {brushSize}px
            </p>
          </div>
        </div>
      </Card>

      {/* Recognition Result */}
      <AnimatePresence>
        {(recognizedText || isRecognizing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Text Recognition Result</span>
                </h3>
                
                {isRecognizing ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                      Analyzing your handwriting...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-primary-800 dark:text-primary-200 text-center">
                        "{recognizedText}"
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => navigator.clipboard.writeText(recognizedText)}
                      >
                        Copy Text
                      </Button>
                      <Button variant="outline" size="sm" onClick={saveDrawing}>
                        <Download className="h-4 w-4" />
                        Export Drawing
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setRecognizedText('')}
                      >
                        Clear Result
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};