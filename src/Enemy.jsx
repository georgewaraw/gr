import { useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, PositionalAudio } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { Text } from "./Text.jsx";

import enemy_glb from "./assets/enemy.glb";
import enemy_laugh_mp3 from "./assets/enemy_laugh.mp3";

export function Enemy() {

	const enemy = useRef();
	const [ geometry ] = useState( useLoader(GLTFLoader, enemy_glb).scene.children[0].geometry );
	const [ distort, setDistort ] = useState( 0.5 );

	const [ score, setScore ] = useState( 0 );

	const { scene } = useThree();

	useFrame( function (_, delta) {

		const player = scene.getObjectByName( "player" );
		const x = player.position.x;
		const z = player.position.z;

		const speed = 2.75;
		const distance = 20;

		enemy.current.lookAt( x, 0, z );

		if( enemy.current.position.x < x ) enemy.current.position.x += speed * delta;
		else if( enemy.current.position.x > x ) enemy.current.position.x -= speed * delta;
		if( enemy.current.position.z < z ) enemy.current.position.z += speed * delta;
		else if( enemy.current.position.z > z ) enemy.current.position.z -= speed * delta;

		if( enemy.current.position.distanceToSquared(player.position) < 7 ) {

			setDistort( 0.5 );
			enemy.current.position.x = player.position.x + ( (Math.random() > 0.5) ? distance : -distance );
			enemy.current.position.z = player.position.z + ( (Math.random() > 0.5) ? distance : -distance );

			if( score > 0 ) setScore( (score) => score - 1 );
		}
	} );

	return (
		<mesh
			ref={ enemy }
			scale={ 0.25 }
			position-z={ -25 }
			geometry={ geometry }
			onPointerUp={ function (e) {

				if( Math.round(distort) < 16 ) setDistort( (distort) => distort * 2 );
				else {

					const player = scene.getObjectByName( "player" );

					const distance = 30;

					setDistort( 0.5 );
					enemy.current.position.x = player.position.x + ( (Math.random() > 0.5) ? distance : -distance );
					enemy.current.position.z = player.position.z + ( (Math.random() > 0.5) ? distance : -distance );

					setScore( (score) => score + 1 );
				}
			} }
		>
			<MeshDistortMaterial
				distort={ distort }
				speed={ 2 }
				transparent
				opacity={ 10 }
			/>
			<Text
				content={ ("00" + score).slice(-2) }
				size={ 4 }
				height={ 15 }
			/>
			<PositionalAudio
				url={ enemy_laugh_mp3 }
				autoplay
			/>
		</mesh>
	);

}
