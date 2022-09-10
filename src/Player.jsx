import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraShake, PositionalAudio } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { Gun } from "./Gun.jsx";
import { Text } from "./Text.jsx";

import player_walk_mp3 from "./assets/player_walk.mp3";
import music_mp3 from "./assets/music.mp3";
/*
	playing BOOLEAN
*/
export function Player({ playing }) {

	const player = useRef();

	const timeThen = useRef( 0 );

	const looking = useRef({
		is: true,
		x: 0,
		y: 0
	});
	const [ euler ] = useState( new Euler(0, 0, 0, "YXZ") );

	const moving = useRef( null );
	const [ vector ] = useState( new Vector3() );

	const audioWalk = useRef();

	useEffect( function () {

		function pointerMoveCallback( e ) {

			e.preventDefault();

			if( playing ) {

				const x = (e.clientX / window.innerWidth * 2 - 1) / 50;
				const y = (e.clientY / window.innerHeight * 2 - 1) / 100;

				looking.current.x = ( Math.abs(x) > 0.005 ) ? x : 0;
				looking.current.y = ( Math.abs(y) > 0.0025 ) ? y : 0;
			}
		}

		window.addEventListener( "pointermove", pointerMoveCallback );

		return () => window.removeEventListener( "pointermove", pointerMoveCallback );
	}, [playing] );

	useEffect( function () {

		let xStart = 0;
		let yStart = 0;

		function touchStartCallback( e ) {

			e.preventDefault();

			if( playing ) {

				looking.current.is = true;

				timeThen.current = Date.now();

				xStart = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1;
				yStart = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;
			}
		}
		function touchEndCallback( e ) {

			e.preventDefault();

			if( playing ) {

				looking.current.is = false;

				if( Date.now() - timeThen.current < 200 ) {

					const xEnd = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1;
					const yEnd = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;

					if(
						Math.abs( xStart - xEnd ) < 0.2 &&
						Math.abs( yStart - yEnd ) > 0.1
					) {

						if( yStart < yEnd ) {

							if(
								moving.current === "front" ||
								moving.current === "back"
							) moving.current = null;
							else moving.current = "front";
						}
						else {

							if(
								moving.current === "back" ||
								moving.current === "front"
							) moving.current = null;
							else moving.current = "back";
						}
					}
					else if(
						Math.abs( xStart - xEnd ) > 0.1 &&
						Math.abs( yStart - yEnd ) < 0.2
					) {

						if( xStart < xEnd ) {

							if(
								moving.current === "right" ||
								moving.current === "left"
							) moving.current = null;
							else moving.current = "right";
						}
						else {

							if(
								moving.current === "left" ||
								moving.current === "right"
							) moving.current = null;
							else moving.current = "left";
						}
					}
				}
			}
		}

		window.addEventListener( "touchstart", touchStartCallback );
		window.addEventListener( "touchend", touchEndCallback );

		return function () {

			window.removeEventListener( "touchstart", touchStartCallback );
			window.removeEventListener( "touchend", touchEndCallback );
		}
	}, [playing] );

	useEffect( function () {

		function keyDownCallback( e ) {

			switch( e.code ) {

				case "ArrowUp":
				case "KeyW":
					e.preventDefault();

					if( playing ) moving.current = "front";
				break;
				case "ArrowDown":
				case "KeyS":
					e.preventDefault();

					if( playing ) moving.current = "back";
				break;
				case "ArrowLeft":
				case "KeyA":
					e.preventDefault();

					if( playing ) moving.current = "left";
				break;
				case "ArrowRight":
				case "KeyD":
					e.preventDefault();

					if( playing ) moving.current = "right";
				break;
			}
		}
		function keyUpCallback( e ) {

			switch( e.code ) {

				case "ArrowUp":
				case "KeyW":
				case "ArrowDown":
				case "KeyS":
				case "ArrowLeft":
				case "KeyA":
				case "ArrowRight":
				case "KeyD":
					e.preventDefault();

					if( playing ) moving.current = null;
				break;
			}
		}

		window.addEventListener( "keydown", keyDownCallback );
		window.addEventListener( "keyup", keyUpCallback );

		return function () {

			window.removeEventListener( "keydown", keyDownCallback );
			window.removeEventListener( "keyup", keyUpCallback );
		}
	}, [playing] );

	useFrame( function () {

		if(
			looking.current.is &&
			Date.now() - timeThen.current > 200
		) {

			euler.setFromQuaternion( player.current.quaternion );

			euler.y -= looking.current.x;
			euler.x = Math.max(
				-30 * Math.PI / 180,
				Math.min(
					30 * Math.PI / 180,
					euler.x -= looking.current.y
				)
			);

			player.current.quaternion.setFromEuler( euler );
		}
	} );

	useFrame( function (_, delta) {

		if( moving.current ) {

			vector.setFromMatrixColumn( player.current.matrix, 0 );

			switch( moving.current ) {

				case "front":
					player.current.position.addScaledVector(
						vector.crossVectors( vector, player.current.up ),
						-delta
					);
				break;
				case "back":
					player.current.position.addScaledVector(
						vector.crossVectors( vector, player.current.up ),
						delta
					);
				break;
				case "left":
					player.current.position.addScaledVector( vector, -delta );
				break;
				case "right":
					player.current.position.addScaledVector( vector, delta );
				break;
			}

			if(
				audioWalk.current &&
				!audioWalk.current.isPlaying
			) audioWalk.current.play();
		}
		else {

			if(
				audioWalk.current &&
				audioWalk.current.isPlaying
			) audioWalk.current.stop();
		}
	} );

	return (
		<group
			ref={ player }
			name="player"
			position={[ 0, 2.5, 5 ]}
		>
			<primitive
				object={ useThree().camera }
				position-z={ 0 }
			/>
			<CameraShake
				maxYaw={ 0.025 }
				maxPitch={ 0.025 }
				maxRoll={ 0 }
				yawFrequency={ 0.25 }
				pitchFrequency={ 0.25 }
			/>
			{ playing && <Gun /> }
			{ !playing && (<Text
				content={ "Good\nResidence" }
				size={ 0.125 }
				height={ 0.35 }
			/>) }
			{ playing && <PositionalAudio
				ref={ audioWalk }
				url={ player_walk_mp3 }
			/> }
			{ playing && <PositionalAudio
				url={ music_mp3 }
				autoplay
				onUpdate={ (audio) => audio.setVolume(0.25) }
			/> }
		</group>
	);

}
