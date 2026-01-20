export type Point = {
	x: number;
	y: number;
};

export type Point3D = {
	x: number;
	y: number;
	z: number;
};

/* Duplicates keydown/keyup event.code values */
export type ArrowCode =
	'ArrowUp'
	| 'ArrowDown'
	| 'ArrowRight'
	| 'ArrowLeft'
	| 'KeyW'
	| 'KeyS'
	| 'KeyD'
	| 'KeyA'
	| 'BracketLeft'
	| 'BracketRight';
