export type Point = {
	x: number;
	y: number;
};

export type Point3D = {
	x: number;
	y: number;
	z: number;
};

export type FaceVertices = [Point3D, Point3D, Point3D];

/* Duplicates keydown/keyup event.code values */
export type KeyCode =
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

export type OneTimeEvent = 'Wireframes';
