import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Simple 3D Avatar Component
const Avatar = ({ animation = 'idle', text = '' }) => {
  const meshRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const [animationPhase, setAnimationPhase] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      // Head bobbing
      meshRef.current.position.y = Math.sin(time * 2) * 0.1;
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }

    // Arm animations based on text/animation type
    if (leftArmRef.current && rightArmRef.current) {
      switch (animation) {
        case 'greeting':
          leftArmRef.current.rotation.z = Math.sin(time * 3) * 0.5 + 0.5;
          rightArmRef.current.rotation.z = -Math.sin(time * 3) * 0.5 - 0.5;
          break;
        case 'signing':
          leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.3;
          rightArmRef.current.rotation.x = Math.cos(time * 2) * 0.3;
          leftArmRef.current.rotation.z = Math.sin(time * 1.5) * 0.4 + 0.2;
          rightArmRef.current.rotation.z = -Math.sin(time * 1.5) * 0.4 - 0.2;
          break;
        default:
          leftArmRef.current.rotation.z = Math.sin(time) * 0.1 + 0.1;
          rightArmRef.current.rotation.z = -Math.sin(time) * 0.1 - 0.1;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.05, 16, 16]} position={[-0.15, 1.6, 0.4]}>
        <meshStandardMaterial color="#000" />
      </Sphere>
      <Sphere args={[0.05, 16, 16]} position={[0.15, 1.6, 0.4]}>
        <meshStandardMaterial color="#000" />
      </Sphere>
      
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
        <Sphere args={[0.1, 16, 16]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ffdbac" />
        </Sphere>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.6, 0.8, 0]}>
        <Box args={[0.2, 0.8, 0.2]}>
          <meshStandardMaterial color="#ffdbac" />
        </Box>
        {/* Hand */}
        <Sphere args={[0.1, 16, 16]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ffdbac" />
        </Sphere>
      </group>
      
      {/* Legs */}
      <Box args={[0.25, 0.8, 0.25]} position={[-0.2, -0.7, 0]}>
        <meshStandardMaterial color="#2563EB" />
      </Box>
      <Box args={[0.25, 0.8, 0.25]} position={[0.2, -0.7, 0]}>
        <meshStandardMaterial color="#2563EB" />
      </Box>
      
      {/* Text display */}
      {text && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#4F46E5"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      )}
    </group>
  );
};

export const ISLAvatar3D = ({ text = '', isAnimating = false, className = '' }) => {
  const [animation, setAnimation] = useState('idle');

  useEffect(() => {
    if (isAnimating && text) {
      setAnimation('signing');
      // Reset to idle after animation
      const timer = setTimeout(() => setAnimation('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, text]);

  return (
    <motion.div
      className={`w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <Avatar animation={animation} text={text} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {isAnimating ? 'Signing...' : 'Ready to sign'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};