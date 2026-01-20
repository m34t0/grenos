import {
	cube_points,
	cube_lines_indexes,
} from './objects/cube';

import {
	FPS,
} from './constants';

import {
	project,
	rotate_around_y,
	rotate_around_x,
	move_along_x,
	move_along_y,
	move_along_z,
} from './vectors';

import {
	translate,
} from './helpers';

import {
	clear,
	draw_lines,
} from './rendering';

import {
	add_events,
	create_subscriber,
	notify_subscribers,
} from './events';

import {
	dpi_fix,
} from './device';

import type { Point3D } from './types';

const game = document.getElementById('game') as HTMLCanvasElement;
const ctx = game.getContext('2d')!;

const dt = 1/FPS;
const da = Math.PI*dt*0.5;
const dd = 0.1*dt*4;
const init_angle = 15;

const object_center: Point3D = {
	x: 0,
	y: 0,
	z: 0,
};

let points = structuredClone(
	cube_points.map(p => rotate_around_y(p, init_angle, object_center)),
);

let z_distance = 1;

function start(after: () => void) {
	clear(ctx, game.width, game.height);
	dpi_fix(game);
	add_events();
	subscribe_to_keys();
	after();
}

function subscribe_to_keys() {
	create_subscriber('ArrowUp', () => {
		points = points.map(p => rotate_around_x(p, da, object_center));
	});

	create_subscriber('ArrowLeft', () => {
		points = points.map(p => rotate_around_y(p, -da, object_center));
	});

	create_subscriber('ArrowDown', () => {
		points = points.map(p => rotate_around_x(p, -da, object_center));
	});

	create_subscriber('ArrowRight', () => {
		points = points.map(p => rotate_around_y(p, da, object_center));
	});

	create_subscriber('KeyW', () => {
		points = points.map(p => move_along_y(p, dd)); object_center.y += dd;
	});

	create_subscriber('KeyA', () => {
		points = points.map(p => move_along_x(p, -dd)); object_center.x -= dd;
	});

	create_subscriber('KeyS', () => {
		points = points.map(p => move_along_y(p, -dd)); object_center.y -= dd;;
	});

	create_subscriber('KeyD', () => {
		points = points.map(p => move_along_x(p, dd)); object_center.x += dd;
	});

	create_subscriber('BracketRight', () => {
		z_distance += dd;
	});

	create_subscriber('BracketLeft', () => {
		/*
		 * If you move too close to the camera
		 * it starts to glitch
		 */
		z_distance -=dd;
	});
}

function frame() {
	clear(ctx, game.width, game.height);
	notify_subscribers();

	/*
	 * We need to move points along z axis
	 * to see them on certain distance.
	 * If we don't, we end up in the center
	 * of the object describing by points
	 */
	draw_lines(
		cube_lines_indexes,
		points.map(p => move_along_z(p, z_distance)),
		(p) => translate(project(p), game.width, game.height),
		ctx,
	);
}

start(() => {
	setInterval(frame, 1000/FPS);
});
