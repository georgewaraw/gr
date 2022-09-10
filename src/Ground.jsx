import { useTexture } from "@react-three/drei";
import { NearestFilter, RepeatWrapping } from "three";

import ground_jpg from "./assets/ground.jpg";

export const Ground = () => (
	<mesh
		rotation-x={ 270 * Math.PI / 180 }
		position-y={ -0.1 }
	>
		<planeGeometry args={[ 10000, 10000 ]} />
		<meshPhongMaterial>
			<primitive
				attach="map"
				object={ useTexture(ground_jpg) }
				magFilter={ NearestFilter }
				minFilter={ NearestFilter }
				wrapS={ RepeatWrapping }
				wrapT={ RepeatWrapping }
				repeat={ 5000 }
			/>
		</meshPhongMaterial>
	</mesh>
);
