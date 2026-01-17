import type { Point, Point3D } from './types';

export function translate({ x, y }: Point, width: number, height: number): Point {
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
		x: (x + 1)/2 * width,
		y: (1 - (y + 1)/2) * height,
	};
}

export function project({ x, y, z }: Point3D): Point {
	return {
		x: x/z,
		y: y/z,
	}
}

export function rotate_around_y({ x, y, z }: Point3D, angle: number): Point3D {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	return {
		x: x*c - z*s,
		y,
		z: x*s + z*c,
	};
}

export function rotate_around_x({ x, y, z }: Point3D, angle: number): Point3D {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	return {
		x,
		y: y*c - z*s,
		z: y*s + z*c,
	};
}

export function move_along_z({ x, y, z }: Point3D, distance: number) {
	return {
		x,
		y,
		z: z+distance,
	};
}
