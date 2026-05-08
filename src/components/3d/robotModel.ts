import * as THREE from 'three';

export const ROBOT_MODEL_URL =
  'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb';

export function findRobotAnimation(
  names: string[],
  preferred: readonly string[],
): string | undefined {
  return preferred.find((name) => names.includes(name)) ?? names[0];
}

export function tintRobotMaterials(scene: THREE.Object3D, accent: string) {
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      obj.castShadow = false;
      obj.receiveShadow = false;

      const material = (obj as THREE.Mesh).material;
      if (Array.isArray(material)) {
        material.forEach((entry) => {
          if ('emissive' in entry) {
            entry.emissive = new THREE.Color(accent);
            entry.emissiveIntensity = 0.5;
          }
        });
        return;
      }

      if ('emissive' in material) {
        material.emissive = new THREE.Color(accent);
        material.emissiveIntensity = 0.5;
      }
    }
  });
}
