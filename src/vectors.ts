import type { Point, Point3D, FaceVertices } from './types';

/*
 * These functions work with
 * imaginary 3D space with
 * zero point in the center and
 * -1 <= x <= 1
 * -1 <= y <= 1
 *  0 <  z <= Inf
 *  _________________________________________________
 */

export function project({ x, y, z }: Point3D): Point {
	return {
		x: x/z,
		y: y/z,
	}
}

export function rotate_around_y({ x, y, z }: Point3D, angle: number, center: Point3D): Point3D {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	/*
	 * Rotating algorithm:
	 * move point to the center of the view ->
	 * rotate ->
	 * return point to the center of the object ->
	 * profit
	 */
	return {
		x: (x - center.x)*c - (z - center.z)*s + center.x,
		y,
		z: (x - center.x)*s + (z - center.z)*c + center.z,
	};
}

export function rotate_around_x({ x, y, z }: Point3D, angle: number, center: Point3D): Point3D {
	const c = Math.cos(angle);
	const s = Math.sin(angle);

	return {
		x,
		y: (y - center.y)*c - (z - center.z)*s + center.y,
		z: (y - center.y)*s + (z - center.z)*c + center.z,
	};
}

export function move_along_x({ x, y, z }: Point3D, distance: number): Point3D {
	return {
		x: x+distance,
		y,
		z,
	};
}

export function move_along_y({ x, y, z }: Point3D, distance: number): Point3D {
	return {
		x,
		y: y+distance,
		z,
	};
}

export function move_along_z({ x, y, z }: Point3D, distance: number): Point3D {
	return {
		x,
		y,
		z: z+distance,
	};
}

export function subtract_vectors(p_0: Point3D, p_1: Point3D): Point3D {
	return {
		x: p_0.x - p_1.x,
		y: p_0.y - p_1.y,
		z: p_0.z - p_1.z,
	};
}

export function multipy_vectors(p_0: Point3D, p_1: Point3D): Point3D {
	return {
		x: p_0.y*p_1.z - p_0.z*p_1.y,
		y: p_0.z*p_1.x - p_0.x*p_1.z,
		z: p_0.x*p_1.y - p_0.y*p_1.x,
	};
}

export function scalar_multiply_vectors(p_0: Point3D, p_1: Point3D): number {
	return p_0.x*p_1.x + p_0.y*p_1.y + p_0.z*p_1.z;
}

export function get_face_normal(vertices: FaceVertices): Point3D {
	return multipy_vectors(
		subtract_vectors(vertices[1], vertices[0]),
		subtract_vectors(vertices[2], vertices[0]),
	);
}
