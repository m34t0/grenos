import {
	cube_points,
	cube_lines_indexes,
} from './objects/cube';

import { FPS } from './constants';

import {
	translate,
	project,
	rotate_around_y,
	rotate_around_x,
	move_along_z,
} from './vectors';

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

const game = document.getElementById('game') as HTMLCanvasElement;
const ctx = game.getContext('2d')!;

const dt = 1/FPS;
const da = Math.PI*dt*0.5;
const distance = 1;
const init_angle = 15;

let points = structuredClone(
	cube_points.map(p => rotate_around_y(p, init_angle)),
);

function start(after: () => void) {
	clear(ctx, game.width, game.height);
	dpi_fix(game);
	add_events();

	create_subscriber(
		'ArrowRight',
		() => { points = points.map(p => rotate_around_y(p, da)) },
	);

	create_subscriber(
		'ArrowUp',
		() => { points = points.map(p => rotate_around_x(p, da)) },
	);

	create_subscriber(
		'ArrowLeft',
		() => { points = points.map(p => rotate_around_y(p, -da)) },
	);

	create_subscriber(
		'ArrowDown',
		() => { points = points.map(p => rotate_around_x(p, -da)) },
	);

	after();
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
		points.map(p => move_along_z(p, distance)),
		(p) => translate(project(p), game.width, game.height),
		ctx,
	);
}

start(() => {
	setInterval(frame, 1000/FPS);
});
