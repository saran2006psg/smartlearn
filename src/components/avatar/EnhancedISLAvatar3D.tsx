import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface AnimationKeyframe {
  time: number;
  right_hand: number[];
  left_hand: number[];
}

interface SignAnimation {
  sign: string;
  start_time: number;
  end_time: number;
  keyframes: AnimationKeyframe[];
}

interface AnimationData {
  signs: SignAnimation[];
  total_duration: number;
  fps: number;
}

interface EnhancedISLAvatar3DProps {
  animationData?: AnimationData;
  isPlaying?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}

const Avatar: React.FC<{
  animationData?: AnimationData;
  isPlaying: boolean;
  onAnimationComplete?: () => void;
}> = ({ animationData, isPlaying, onAnimationComplete }) => {
  const meshRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useFrame((state, delta) => {
    if (!isPlaying || !animationData || isAnimationComplete) {
      // Default idle animation
      if (meshRef.current) {
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      }
      
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.1 + 0.1;
        rightArmRef.current.rotation.z = -Math.sin(state.clock.getElapsedTime()) * 0.1 - 0.1;
      }
      return;
    }

    // Update animation time
    const newTime = currentTime + delta;
    setCurrentTime(newTime);

    // Check if animation is complete
    if (newTime >= animationData.total_duration) {
      setIsAnimationComplete(true);
      onAnimationComplete?.();
      return;
    }

    // Find current sign and interpolate keyframes
    const currentSign = animationData.signs.find(
      sign => newTime >= sign.start_time && newTime <= sign.end_time
    );

    if (currentSign && leftArmRef.current && rightArmRef.current) {
      const localTime = newTime - currentSign.start_time;
      const signDuration = currentSign.end_time - currentSign.start_time;
      const progress = localTime / signDuration;

      // Find surrounding keyframes
      const keyframes = currentSign.keyframes;
      let prevKeyframe = keyframes[0];
      let nextKeyframe = keyframes[keyframes.length - 1];

      for (let i = 0; i < keyframes.length - 1; i++) {
        const currentKeyframeTime = keyframes[i].time - currentSign.start_time;
        const nextKeyframeTime = keyframes[i + 1].time - currentSign.start_time;
        
        if (localTime >= currentKeyframeTime && localTime <= nextKeyframeTime) {
          prevKeyframe = keyframes[i];
          nextKeyframe = keyframes[i + 1];
          break;
        }
      }

      // Interpolate between keyframes
      const keyframeDuration = (nextKeyframe.time - currentSign.start_time) - (prevKeyframe.time - currentSign.start_time);
      const keyframeProgress = keyframeDuration > 0 ? 
        (localTime - (prevKeyframe.time - currentSign.start_time)) / keyframeDuration : 0;

      // Smooth interpolation using easing
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const smoothProgress = easeInOutCubic(Math.max(0, Math.min(1, keyframeProgress)));

      // Interpolate right hand position
      const rightHandPos = prevKeyframe.right_hand.map((start, index) => {
        const end = nextKeyframe.right_hand[index];
        return start + (end - start) * smoothProgress;
      });

      // Interpolate left hand position
      const leftHandPos = prevKeyframe.left_hand.map((start, index) => {
        const end = nextKeyframe.left_hand[index];
        return start + (end - start) * smoothProgress;
      });

      // Apply positions
      rightArmRef.current.position.set(rightHandPos[0], rightHandPos[1], rightHandPos[2]);
      leftArmRef.current.position.set(leftHandPos[0], leftHandPos[1], leftHandPos[2]);

      // Add some rotation based on position for more natural movement
      rightArmRef.current.rotation.z = -rightHandPos[0] * 0.5 - 0.2;
      leftArmRef.current.rotation.z = -leftHandPos[0] * 0.5 + 0.2;
    }

    // Head movement following the hands
    if (meshRef.current && (leftArmRef.current || rightArmRef.current)) {
      const rightPos = rightArmRef.current?.position || new THREE.Vector3();
      const leftPos = leftArmRef.current?.position || new THREE.Vector3();
      const avgX = (rightPos.x + leftPos.x) / 2;
      
      meshRef.current.rotation.y = avgX * 0.3;
      meshRef.current.position.y = 0.1 + Math.abs(avgX) * 0.1;
    }
  });

  // Reset animation when new data is provided
  useEffect(() => {
    if (animationData && isPlaying) {
      setCurrentTime(0);
      setIsAnimationComplete(false);
    }
  }, [animationData, isPlaying]);

  return (
    <group>
      {/* Head */}
      <group ref={meshRef}>
        <Sphere args={[0.5, 32, 32]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#ffdbac" />
        </Sphere>
        
        {/* Eyes */}
        <Sphere args={[0.05, 16, 16]} position={[-0.15, 1.6, 0.4]}>
          <meshStandardMaterial color="#000" />
        </Sphere>
        <Sphere args={[0.05, 16, 16]} position={[0.15, 1.6, 0.4]}>
          <meshStandardMaterial color="#000" />
        </Sphere>
        
        {/* Mouth */}
        <Box args={[0.2, 0.05, 0.05]} position={[0, 1.4, 0.4]}>
          <meshStandardMaterial color="#ff6b6b" />
        </Box>
      </group>
      
      {/* Body */}
      <Box args={[0.8, 1.2, 0.4]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#4F46E5" />
      </Box>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.6, 0.8, 0]}>
        <Box args={[0.2, 0.8, 0.2]}>
          <meshStandardMaterial color="#ffdbac" />
        </Box>
        {/* Hand */}
        <Sphere args={[0.12, 16, 16]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ffdbac" />
        </Sphere>
        {/* Fingers */}
        {[...Array(5)].map((_, i) => (
          <Box key={i} args={[0.03, 0.15, 0.03]} position={[-0.08 + i * 0.04, -0.6, 0.05]}>
            <meshStandardMaterial color="#ffdbac" />
          </Box>
        ))}
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.6, 0.8, 0]}>
        <Box args={[0.2, 0.8, 0.2]}>
          <meshStandardMaterial color="#ffdbac" />
        </Box>
        {/* Hand */}
        <Sphere args={[0.12, 16, 16]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ffdbac" />
        </Sphere>
        {/* Fingers */}
        {[...Array(5)].map((_, i) => (
          <Box key={i} args={[0.03, 0.15, 0.03]} position={[-0.08 + i * 0.04, -0.6, 0.05]}>
            <meshStandardMaterial color="#ffdbac" />
          </Box>
        ))}
      </group>
      
      {/* Legs */}
      <Box args={[0.25, 0.8, 0.25]} position={[-0.2, -0.7, 0]}>
        <meshStandardMaterial color="#2563EB" />
      </Box>
      <Box args={[0.25, 0.8, 0.25]} position={[0.2, -0.7, 0]}>
        <meshStandardMaterial color="#2563EB" />
      </Box>
      
      {/* Current sign display */}
      {animationData && isPlaying && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#4F46E5"
          anchorX="center"
          anchorY="middle"
        >
          {animationData.signs.find(sign => 
            currentTime >= sign.start_time && currentTime <= sign.end_time
          )?.sign || ''}
        </Text>
      )}
    </group>
  );
};

export const EnhancedISLAvatar3D: React.FC<EnhancedISLAvatar3DProps> = ({
  animationData,
  isPlaying = false,
  className = '',
  onAnimationComplete
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (animationData && isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (animationData.total_duration * 10));
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [animationData, isPlaying]);

  return (
    <motion.div
      className={`w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
        
        <Avatar 
          animationData={animationData} 
          isPlaying={isPlaying}
          onAnimationComplete={onAnimationComplete}
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={!isPlaying}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isPlaying ? 'Signing...' : 'Ready to sign'}
            </p>
            {animationData && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {animationData.signs.length} signs
              </p>
            )}
          </div>
          
          {/* Progress bar */}
          {isPlaying && animationData && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sign list overlay */}
      {animationData && animationData.signs.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Signs to perform:
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {animationData.signs.map((sign, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between"
              >
                <span className="capitalize">{sign.sign.replace('_', ' ')}</span>
                <span>{(sign.end_time - sign.start_time).toFixed(1)}s</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};