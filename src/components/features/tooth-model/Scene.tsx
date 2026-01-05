
import React, { useState, useRef, useEffect } from 'react';
import { OrbitControls, Environment, ContactShadows, Bounds, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ToothModel from './ToothModel';

interface SceneProps {
  modelType: string;
  showMarkers: boolean;
  highQuality?: boolean;
  selectedTooth?: string | null;
  onToothSelect?: (toothId: string) => void;
}

const Scene: React.FC<SceneProps> = ({ 
  modelType, 
  showMarkers, 
  highQuality = false,
  selectedTooth = null,
  onToothSelect
}) => {
  const [highlightedModel, setHighlightedModel] = useState(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { camera } = useThree();
  
  // Handle camera zoom animations when a tooth is selected
  useEffect(() => {
    if (selectedTooth && controlsRef.current) {
      // Temporarily disable controls during animation
      controlsRef.current.enableRotate = false;
      
      // Re-enable controls after animation completes
      const timer = setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.enableRotate = true;
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedTooth]);
  
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 10]}
        fov={50}
      />
      
      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={20}
      />
      
      {/* Enhanced environment with better lighting */}
      <Environment preset={highQuality ? "apartment" : "studio"} />
      
      {/* Enhanced ambient lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        castShadow={highQuality}
      />
      <directionalLight 
        position={[-10, 10, -5]} 
        intensity={0.4} 
        color="#E1F5FE"
      />
      
      <ContactShadows 
        opacity={0.5} 
        scale={10} 
        blur={1.5} 
        far={10}
        resolution={highQuality ? 256 : 128}
      />
      
      <Bounds fit clip observe margin={selectedTooth ? 0.5 : 1.2}>
        <ToothModel
          modelType={modelType}
          scale={1.2}
          isHighlighted={highlightedModel === modelType}
          showMarkers={showMarkers}
          selectedTooth={selectedTooth}
          onToothSelect={onToothSelect}
          zoomedToothId={selectedTooth}
        />
      </Bounds>
    </>
  );
};

export default Scene;
