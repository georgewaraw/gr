import { MeshWobbleMaterial, Text3D } from "@react-three/drei";

import font_json from "./assets/font.json";
/*
	content STRING
*/
export const Text = ({ content, size, height }) => (
	<Text3D
		font={ font_json }
		size={ size }
		height={ 0.1 }
		rotation-x={ 15 * Math.PI / 180 }
		position={[ 0, height, -1 ]}
		onUpdate={ ({ geometry }) => geometry.center() }
	>
		{ content }
		<MeshWobbleMaterial
			factor={ 0.125 }
			speed={ 0.75 }
			color="yellow"
		/>
	</Text3D>
);
