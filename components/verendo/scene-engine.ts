import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";

export type VerendoSceneController = {
  setActive: (active: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
};

/** The editable, faceted V. Loaded only when its container approaches the viewport. */
export function createVerendoScene(
  host: HTMLDivElement,
  variant: "hero" | "footer",
  onContextLost: () => void,
): VerendoSceneController {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  const gpu = context
    ? new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      })
    : null;
  // Keep the same geometry and motion on browsers without WebGL, using simpler shading.
  const vector = gpu ? null : new SVGRenderer();
  const renderer = gpu ?? vector!;
  let disposed = false;
  let lost = false;
  let active = false;
  let reduced = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  const cleanup: Array<() => void> = [];
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stop();
    cleanup.reverse().forEach((release) => release());
    gpu?.dispose();
    gpu?.forceContextLoss();
    renderer.domElement.remove();
  };

  try {
    gpu?.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    gpu?.setClearColor(0x000000, 0);
    vector?.setQuality("high");
    vector?.setPrecision(2);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (gpu) {
      gpu.toneMapping = THREE.ACESFilmicToneMapping;
      gpu.toneMappingExposure = 1.05;
    }
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.setAttribute("data-renderer", gpu ? "webgl" : "svg");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    if (gpu) {
      const room = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(gpu);
      let environment: THREE.WebGLRenderTarget;
      try {
        environment = pmrem.fromScene(room, 0.035);
      } finally {
        room.dispose();
        pmrem.dispose();
      }
      scene.environment = environment.texture;
      cleanup.push(() => environment.dispose());
    }

    const shape = new THREE.Shape();
    shape.moveTo(-1.65, 1.5);
    shape.lineTo(-0.82, 1.5);
    shape.lineTo(0, -0.63);
    shape.lineTo(0.82, 1.5);
    shape.lineTo(1.65, 1.5);
    shape.lineTo(0.34, -1.55);
    shape.lineTo(-0.34, -1.55);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.6,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      curveSegments: 1,
    });
    geometry.center();
    cleanup.push(() => geometry.dispose());
    const front = new THREE.MeshPhysicalMaterial({
      color: 0x45484d,
      metalness: 1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.75,
    });
    const sides = new THREE.MeshPhysicalMaterial({
      color: 0xc3c7ce,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.8,
    });
    cleanup.push(
      () => front.dispose(),
      () => sides.dispose(),
    );
    const sculpture = new THREE.Group();
    sculpture.add(new THREE.Mesh(geometry, [front, sides]));
    const edges = new THREE.EdgesGeometry(geometry, 25);
    const outline = new THREE.LineBasicMaterial({
      color: 0xd4d9e0,
      transparent: true,
      opacity: 0.32,
    });
    cleanup.push(
      () => edges.dispose(),
      () => outline.dispose(),
    );
    sculpture.add(new THREE.LineSegments(edges, outline));
    scene.add(sculpture);

    const key = new THREE.DirectionalLight(0xffffff, 3.5);
    key.position.set(-4, 6, 5);
    const rim = new THREE.DirectionalLight(0xd9e5ff, 2);
    rim.position.set(4, -1, -4);
    scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0x111116, 0.7));
    if (vector) scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    let distance = variant === "hero" ? 9.1 : 6.8;
    const draw = () => {
      if (disposed || lost) return;
      const time = reduced ? 0 : elapsed;
      sculpture.rotation.set(
        0.12 + Math.sin(time * 0.28) * 0.1,
        0.36 + Math.sin(time * 0.24) * 0.68,
        -0.055 + Math.sin(time * 0.2) * 0.075,
      );
      sculpture.position.y =
        (variant === "hero" ? 0.45 : 0) + Math.sin(time * 0.52) * 0.12;
      camera.position.set(Math.sin(time * 0.16) * 0.15, 0.1, distance);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (vector) vector.domElement.style.backgroundColor = "transparent";
    };
    const tick = (now: number) => {
      if (!active || reduced || disposed || lost) {
        stop();
        return;
      }
      if (!previous || now - previous >= 1000 / 30) {
        if (previous) elapsed += Math.min((now - previous) / 1000, 0.05);
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      stop();
      if (disposed || lost) return;
      draw();
      if (active && !reduced) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      if (disposed || lost) return;
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      distance = Math.max(
        variant === "hero" ? 9.1 : 6.8,
        3.9 / (2 * Math.tan(Math.PI / 10) * camera.aspect),
      );
      camera.updateProjectionMatrix();
      if (gpu) gpu.setSize(width, height, false);
      else vector!.setSize(width, height);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    cleanup.push(() => observer.disconnect());
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      stop();
      onContextLost();
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    cleanup.push(() =>
      renderer.domElement.removeEventListener("webglcontextlost", contextLost),
    );
    resize();

    return {
      setActive(value) {
        if (active === value) return;
        active = value;
        updatePlayback();
      },
      setReducedMotion(value) {
        if (reduced === value) return;
        reduced = value;
        updatePlayback();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
