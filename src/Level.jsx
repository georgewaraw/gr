import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import level_glb from "./assets/level.glb";

export const Level = () => (
	<primitive
		object={ useLoader(GLTFLoader, level_glb).scene }
		scale={ 10 }
	/>
);
