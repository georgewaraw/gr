import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import gun_glb from "./assets/gun.glb";
import gun_shoot_mp3 from "./assets/gun_shoot.mp3";

export function Gun() {

	const audioShoot = useRef();

	useEffect( function () {

		let timeThen = 0;
		let xStart = 0;
		let yStart = 0;

		function touchStartCallback( e ) {

			e.preventDefault();

			timeThen = Date.now();

			xStart = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1;
			yStart = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;
		}
		function pointerUpCallback( e ) {

			e.preventDefault();

			if(
				!timeThen ||
				Date.now() - timeThen < 200
			) {

				const xEnd = e.clientX / window.innerWidth * 2 - 1;
				const yEnd = e.clientY / window.innerHeight * -2 + 1;

				if(
					(
						!xStart &&
						!yStart
					) ||
					(
						Math.abs( xStart - xEnd ) < 0.2 &&
						Math.abs( yStart - yEnd ) < 0.2
					)
				) {

					if( audioShoot.current ) {

						if( audioShoot.current.isPlaying ) audioShoot.current.stop();
						audioShoot.current.play();
					}
				}
			}
		}

		window.addEventListener( "touchstart", touchStartCallback );
		window.addEventListener( "pointerup", pointerUpCallback );

		return function () {

			window.removeEventListener( "touchstart", touchStartCallback );
			window.removeEventListener( "pointerup", pointerUpCallback );
		}
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
