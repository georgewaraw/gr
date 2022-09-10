import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import gun_glb from "./assets/gun.glb";
import gun_shoot_mp3 from "./assets/gun_shoot.mp3";

export function Gun() {

	const audioShoot = useRef();

	useEffect( function () {

		function pointerDownCallback( e ) {

			e.preventDefault();

			if( audioShoot.current ) {

				if( audioShoot.current.isPlaying ) audioShoot.current.stop();
				audioShoot.current.play();
			}
		}

		window.addEventListener( "pointerdown", pointerDownCallback );

		return () => window.removeEventListener( "pointerdown", pointerDownCallback );
	}, [] );

	return (
		<primitive
			object={ useLoader(GLTFLoader, gun_glb).scene }
			scale-z={ -1 }
			rotation-y={ 30 * Math.PI / 180 }
			position={[ 0, -0.25, -0.5 ]}
		>
			<PositionalAudio
				ref={ audioShoot }
				url={ gun_shoot_mp3 }
				loop={ false }
			/>
		</primitive>
	);

}
