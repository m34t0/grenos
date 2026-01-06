import {
	cube_points,
	cube_lines_indexes,
} from './cube';

type Point = {
	x: number;
	y: number;
};

type Point3D = {
	x: number;
	y: number;
	z: number;
};

/* Duplicates keydown/keyup event.code values */
type ArrowCode = 'ArrowUp' | 'ArrowDown' | 'ArrowRight' | 'ArrowLeft';

const BACKGROUND = '#241023';
const FOREGROUND = '#47A025';
const FPS = 60;

const game = document.getElementById('game') as HTMLCanvasElement;
const ctx = game.getContext('2d')!;
const pressed_keys: Set<ArrowCode> = new Set();

function initialize(after: () => void) {
	clear();
	dpi_fix();
	add_events();
	after();
}

function dpi_fix() {
	const dpi = window.devicePixelRatio;
	const height = +getComputedStyle(game).getPropertyValue('height').slice(0, -2);
	const width = +getComputedStyle(game).getPropertyValue('width').slice(0, -2);

	game.setAttribute('height', `${height * dpi}`);
	game.setAttribute('width', `${width * dpi}`);
}

function clear() {
	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0, 0, game.width, game.height);
}

function add_events() {
	const up_btn = document.querySelector('.controls__up');
	const down_btn = document.querySelector('.controls__down');
	const right_btn = document.querySelector('.controls__right');
	const left_btn = document.querySelector('.controls__left');

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		pressed_keys.add(event.code as ArrowCode);
	});

	document.addEventListener('keyup', (event: KeyboardEvent) => {
		pressed_keys.delete(event.code as ArrowCode);
	});

	up_btn?.addEventListener('pointerdown', () => {
		pressed_keys.add('ArrowUp');
	});

	down_btn?.addEventListener('pointerdown', () => {
		pressed_keys.add('ArrowDown');
	});

	right_btn?.addEventListener('pointerdown', () => {
		pressed_keys.add('ArrowRight');
	});

	left_btn?.addEventListener('pointerdown', () => {
		pressed_keys.add('ArrowLeft');
	});

	document.addEventListener('pointerup', () => {
		pressed_keys.clear();
	});
}

/* Used to draw points instead of lines */
function draw_points(point_list: Point3D[]) {
	for (const p of point_list) {
		draw_point(
			translate(
				project(p),
			),
		);
	}
}

function draw_point({ x, y }: Point) {
	const s = 5;

	ctx.fillStyle = FOREGROUND;
	ctx.fillRect(x - s/2, y - s/2, s, s);
}

function draw_lines(lines_indexes: number[][], points: Point3D[]) {
	for (const indexes of lines_indexes) {
		const indexes_ln = indexes.length;

		for (let i = 0; i < indexes_ln; i++) {
			const p_0 = points[indexes[i]!]!;
			const p_1 = points[indexes[(i+1) % indexes_ln]!]!;

			draw_line(
				translate(project(p_0)),
				translate(project(p_1)),
			);
		}
	}
}

function draw_line(p_0: Point, p_1: Point) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = FOREGROUND;
	ctx.beginPath();
	ctx.moveTo(p_0.x, p_0.y);
	ctx.lineTo(p_1.x, p_1.y);
	ctx.stroke();
}

function translate({ x, y }: Point): Point {
	/*
	 * Formula x` = x/z, y` = y/z assumes
	 * that we have coordinate field with
	 * -1 <= x <= 1 and -1 <= y <= 1
	 * and to translate coordinates on this field
	 * onto the screen (in canvas) we can do:
	 * 1) add 1 to x or y, now we have 0 <= x <= 2
	 * 2) divide x or y by 2 to normalize its value
	 * 3) multiply x or y to screen width or height
	 */
	return {
		x: (x + 1)/2 * game.width,
		y: (1 - (y + 1)/2) * game.height,
	};
}

function project({ x, y, z }: Point3D): Point {
	return {
		x: x/z,
		y: y/z,
	}
}

function move_along_z({ x, y, z }: Point3D, distance: number) {
	return {
		x,
		y,
		z: z+distance,
	};
}

function handle_pressed_keys(p: Point3D, angle: number): Point3D {
	let point = structuredClone(p);

	for (const key of pressed_keys) {
		switch (key) {
			case 'ArrowRight': point = rotate_around_y(point, angle); break;
			case 'ArrowUp': point = rotate_around_x(point, angle); break;
			case 'ArrowLeft': point = rotate_around_y(point, -angle); break;
			case 'ArrowDown': point = rotate_around_x(point, -angle); break;
		}
	}

	return point;
}

function rotate_around_y({ x, y, z }: Point3D, angle: number): Point3D {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	return {
		x: x*c - z*s,
		y,
		z: x*s + z*c,
	};
}

function rotate_around_x({ x, y, z }: Point3D, angle: number): Point3D {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	return {
		x,
		y: y*c - z*s,
		z: y*s + z*c,
	};
}

const dt = 1/FPS;
const da = Math.PI*dt*0.5;
const distance = 1;
const init_angle = 15;

let points = structuredClone(
	cube_points.map(p => rotate_around_y(p, init_angle)),
);

function frame() {
	clear();

	points = points
		.map(p => handle_pressed_keys(p, da))

	/*
	 * We need to move points along z axis
	 * to see them on certain distance.
	 * If we don't, we end up in the center
	 * of the object describing by points
	 */
	draw_lines(cube_lines_indexes, points.map(p => move_along_z(p, distance)));
}

initialize(() => {
	setInterval(frame, 1000/FPS);
});
