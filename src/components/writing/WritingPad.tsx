import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Save, Eye, Download, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const WritingPad: React.FC = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<SignatureCanvas>(null);
  const [brushColor, setBrushColor] = useState('#4F46E5');
  const [brushRadius, setBrushRadius] = useState(3);
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);

  const colors = [
    '#4F46E5', // Primary
    '#06B6D4', // Secondary
    '#22C55E', // Success
    '#F59E0B', // Warning
    '#EF4444', // Error
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#000000', // Black
  ];

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setRecognizedText('');
    }
  };

  const saveDrawing = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.getTrimmedCanvas().toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'writing-practice.png';
      link.href = dataUrl;
      link.click();
    }
  };

  const recognizeText = async () => {
    setIsRecognizing(true);
    
    // Simulate text recognition
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleTexts = [
      'Hello World',
      'VaaniPlus',
      'Learning ISL',
      'Practice Writing',
      'Education for All'
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setRecognizedText(randomText);
    setIsRecognizing(false);
  };

  const exportCanvas = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.getTrimmedCanvas().toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `writing-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('writing.title')}
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={recognizeText} loading={isRecognizing} size="sm">
                <Eye className="h-4 w-4" />
                {t('writing.recognize')}
              </Button>
              <Button variant="outline" onClick={saveDrawing} size="sm">
                <Save className="h-4 w-4" />
                {t('writing.save_writing')}
              </Button>
              <Button variant="outline" onClick={clearCanvas} size="sm">
                <RotateCcw className="h-4 w-4" />
                {t('writing.clear_canvas')}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('writing.instructions')}
          </p>
        </div>
      </Card>

      {/* Drawing Tools */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Drawing Tools</span>
          </h3>
          
          <div className="flex items-center space-x-4">
            {/* Color Palette */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setBrushColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      brushColor === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
            
            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={brushRadius}
                onChange={(e) => setBrushRadius(Number(e.target.value))}
                className="w-20"
                aria-label="Brush size"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6">
                {brushRadius}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card padding="sm">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <SignatureCanvas
            ref={canvasRef}
            penColor={brushColor}
            dotSize={brushRadius}
            canvasProps={{
              width: 800,
              height: 400,
              style: {
                width: '100%',
                height: '400px',
                backgroundColor: '#ffffff',
              },
              className: 'touch-action-none'
            }}
          />
        </div>
      </Card>

      {/* Recognition Result */}
      {recognizedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Recognized Text
              </h3>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-lg font-medium text-primary-800 dark:text-primary-200">
                  "{recognizedText}"
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => navigator.clipboard.writeText(recognizedText)}>
                  Copy Text
                </Button>
                <Button variant="outline" size="sm" onClick={exportCanvas}>
                  <Download className="h-4 w-4" />
                  Export Drawing
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};