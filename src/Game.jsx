import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Postprocessing } from "./Postprocessing.jsx";
import { Ground } from "./Ground.jsx";
import { Level } from "./Level.jsx";
import { Enemy } from "./Enemy.jsx";
import { Player } from "./Player.jsx";

export function Game() {

	const [ playing, setPlaying ] = useState( false );

	useEffect( () => window.addEventListener(
		"pointerdown",
		() => setPlaying( true ),
		{ once: true }
	), [] );

	return (
		<Canvas
			dpr={ 0.3 }
			gl={{ antialias: false }}
		>
			<Postprocessing />
			<ambientLight color="magenta" />
			<Ground />
			<Level />
			{ playing && <Enemy /> }
			<Player playing={ playing } />
		</Canvas>
	);

}
