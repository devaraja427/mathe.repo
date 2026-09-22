import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Compass,
  Layers,
  Eye,
  Maximize2,
  Minimize2,
  Info,
  Sparkles,
} from 'lucide-react';
import { AnalysisResponse } from '../../types/analysis';

interface VectorSpace3DViewerProps {
  analysis?: AnalysisResponse | null;
  height?: string;
  showControls?: boolean;
}

export const VectorSpace3DViewer: React.FC<VectorSpace3DViewerProps> = ({
  analysis,
  height = '460px',
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showBasis, setShowBasis] = useState<boolean>(true);
  const [showProjection, setShowProjection] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // References for three.js objects to allow dynamic toggle without recreating scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const basisGroupRef = useRef<THREE.Group | null>(null);
  const projectionGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Orbit control state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraRotation = useRef<{ spherical: { radius: number; theta: number; phi: number } }>({
    spherical: { radius: 15, theta: Math.PI / 4, phi: Math.PI / 3 },
  });

  // Calculate coordinates from analysis or default sample
  const getCoordinates = () => {
    if (analysis && analysis.performance_vector && analysis.performance_vector.length >= 3) {
      // Normalize values to fit comfortably in -5 to 5 space
      const p = analysis.performance_vector;
      const maxVal = Math.max(...p.slice(0, 3).map(Math.abs), 1);
      const scale = 5 / maxVal;
      const px = (p[0] || 0) * scale;
      const py = (p[1] || 0) * scale;
      const pz = (p[2] || 0) * scale;

      // Projected vector
      const proj = analysis.projection || [p[0] * 0.9, p[1] * 0.9, 0];
      const projX = (proj[0] || 0) * scale;
      const projY = (proj[1] || 0) * scale;
      const projZ = (proj[2] || 0) * scale;

      return {
        perf: new THREE.Vector3(px, py, pz),
        proj: new THREE.Vector3(projX, projY, projZ),
        pOriginal: [p[0], p[1], p[2]],
        dimNames: analysis.dimension_names?.slice(0, 3) || ['Component 1', 'Component 2', 'Component 3'],
        fidelity: analysis.percentage_representation || 95,
      };
    }

    // Default sample values
    return {
      perf: new THREE.Vector3(4.2, 3.8, 4.5),
      proj: new THREE.Vector3(4.0, 3.5, 0.8),
      pOriginal: [88, 82, 94],
      dimNames: ['STEM/Math', 'Analytical Skills', 'Core Theory'],
      fidelity: 94.8,
    };
  };

  const coords = getCoordinates();

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 460;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    cameraRef.current = camera;

    const updateCameraPos = () => {
      const { radius, theta, phi } = cameraRotation.current.spherical;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPos();

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Clear any previous canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x60a5fa, 2, 50);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // 5. MASTER GROUP
    const masterGroup = new THREE.Group();
    groupRef.current = masterGroup;
    scene.add(masterGroup);

    // 6. 3D COORDINATE GRID & PLANES
    const gridHelper = new THREE.GridHelper(12, 12, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.4;
    gridHelperRef.current = gridHelper;
    masterGroup.add(gridHelper);

    // Subspace Span Plane (Translucent Disc or Plane showing Span of Basis)
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.8,
    });
    const subspacePlane = new THREE.Mesh(planeGeo, planeMat);
    subspacePlane.rotation.x = Math.PI / 2;
    masterGroup.add(subspacePlane);

    // 7. 3D AXES (X: Cyan, Y: Emerald, Z: Indigo)
    const axisRadius = 0.04;
    const axisLength = 5.5;

    const createAxis = (dir: THREE.Vector3, color: number, _name: string) => {
      const axisGroup = new THREE.Group();
      const geom = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 16);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        roughness: 0.3,
      });
      const cylinder = new THREE.Mesh(geom, mat);
      cylinder.position.y = axisLength / 2;

      // Cone head
      const coneGeom = new THREE.ConeGeometry(0.14, 0.4, 16);
      const coneMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
      });
      const cone = new THREE.Mesh(coneGeom, coneMat);
      cone.position.y = axisLength + 0.2;

      axisGroup.add(cylinder);
      axisGroup.add(cone);

      // Rotate to match direction
      if (dir.x === 1) {
        axisGroup.rotation.z = -Math.PI / 2;
      } else if (dir.z === 1) {
        axisGroup.rotation.x = Math.PI / 2;
      }
      return axisGroup;
    };

    masterGroup.add(createAxis(new THREE.Vector3(1, 0, 0), 0x06b6d4, 'X')); // Cyan X
    masterGroup.add(createAxis(new THREE.Vector3(0, 1, 0), 0x10b981, 'Y')); // Emerald Y
    masterGroup.add(createAxis(new THREE.Vector3(0, 0, 1), 0x818cf8, 'Z')); // Indigo Z

    // Origin sphere
    const originGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const originMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.8,
    });
    masterGroup.add(new THREE.Mesh(originGeo, originMat));

    // 8. BASIS VECTORS GROUP
    const basisGroup = new THREE.Group();
    basisGroupRef.current = basisGroup;

    const createVectorArrow = (
      dir: THREE.Vector3,
      length: number,
      color: number,
      radius: number = 0.06
    ) => {
      const vGroup = new THREE.Group();
      const geom = new THREE.CylinderGeometry(radius, radius, length, 16);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
      });
      const cyl = new THREE.Mesh(geom, mat);
      cyl.position.y = length / 2;

      const coneGeom = new THREE.ConeGeometry(radius * 2.5, 0.35, 16);
      const coneMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
      });
      const cone = new THREE.Mesh(coneGeom, coneMat);
      cone.position.y = length + 0.15;

      vGroup.add(cyl);
      vGroup.add(cone);

      const norm = dir.clone().normalize();
      vGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
      return vGroup;
    };

    // Basis e1 (along X), e2 (along Z), e3 (orthogonal combination)
    const e1 = createVectorArrow(new THREE.Vector3(1, 0, 0), 3.2, 0x38bdf8, 0.05);
    const e2 = createVectorArrow(new THREE.Vector3(0, 0, 1), 3.2, 0xa855f7, 0.05);
    const e3 = createVectorArrow(new THREE.Vector3(0.5, 1, 0), 2.8, 0x34d399, 0.05);
    basisGroup.add(e1);
    basisGroup.add(e2);
    basisGroup.add(e3);
    masterGroup.add(basisGroup);

    // 9. STUDENT PERFORMANCE VECTOR & PROJECTION GROUP
    const projGroup = new THREE.Group();
    projectionGroupRef.current = projGroup;

    // Student performance vector (Fuchsia/Pink)
    const pVec = coords.perf;
    const pArrow = createVectorArrow(pVec, pVec.length(), 0xf43f5e, 0.08);
    projGroup.add(pArrow);

    // Glowing tip sphere for student vector
    const tipSphereGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const tipSphereMat = new THREE.MeshStandardMaterial({
      color: 0xff2a5f,
      emissive: 0xff6080,
      emissiveIntensity: 1.2,
    });
    const tipSphere = new THREE.Mesh(tipSphereGeo, tipSphereMat);
    tipSphere.position.copy(pVec);
    projGroup.add(tipSphere);

    // Projected vector onto subspace (Amber/Gold)
    const projVec = coords.proj;
    const projArrow = createVectorArrow(projVec, projVec.length(), 0xfbbf24, 0.07);
    projGroup.add(projArrow);

    const projTipSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xfde047,
        emissiveIntensity: 1.0,
      })
    );
    projTipSphere.position.copy(projVec);
    projGroup.add(projTipSphere);

    // Residual Orthogonal Line (Dashed perpendicular connecting p and proj)
    const lineGeom = new THREE.BufferGeometry().setFromPoints([pVec, projVec]);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xef4444,
      dashSize: 0.2,
      gapSize: 0.1,
      linewidth: 2,
    });
    const residualLine = new THREE.Line(lineGeom, lineMat);
    residualLine.computeLineDistances();
    projGroup.add(residualLine);

    masterGroup.add(projGroup);

    // 10. MOUSE INTERACTION (ORBIT CONTROLS)
    const handleMouseDown = (e: globalThis.MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      const rot = cameraRotation.current.spherical;
      rot.theta -= deltaX * 0.008;
      rot.phi = Math.max(0.1, Math.min(Math.PI - 0.1, rot.phi - deltaY * 0.008));

      updateCameraPos();
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rot = cameraRotation.current.spherical;
      rot.radius = Math.max(6, Math.min(30, rot.radius + e.deltaY * 0.015));
      updateCameraPos();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 11. ANIMATION LOOP
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (autoRotate && !isDragging.current) {
        cameraRotation.current.spherical.theta += 0.004;
        updateCameraPos();
      }

      // Subtle pulse on tip sphere
      const time = Date.now() * 0.003;
      tipSphere.scale.setScalar(1 + Math.sin(time) * 0.1);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, [analysis]);

  // Update visibility toggles
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
    if (basisGroupRef.current) basisGroupRef.current.visible = showBasis;
    if (projectionGroupRef.current) projectionGroupRef.current.visible = showProjection;
  }, [showGrid, showBasis, showProjection]);

  const resetCamera = () => {
    cameraRotation.current.spherical = { radius: 15, theta: Math.PI / 4, phi: Math.PI / 3 };
    if (cameraRef.current) {
      const { radius, theta, phi } = cameraRotation.current.spherical;
      cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
      cameraRef.current.position.y = radius * Math.cos(phi);
      cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-blue-500/20 bg-slate-950 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''
      }`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate 3D view; Scroll to zoom"
      />

      {/* Top Floating Header & Stats */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-500/30 text-xs text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-cyan-300">Interactive 3D Subspace</span>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {coords.fidelity}% Subspace Representation
          </span>
        </div>

        {/* Orbit hint */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700/60 text-[11px] text-slate-400 backdrop-blur-sm pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      {/* Vector Legend / Subspace HUD */}
      <div className="absolute bottom-4 left-4 pointer-events-auto max-w-xs bg-slate-900/85 backdrop-blur-md rounded-xl p-3 border border-slate-800 text-xs text-slate-200 space-y-1.5 shadow-lg">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Vector Subspace HUD</span>
          <Info className="w-3 h-3 text-slate-400" />
        </div>

        <div className="space-y-1 text-[11px]">
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 px-1 py-0.5 rounded transition-colors"
            onMouseEnter={() => setHoveredInfo('Student Performance Vector in R^3')}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
              <span className="font-medium text-slate-200">Student Profile p⃗</span>
            </div>
            <span className="font-mono text-rose-400">
              [{coords.pOriginal.map((v) => Math.round(v)).join(', ')}]
            </span>
          </div>

          <div
            className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 px-1 py-0.5 rounded transition-colors"
            onMouseEnter={() => setHoveredInfo('Orthogonal Projection of p onto Basis Subspace B')}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              <span className="font-medium text-slate-200">Projection proj_B(p⃗)</span>
            </div>
            <span className="font-mono text-amber-400">Orthogonal</span>
          </div>

          <div
            className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 px-1 py-0.5 rounded transition-colors"
            onMouseEnter={() => setHoveredInfo('Gram-Schmidt Orthonormal Basis generating the subspace')}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              <span className="font-medium text-slate-200">Basis Axes e₁, e₂, e₃</span>
            </div>
            <span className="font-mono text-cyan-400">Orthonormal</span>
          </div>

          <div
            className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 px-1 py-0.5 rounded transition-colors"
            onMouseEnter={() => setHoveredInfo('Orthogonal Residual Vector e = p - proj(p)')}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-red-500" />
              <span className="font-medium text-slate-200">Residual Error e ⟂ B</span>
            </div>
            <span className="font-mono text-emerald-400">Minimizing</span>
          </div>
        </div>

        {hoveredInfo && (
          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-cyan-300 italic">
            {hoveredInfo}
          </div>
        )}
      </div>

      {/* Floating Control Buttons */}
      {showControls && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
              autoRotate
                ? 'bg-blue-600/80 text-white border-blue-400/50 shadow-md shadow-blue-500/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title={autoRotate ? 'Pause 3D rotation' : 'Start auto-rotation'}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
              showGrid
                ? 'bg-blue-600/80 text-white border-blue-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle 3D Coordinate Grid"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowBasis(!showBasis)}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
              showBasis
                ? 'bg-blue-600/80 text-white border-blue-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle Basis Vectors"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowProjection(!showProjection)}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
              showProjection
                ? 'bg-blue-600/80 text-white border-blue-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle Projection & Residual"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={resetCamera}
            className="px-2.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 backdrop-blur-md text-[11px] font-semibold transition-all"
            title="Reset Camera Position"
          >
            Reset
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 backdrop-blur-md text-xs transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand 3D Space'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
