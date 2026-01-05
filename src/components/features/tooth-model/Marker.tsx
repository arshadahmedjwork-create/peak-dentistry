
import React, { useState } from 'react';
import { Html } from '@react-three/drei';

interface MarkerProps {
  position: [number, number, number];
  label: string;
  color?: string;
  onClick: (label: string) => void;
}

const Marker: React.FC<MarkerProps> = ({ position, label, color = '#ff0000', onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(label)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={color} transparent opacity={hovered ? 0.8 : 0.6} />
      </mesh>
      {hovered && (
        <Html center>
          <div className="bg-background border rounded-md shadow-lg px-2 py-1 text-xs whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

export default Marker;
