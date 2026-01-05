
import React, { useRef } from 'react';
import * as THREE from 'three';
import { MeshPhysicalMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

// Animation for the zoomed tooth
const ZoomedTooth = ({ position, toothId, type }) => {
  // Fix the ref type by explicitly typing it as a THREE.Group
  const toothRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (toothRef.current) {
      // Add subtle floating animation
      toothRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
      // Slow rotation animation
      toothRef.current.rotation.y += 0.01;
    }
  });
  
  // Display the appropriate tooth model based on type
  return (
    <group ref={toothRef} position={position} scale={[1.5, 1.5, 1.5]}>
      {type === 'molar' ? <MolarModel /> : <IncisorModel />}
    </group>
  );
};

// Full mouth model with upper and lower jaws with clickable teeth
export const FullMouthModel = ({ selectedTooth, onToothSelect, zoomedToothId }) => {
  const teeth = {
    'upper-incisor-1': { position: [0, 0.5, 1], type: 'incisor' },
    'upper-incisor-2': { position: [0.5, 0.5, 0.95], type: 'incisor' },
    'upper-canine': { position: [1.2, 0.5, 0.8], type: 'incisor' },
    'upper-premolar-1': { position: [1.6, 0.5, 0.5], type: 'molar' },
    'upper-premolar-2': { position: [1.9, 0.5, 0.2], type: 'molar' },
    'upper-molar-1': { position: [2, 0.5, -0.2], type: 'molar' },
    'upper-molar-2': { position: [1.8, 0.5, -0.6], type: 'molar' },
    'lower-incisor-1': { position: [0, -0.8, 1], type: 'incisor' },
    'lower-incisor-2': { position: [0.5, -0.8, 0.95], type: 'incisor' },
    'lower-canine': { position: [1.2, -0.8, 0.8], type: 'incisor' },
    'lower-premolar-1': { position: [1.6, -0.8, 0.5], type: 'molar' },
    'lower-premolar-2': { position: [1.9, -0.8, 0.2], type: 'molar' },
    'lower-molar-1': { position: [2, -0.8, -0.2], type: 'molar' },
    'lower-molar-2': { position: [1.8, -0.8, -0.6], type: 'molar' },
  };

  // Mirror the teeth for the left side
  const allTeeth = { ...teeth };
  Object.keys(teeth).forEach(key => {
    const tooth = teeth[key];
    const leftKey = key.replace('upper', 'upper-left').replace('lower', 'lower-left');
    allTeeth[leftKey] = { 
      ...tooth, 
      position: [-tooth.position[0], tooth.position[1], tooth.position[2]] 
    };
  });

  // Create enhanced tooth material
  const toothEnameledMaterial = new MeshPhysicalMaterial({
    color: '#f8f8f8',
    roughness: 0.2, 
    metalness: 0.1,
    clearcoat: 0.8,       // Add clear coat layer
    clearcoatRoughness: 0.2,
    reflectivity: 0.5,
    transmission: 0.1,    // Slight translucency
    ior: 1.5              // Index of refraction similar to actual teeth
  });

  const selectedToothMaterial = new MeshPhysicalMaterial({
    color: '#fffdea',      // Slightly warmer color for selected
    roughness: 0.15,       
    metalness: 0.12,
    clearcoat: 1.0,        // More glossy when selected
    clearcoatRoughness: 0.1,
    reflectivity: 0.6,
    transmission: 0.15,
    ior: 1.5,
    emissive: new THREE.Color('#ffcc00'),
    emissiveIntensity: 0.3
  });

  // Check if we should render all teeth or just the zoomed tooth
  if (zoomedToothId && allTeeth[zoomedToothId]) {
    const tooth = allTeeth[zoomedToothId];
    return (
      <ZoomedTooth 
        position={tooth.position} 
        toothId={zoomedToothId} 
        type={tooth.type} 
      />
    );
  }

  return (
    <>
      {/* Render each tooth with click handler */}
      {Object.entries(allTeeth).map(([toothId, tooth]) => (
        <mesh 
          key={toothId}
          position={tooth.position as [number, number, number]}
          scale={[0.3, 0.8, 0.3]}
          onClick={(e) => {
            e.stopPropagation();
            if (onToothSelect) onToothSelect(toothId);
          }}
          userData={{ toothType: tooth.type }}
        >
          <capsuleGeometry args={[0.2, 0.6, 4, 16]} />
          <primitive 
            object={selectedTooth === toothId ? selectedToothMaterial : toothEnameledMaterial} 
          />
        </mesh>
      ))}
      
      {/* Upper jaw */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.4, 16, 32, Math.PI]} />
        <meshPhysicalMaterial 
          color="#e8e8e8" 
          roughness={0.7}
          clearcoat={0.1}
        />
      </mesh>
      
      {/* Lower jaw */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.4, 16, 32, Math.PI]} />
        <meshPhysicalMaterial 
          color="#e8e8e8" 
          roughness={0.7}
          clearcoat={0.1}
        />
      </mesh>
    </>
  );
};

// Molar tooth model
export const MolarModel = () => {
  // Enhanced materials with physical properties
  const crownMaterial = new MeshPhysicalMaterial({
    color: '#f0f0f0',
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    reflectivity: 0.6,
    transmission: 0.1,
    ior: 1.5
  });
  
  const cuspMaterial = new MeshPhysicalMaterial({
    color: '#f5f5f5',
    roughness: 0.15,
    metalness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.7,
    transmission: 0.15,
    ior: 1.5
  });
  
  const rootMaterial = new MeshPhysicalMaterial({
    color: '#e0e0e0',
    roughness: 0.5,
    metalness: 0.05,
    clearcoat: 0.3,
    transmission: 0.05,
    ior: 1.4
  });

  return (
    <>
      {/* Crown */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <primitive object={crownMaterial} />
        
        {/* Cusps */}
        <mesh position={[0.3, 0.4, 0.3]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <primitive object={cuspMaterial} />
        </mesh>
        <mesh position={[-0.3, 0.4, 0.3]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <primitive object={cuspMaterial} />
        </mesh>
        <mesh position={[0.3, 0.4, -0.3]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <primitive object={cuspMaterial} />
        </mesh>
        <mesh position={[-0.3, 0.4, -0.3]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <primitive object={cuspMaterial} />
        </mesh>
      </mesh>
      
      {/* Root structure */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.5, 0.2, 2, 32]} />
        <primitive object={rootMaterial} />
      </mesh>
    </>
  );
};

// Incisor tooth model
export const IncisorModel = () => {
  // Enhanced materials with physical properties
  const crownMaterial = new MeshPhysicalMaterial({
    color: '#f5f5f5',
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    reflectivity: 0.7,
    transmission: 0.2,
    ior: 1.5
  });
  
  const rootMaterial = new MeshPhysicalMaterial({
    color: '#e0e0e0',
    roughness: 0.5,
    metalness: 0.05,
    clearcoat: 0.3,
    transmission: 0.05,
    ior: 1.4
  });

  return (
    <>
      {/* Crown */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.5, 0.3]} />
        <primitive object={crownMaterial} />
      </mesh>
      
      {/* Root */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.2, 2, 32]} />
        <primitive object={rootMaterial} />
      </mesh>
    </>
  );
};

// Dental implant model
export const ImplantModel = () => {
  const crownMaterial = new MeshPhysicalMaterial({
    color: '#d0d0d0',
    roughness: 0.2,
    metalness: 0.6,
    clearcoat: 0.9,
    reflectivity: 0.7,
    transmission: 0.1,
    ior: 1.5
  });
  
  const abutmentMaterial = new MeshPhysicalMaterial({
    color: '#a0a0a0',
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 0.5,
    reflectivity: 0.9
  });
  
  const implantMaterial = new MeshPhysicalMaterial({
    color: '#707070',
    roughness: 0.05,
    metalness: 0.95,
    clearcoat: 0.5,
    reflectivity: 1.0
  });
  
  const threadMaterial = new MeshPhysicalMaterial({
    color: '#505050',
    roughness: 0.05,
    metalness: 0.95,
    clearcoat: 0.3,
    reflectivity: 1.0
  });

  return (
    <>
      {/* Artificial crown */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 32]} />
        <primitive object={crownMaterial} />
      </mesh>
      
      {/* Abutment */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 32]} />
        <primitive object={abutmentMaterial} />
      </mesh>
      
      {/* Implant fixture */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 2, 32]} />
        <primitive object={implantMaterial} />
        
        {/* Threads */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, -0.8 + i * 0.2, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <primitive object={threadMaterial} />
          </mesh>
        ))}
      </mesh>
    </>
  );
};

// Get the appropriate model component based on the modelType
export const getModelByType = (modelType: string, selectedTooth: string | null = null, onToothSelect = null, zoomedToothId = null) => {
  switch (modelType) {
    case 'fullMouth':
      return <FullMouthModel selectedTooth={selectedTooth} onToothSelect={onToothSelect} zoomedToothId={zoomedToothId} />;
    case 'molar':
      return <MolarModel />;
    case 'incisor':
      return <IncisorModel />;
    case 'implant':
      return <ImplantModel />;
    default:
      return (
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial 
            color="#f0f0f0"
            roughness={0.2}
            metalness={0.1}
            clearcoat={0.8}
            transmission={0.1}
            ior={1.5}
          />
        </mesh>
      );
  }
};
