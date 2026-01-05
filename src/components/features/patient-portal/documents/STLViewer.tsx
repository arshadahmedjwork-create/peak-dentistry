import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface STLViewerProps {
  fileUrl: string;
  fileName: string;
}

// Custom STL Loader component
function STLModel({ url, onLoad }: { url: string; onLoad?: (boundingBox: THREE.Box3) => void }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let isMounted = true;

    fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        if (!isMounted) return;

        // Parse STL file
        const view = new DataView(buffer);
        const isASCII = buffer.byteLength > 5 && 
          String.fromCharCode(view.getUint8(0)) === 's' &&
          String.fromCharCode(view.getUint8(1)) === 'o' &&
          String.fromCharCode(view.getUint8(2)) === 'l' &&
          String.fromCharCode(view.getUint8(3)) === 'i' &&
          String.fromCharCode(view.getUint8(4)) === 'd';

        let geo: THREE.BufferGeometry;

        if (isASCII) {
          // ASCII STL format
          geo = parseASCII(new TextDecoder().decode(buffer));
        } else {
          // Binary STL format
          geo = parseBinary(buffer);
        }

        geo.computeVertexNormals();
        geo.center();
        
        // Compute bounding box and normalize scale
        geo.computeBoundingBox();
        const boundingBox = geo.boundingBox!;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Scale to fit in unit cube
        const scale = 2 / maxDim;
        geo.scale(scale, scale, scale);
        geo.computeBoundingBox();
        
        if (isMounted) {
          setGeometry(geo);
          if (onLoad && geo.boundingBox) {
            onLoad(geo.boundingBox);
          }
        }
      })
      .catch(error => {
        console.error('Error loading STL:', error);
        if (isMounted) {
          toast({
            title: "Loading Error",
            description: "Failed to load 3D model",
            variant: "destructive"
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url, onLoad]);

  const parseBinary = (buffer: ArrayBuffer): THREE.BufferGeometry => {
    const view = new DataView(buffer);
    const faces = view.getUint32(80, true);
    const dataOffset = 84;
    const faceLength = 12 * 4 + 2;

    const vertices = new Float32Array(faces * 3 * 3);
    
    for (let face = 0; face < faces; face++) {
      const start = dataOffset + face * faceLength;
      const vertexStart = start + 12; // Skip normal vector
      
      for (let i = 0; i < 3; i++) {
        const vertexOffset = vertexStart + i * 12;
        const offset = face * 9 + i * 3;
        
        vertices[offset] = view.getFloat32(vertexOffset, true);
        vertices[offset + 1] = view.getFloat32(vertexOffset + 4, true);
        vertices[offset + 2] = view.getFloat32(vertexOffset + 8, true);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  };

  const parseASCII = (data: string): THREE.BufferGeometry => {
    const vertices: number[] = [];
    const patternVertex = /vertex\s+([\d\.\-\+eE]+)\s+([\d\.\-\+eE]+)\s+([\d\.\-\+eE]+)/g;
    let match;

    while ((match = patternVertex.exec(data)) !== null) {
      vertices.push(
        parseFloat(match[1]),
        parseFloat(match[2]),
        parseFloat(match[3])
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  };

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#60a5fa" 
        metalness={0.4} 
        roughness={0.3}
        side={THREE.DoubleSide}
        flatShading={false}
      />
    </mesh>
  );
}

const STLViewer: React.FC<STLViewerProps> = ({ fileUrl, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-white text-sm">Loading 3D model...</p>
        </div>
      )}
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          
          {/* Better lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <pointLight position={[0, 5, 0]} intensity={0.3} />
          <hemisphereLight intensity={0.3} groundColor="#444444" />
          
          {/* Environment for better reflections */}
          <Environment preset="studio" />
          
          <STLModel 
            url={fileUrl} 
            onLoad={() => setIsLoading(false)}
          />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={25}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            panSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-md">
        <p className="font-medium mb-1">{fileName}</p>
        <p className="text-white/70">Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
    </div>
  );
};

export const STLViewerFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
    <p className="text-white text-sm">Loading 3D model...</p>
  </div>
);

export default STLViewer;