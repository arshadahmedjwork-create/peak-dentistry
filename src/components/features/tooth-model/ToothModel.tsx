
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBounds } from '@react-three/drei';
import * as THREE from 'three';
import Marker from './Marker';
import { getModelByType } from './ModelGeometries';
import { getMarkersByType } from './ModelDefinitions';
import { toast } from '@/hooks/use-toast';

interface ToothModelProps {
  modelType: string;
  position?: [number, number, number];
  scale?: number;
  isHighlighted?: boolean;
  showMarkers?: boolean;
  selectedTooth?: string | null;
  onToothSelect?: (toothId: string) => void;
  zoomedToothId?: string | null;
}

const ToothModel: React.FC<ToothModelProps> = ({ 
  modelType, 
  position = [0, 0, 0], 
  scale = 1, 
  isHighlighted = false, 
  showMarkers = true,
  selectedTooth = null,
  onToothSelect,
  zoomedToothId = null
}) => {
  const meshRef = useRef<THREE.Group>();
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [markers, setMarkers] = useState([]);
  const bounds = useBounds();
  
  // Define markers based on model type
  useEffect(() => {
    setMarkers(getMarkersByType(modelType));
  }, [modelType]);
  
  useFrame(() => {
    if (meshRef.current && !isHighlighted && modelType !== 'fullMouth') {
      meshRef.current.rotation.y += 0.003;
    }
  });
  
  const handleMarkerClick = (label: string) => {
    toast({
      title: label,
      description: `Information about ${label.toLowerCase()} structure`,
    });
    
    // Use empty object for default behavior
    bounds.refresh().fit();
  };
  
  return (
    <group 
      ref={meshRef}
      position={position} 
      scale={[scale, scale, scale]}
      rotation={rotation}
    >
      {getModelByType(modelType, selectedTooth, onToothSelect, zoomedToothId)}
      
      {showMarkers && markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          label={marker.label}
          color={marker.color}
          onClick={handleMarkerClick}
        />
      ))}
    </group>
  );
};

export default ToothModel;
