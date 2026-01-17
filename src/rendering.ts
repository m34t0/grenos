import { BACKGROUND, FOREGROUND } from './constants';

import type { Point, Point3D } from './types';

function draw_point({ x, y }: Point, ctx: CanvasRenderingContext2D) {
	const s = 5;

	ctx.fillStyle = FOREGROUND;
	ctx.fillRect(x - s/2, y - s/2, s, s);
}

function draw_line(p_0: Point, p_1: Point, ctx: CanvasRenderingContext2D) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = FOREGROUND;
	ctx.beginPath();
	ctx.moveTo(p_0.x, p_0.y);
	ctx.lineTo(p_1.x, p_1.y);
	ctx.stroke();
}

export function clear(ctx: CanvasRenderingContext2D, width: number, height: number) {
	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0, 0, width, height);
}

export function draw_points(
	point_list: Point3D[],
	get_2d_point: (p: Point3D) => Point,
	ctx: CanvasRenderingContext2D,
) {
	for (const p of point_list) {
		draw_point(get_2d_point(p), ctx);
	}
}

export function draw_lines(
	lines_indexes: number[][],
	points: Point3D[],
	get_2d_point: (p: Point3D) => Point,
	ctx: CanvasRenderingContext2D,
) {
	for (const indexes of lines_indexes) {
		const indexes_ln = indexes.length;

		for (let i = 0; i < indexes_ln; i++) {
			const p_0 = points[indexes[i]!]!;
			const p_1 = points[indexes[(i+1) % indexes_ln]!]!;

			draw_line(
				get_2d_point(p_0),
				get_2d_point(p_1),
				ctx,
			);
		}
	}
}
