import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

export type SlotName = 'answerHeader' | 'availability' | 'price' | 'destination' | 'source';

type Vector = [number, number, number];
type SurfaceName = SlotName | 'photo';
type SurfacePose = { position: Vector; rotation: Vector; scale: number; opacity: number };
type Pose = {
  camera: Vector;
  target: Vector;
  root: Vector;
  scale: number;
  surfaces: Record<SurfaceName, SurfacePose>;
};
type Keyframe = { progress: number; pose: Pose };
type Surface = {
  group: THREE.Group;
  label?: CSS3DObject;
  materials: Array<THREE.Material & { opacity: number }>;
  width: number;
  height: number;
};

export type SpatialScene = {
  render: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
  getMetrics: () => { renders: number; averageMs: number; maxMs: number };
};

const PHOTO_WIDTH = 640;
const PHOTO_HEIGHT = PHOTO_WIDTH / 1.5;
const PHOTO_FRONT = 0.85;
const FOV = 37;
const TANGENT = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const SLOT_DIMENSIONS: Record<SlotName, [number, number]> = {
  answerHeader: [640, 100],
  availability: [300, 98],
  price: [300, 98],
  destination: [640, 80],
  source: [260, 74],
};
const SURFACE_NAMES: SurfaceName[] = ['photo', 'answerHeader', 'availability', 'price', 'destination', 'source'];

function surface(position: Vector, opacity = 1, rotation: Vector = [0, 0, 0], scale = 1): SurfacePose {
  return { position, rotation, scale, opacity };
}

function roundedRectangle(width: number, height: number, radius: number): THREE.Shape {
  const left = -width / 2;
  const right = width / 2;
  const bottom = -height / 2;
  const top = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(left + radius, bottom);
  shape.lineTo(right - radius, bottom);
  shape.quadraticCurveTo(right, bottom, right, bottom + radius);
  shape.lineTo(right, top - radius);
  shape.quadraticCurveTo(right, top, right - radius, top);
  shape.lineTo(left + radius, top);
  shape.quadraticCurveTo(left, top, left, top - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);
  return shape;
}

function buildKeyframes(width: number, height: number): Keyframe[] {
  const mobile = width < 700;
  const cameraDistance = height / (2 * TANGENT);
  const fit = mobile
    ? Math.min((width - 38) / 656, (height - 340) / 740)
    : Math.min(0.92, (height - 280) / 740, (width * 0.58) / 690);
  const scale = Math.max(0.28, fit);
  const centerX = mobile ? 0 : width * 0.195;
  const centerY = (mobile ? -25 : 0) + 6 * scale;
  const restSurfaces: Record<SurfaceName, SurfacePose> = {
    photo: surface([0, 39, 0]),
    answerHeader: surface([0, 314, 0]),
    availability: surface([-170, -235, 14]),
    price: surface([170, -235, 14]),
    destination: surface([0, -336, 14]),
    source: surface([-252, -157, -140], 0),
  };
  const rest: Pose = {
    camera: [0, 0, cameraDistance],
    target: [0, 0, 0],
    root: [centerX, centerY, 0],
    scale,
    surfaces: restSurfaces,
  };
  const heroPhotoScale = mobile
    ? Math.min((width * 0.91) / PHOTO_WIDTH, (height - 330) / PHOTO_HEIGHT)
    : Math.min((width * 0.67) / PHOTO_WIDTH, (height * 0.78) / PHOTO_HEIGHT);
  const heroDistanceFactor = 0.63;
  const hero: Pose = {
    camera: [0, 0, cameraDistance * heroDistanceFactor],
    target: [0, 0, 0],
    root: [(mobile ? 0 : width * 0.165) * heroDistanceFactor, (mobile ? -36 : -6) * heroDistanceFactor, 0],
    scale: heroPhotoScale * heroDistanceFactor,
    surfaces: {
      photo: surface([0, 0, 0], 1, [0.018, -0.07, -0.006]),
      answerHeader: surface([0, 344, -90], 0),
      availability: surface([-205, -270, -90], 0),
      price: surface([205, -290, -50], 0),
      destination: surface([0, -395, -110], 0),
      source: surface([-270, -170, -160], 0),
    },
  };
  const assembly: Pose = {
    camera: [mobile ? -70 : -380, mobile ? 28 : 120, cameraDistance * (mobile ? 1 : 0.9)],
    target: [centerX * 0.5, 0, 0],
    root: [mobile ? 0 : width * 0.16, centerY, 0],
    scale: scale * (mobile ? 0.99 : 0.94),
    surfaces: mobile ? {
      photo: surface([-27, 132, -30], 1, [-0.018, 0.035, 0], 0.84),
      answerHeader: surface([0, 364, 4], 1, [0, 0.01, 0]),
      availability: surface([-113, -91, 95], 1, [-0.045, -0.08, 0.018]),
      price: surface([101, -218, 135], 1, [0.01, -0.11, -0.022]),
      destination: surface([0, -350, 54], 1, [0.035, 0.025, 0]),
      source: surface([-192, -218, -105], 1, [0, 0.06, 0]),
    } : {
      photo: surface([-152, 53, -20], 1, [-0.025, 0.105, -0.012], 0.91),
      answerHeader: surface([-94, 332, 10], 1, [0, 0.02, 0]),
      availability: surface([260, 156, 132], 1, [-0.04, -0.07, 0.025]),
      price: surface([292, -27, 202], 1, [0.025, -0.09, -0.025]),
      destination: surface([82, -292, 84], 1, [0.04, 0.075, 0.01]),
      source: surface([-342, -219, -110], 1, [0.04, 0.15, -0.025]),
    },
  };
  const approach: Pose = {
    camera: [0, 0, cameraDistance * 0.75],
    target: [0, 0, 0],
    root: [centerX * 0.45, centerY * 0.2, 0],
    scale: Math.max(scale, mobile ? 0.65 : 1),
    surfaces: {
      photo: surface([0, 14, 0]),
      answerHeader: surface([0, 380, -55], 0),
      availability: surface([-220, -294, -75], 0),
      price: surface([220, -294, -75], 0),
      destination: surface([0, -405, -90], 0),
      source: surface([-252, -157, -140], 0),
    },
  };
  // Exactly the projection of an object-fit:cover, object-position:center image.
  // Keeping the plane's original 3:2 ratio preserves the photograph throughout.
  const coverDistance = Math.min(
    PHOTO_WIDTH / (2 * TANGENT * (width / height)),
    PHOTO_HEIGHT / (2 * TANGENT),
  );
  const arrival: Pose = {
    camera: [0, 0, coverDistance + PHOTO_FRONT],
    target: [0, 0, PHOTO_FRONT],
    root: [0, 0, 0],
    scale: 1,
    surfaces: {
      photo: surface([0, 0, 0]),
      answerHeader: surface([0, 430, -80], 0),
      availability: surface([-250, -400, -100], 0),
      price: surface([250, -400, -100], 0),
      destination: surface([0, -510, -120], 0),
      source: surface([-252, -157, -140], 0),
    },
  };
  return [
    { progress: 0, pose: hero },
    { progress: 0.035, pose: hero },
    { progress: 0.175, pose: rest },
    { progress: 0.235, pose: rest },
    { progress: 0.40, pose: assembly },
    { progress: 0.465, pose: assembly },
    { progress: 0.615, pose: rest },
    { progress: 0.685, pose: rest },
    { progress: 0.77, pose: approach },
    { progress: 0.855, pose: arrival },
    { progress: 1, pose: arrival },
  ];
}

export function createSpatialScene({ host, slots, onReady, onError }: {
  host: HTMLDivElement;
  slots: Record<SlotName, HTMLElement>;
  onReady: () => void;
  onError: () => void;
}): SpatialScene {
  let disposed = false;
  let failed = false;
  let renders = 0;
  let totalMs = 0;
  let maxMs = 0;
  let lastProgress = -1;
  let width = 1;
  let height = 1;
  let keyframes: Keyframe[] = [];
  let renderer: THREE.WebGLRenderer;
  const reportError = () => {
    if (!disposed && !failed) {
      failed = true;
      onError();
    }
  };
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch {
    reportError();
    return {
      render: () => {}, resize: () => {}, dispose: () => { disposed = true; },
      getMetrics: () => ({ renders: 0, averageMs: 0, maxMs: 0 }),
    };
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.className = 'spatial-webgl';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '0' });
  host.appendChild(renderer.domElement);

  const cssRenderer = new CSS3DRenderer();
  cssRenderer.domElement.className = 'spatial-css';
  Object.assign(cssRenderer.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '2' });
  host.appendChild(cssRenderer.domElement);
  const scene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const root = new THREE.Group();
  const cssRoot = new THREE.Group();
  scene.add(root);
  cssScene.add(cssRoot);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 10000);
  const light = new THREE.DirectionalLight(0xf1eafb, 2.1);
  light.position.set(-420, 620, 950);
  scene.add(light);
  const rim = new THREE.DirectionalLight(0x7970b7, 1.5);
  rim.position.set(600, -30, 120);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xe5e0ff, 0x171820, 1.4));

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const surfaces = {} as Record<SurfaceName, Surface>;
  function makeSurface(name: SurfaceName, panelWidth: number, panelHeight: number, thickness: number): Surface {
    const group = new THREE.Group();
    const geometry = new THREE.ExtrudeGeometry(roundedRectangle(panelWidth, panelHeight, name === 'photo' ? 5 : 9), {
      depth: thickness, bevelEnabled: false, steps: 1, curveSegments: 5,
    });
    geometry.translate(0, 0, -thickness);
    geometries.push(geometry);
    const face = new THREE.MeshStandardMaterial({
      color: name === 'source' ? 0x302442 : 0x171822,
      roughness: 0.58, metalness: 0.035, transparent: true,
    });
    const side = new THREE.MeshStandardMaterial({
      color: name === 'source' ? 0x20162f : 0x0a0c12,
      roughness: 0.34, metalness: 0.12, transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, [face, side]);
    group.add(mesh);
    const edgeGeometry = new THREE.EdgesGeometry(geometry, 28);
    geometries.push(edgeGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: name === 'source' ? 0xa98fce : 0x6b6c7e, transparent: true, opacity: 0.24, depthWrite: false });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    group.add(edges);
    const panelMaterials = [face, side, edgeMaterial];
    materials.push(...panelMaterials);
    root.add(group);
    const result: Surface = { group, materials: panelMaterials, width: panelWidth, height: panelHeight };
    if (name !== 'photo') {
      const element = slots[name];
      Object.assign(element.style, { width: `${panelWidth}px`, height: `${panelHeight}px`, boxSizing: 'border-box', backfaceVisibility: 'hidden' });
      const label = new CSS3DObject(element);
      cssRoot.add(label);
      result.label = label;
    }
    surfaces[name] = result;
    return result;
  }

  const photo = makeSurface('photo', PHOTO_WIDTH + 12, PHOTO_HEIGHT + 12, 15);
  const photoGeometry = new THREE.PlaneGeometry(PHOTO_WIDTH, PHOTO_HEIGHT);
  const photoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, toneMapped: false });
  const photoMesh = new THREE.Mesh(photoGeometry, photoMaterial);
  photoMesh.position.z = PHOTO_FRONT;
  photo.group.add(photoMesh);
  photo.materials.push(photoMaterial);
  geometries.push(photoGeometry);
  materials.push(photoMaterial);
  for (const name of Object.keys(SLOT_DIMENSIONS) as SlotName[]) {
    const [panelWidth, panelHeight] = SLOT_DIMENSIONS[name];
    makeSurface(name, panelWidth, panelHeight, name === 'source' ? 17 : 12);
  }

  const tempCamera = new THREE.Vector3();
  const tempTarget = new THREE.Vector3();
  const labelOffset = new THREE.Vector3();
  const lerp = THREE.MathUtils.lerp;
  function vectorLerp(target: THREE.Vector3, a: Vector, b: Vector, progress: number) {
    target.set(lerp(a[0], b[0], progress), lerp(a[1], b[1], progress), lerp(a[2], b[2], progress));
  }

  function draw(progress: number, force = false) {
    if (disposed || failed || !keyframes.length) return;
    const p = THREE.MathUtils.clamp(progress, 0, 1);
    if (!force && Math.abs(p - lastProgress) < 0.000001) return;
    const start = performance.now();
    lastProgress = p;
    let index = 0;
    while (index < keyframes.length - 2 && keyframes[index + 1].progress < p) index++;
    const previous = keyframes[index];
    const next = keyframes[index + 1];
    const linear = THREE.MathUtils.clamp((p - previous.progress) / (next.progress - previous.progress), 0, 1);
    // Quintic interpolation gives each authored reading hold a zero-velocity,
    // zero-acceleration arrival; no independent time or animation loop exists.
    const ease = linear * linear * linear * (linear * (linear * 6 - 15) + 10);
    const a = previous.pose;
    const b = next.pose;
    vectorLerp(tempCamera, a.camera, b.camera, ease);
    vectorLerp(tempTarget, a.target, b.target, ease);
    camera.position.copy(tempCamera);
    camera.lookAt(tempTarget);
    vectorLerp(root.position, a.root, b.root, ease);
    root.scale.setScalar(lerp(a.scale, b.scale, ease));
    cssRoot.position.copy(root.position);
    cssRoot.scale.copy(root.scale);
    for (const name of SURFACE_NAMES) {
      const item = surfaces[name];
      const first = a.surfaces[name];
      const second = b.surfaces[name];
      vectorLerp(item.group.position, first.position, second.position, ease);
      item.group.rotation.set(
        lerp(first.rotation[0], second.rotation[0], ease),
        lerp(first.rotation[1], second.rotation[1], ease),
        lerp(first.rotation[2], second.rotation[2], ease),
      );
      const itemScale = lerp(first.scale, second.scale, ease);
      item.group.scale.setScalar(itemScale);
      const opacity = lerp(first.opacity, second.opacity, ease);
      item.group.visible = opacity > 0.001;
      for (const material of item.materials) material.opacity = opacity * (material instanceof THREE.LineBasicMaterial ? 0.24 : 1);
      if (item.label) {
        labelOffset.set(0, 0, 1.6 * itemScale).applyEuler(item.group.rotation);
        item.label.position.copy(item.group.position).add(labelOffset);
        item.label.rotation.copy(item.group.rotation);
        item.label.scale.copy(item.group.scale);
        item.label.element.style.opacity = opacity.toFixed(4);
        item.label.element.style.visibility = opacity > 0.003 ? 'visible' : 'hidden';
      }
    }
    renderer.render(scene, camera);
    cssRenderer.render(cssScene, camera);
    const duration = performance.now() - start;
    renders++;
    totalMs += duration;
    maxMs = Math.max(maxMs, duration);
    host.dataset.renderCount = String(renders);
    host.dataset.averageRenderMs = (totalMs / renders).toFixed(3);
    host.dataset.maxRenderMs = maxMs.toFixed(3);
  }

  function resize() {
    if (disposed || failed) return;
    const bounds = host.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    const mobile = width < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    cssRenderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    keyframes = buildKeyframes(width, height);
    draw(Math.max(0, lastProgress), true);
  }

  const contextLost = (event: Event) => {
    event.preventDefault();
    reportError();
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  resize();
  const texture = new THREE.TextureLoader().load('/hotel.webp', (loaded) => {
    if (disposed) { loaded.dispose(); return; }
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    photoMaterial.map = loaded;
    photoMaterial.needsUpdate = true;
    draw(Math.max(0, lastProgress), true);
    if (!failed) onReady();
  }, undefined, reportError);

  return {
    render: draw,
    resize,
    getMetrics: () => ({ renders, averageMs: renders ? totalMs / renders : 0, maxMs }),
    dispose: () => {
      if (disposed) return;
      disposed = true;
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      texture.dispose();
      for (const name of Object.keys(SLOT_DIMENSIONS) as SlotName[]) {
        const label = surfaces[name].label;
        if (label) cssRoot.remove(label);
      }
      renderer.dispose();
      renderer.domElement.remove();
      cssRenderer.domElement.remove();
      scene.clear();
      cssScene.clear();
    },
  };
}
