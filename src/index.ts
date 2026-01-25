import {
	cube_points,
	cube_faces_vertices,
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
	is_face_visible,
} from './visibility';

import {
	translate,
} from './helpers';

import {
	clear,
	draw_lines,
} from './rendering';

import {
	add_events,
	create_keyboard_subscriber,
	create_subscriber_for_one_time_event,
	notify_keyboard_subscribers,
} from './events';

import {
	dpi_fix,
} from './device';

import type { Point3D } from './types';

const game = document.getElementById('game') as HTMLCanvasElement;
const ctx = game.getContext('2d')!;

const settings = {
	wireframes: false,
};

const dt = 1/FPS;
const da = Math.PI*dt*0.5;
const dd = 0.1*dt*4;
const init_angle = 15;
let z_distance = 1;

const object_center: Point3D = {
	x: 0,
	y: 0,
	z: 0,
};

let points = structuredClone(
	cube_points.map(p => rotate_around_y(p, init_angle, object_center)),
);

function start(after: () => void) {
	clear(ctx, game.width, game.height);
	dpi_fix(game);
	add_events();
	subscribe_to_keys();
	after();
}

function subscribe_to_keys() {
	create_keyboard_subscriber('ArrowUp', () => {
		points = points.map(p => rotate_around_x(p, da, object_center));
	});

	create_keyboard_subscriber('ArrowLeft', () => {
		points = points.map(p => rotate_around_y(p, -da, object_center));
	});

	create_keyboard_subscriber('ArrowDown', () => {
		points = points.map(p => rotate_around_x(p, -da, object_center));
	});

	create_keyboard_subscriber('ArrowRight', () => {
		points = points.map(p => rotate_around_y(p, da, object_center));
	});

	create_keyboard_subscriber('KeyW', () => {
		points = points.map(p => move_along_y(p, dd)); object_center.y += dd;
	});

	create_keyboard_subscriber('KeyA', () => {
		points = points.map(p => move_along_x(p, -dd)); object_center.x -= dd;
	});

	create_keyboard_subscriber('KeyS', () => {
		points = points.map(p => move_along_y(p, -dd)); object_center.y -= dd;;
	});

	create_keyboard_subscriber('KeyD', () => {
		points = points.map(p => move_along_x(p, dd)); object_center.x += dd;
	});

	create_keyboard_subscriber('BracketRight', () => {
		z_distance += dd;
	});

	create_keyboard_subscriber('BracketLeft', () => {
		z_distance -=dd;
	});

	create_subscriber_for_one_time_event('Wireframes', () => {
		settings.wireframes = !settings.wireframes;
	});
}

function frame() {
	clear(ctx, game.width, game.height);
	notify_keyboard_subscribers();

	let faces = settings.wireframes
		? cube_faces_vertices
		: cube_faces_vertices.filter(vertice_idxes => {
			return is_face_visible({
				x: 0,
				y: 0,
				z: -z_distance,
			}, [
				points[vertice_idxes[0]!]!,
				points[vertice_idxes[1]!]!,
				points[vertice_idxes[2]!]!,
			]);
		});

	/*
	 * We need to move points along z axis
	 * to see them on certain distance.
	 * If we don't, we end up in the center
	 * of the object describing by points
	 */
	draw_lines(
		faces,
		points.map(p => move_along_z(p, z_distance)),
		(p) => translate(project(p), game.width, game.height),
		ctx,
	);
}

start(() => {
	setInterval(frame, 1000/FPS);
});
