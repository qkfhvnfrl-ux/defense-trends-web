# 3D model replacement guide

The web app renders a procedural placeholder when a GLB file is missing.

To replace a vehicle with a Meshy.ai export, put files in this pattern:

- `public/models/{equipmentId}/vehicle.glb`
- `public/models/{equipmentId}/components/{componentId}.glb`

The JSON data already points to those paths. Keep IDs stable when adding new equipment or components.
