import {
	scalar_multiply_vectors,
	get_face_normal,
	subtract_vectors,
} from './vectors';

import type { Point3D, FaceVertices } from './types';

export function is_face_visible(camera: Point3D, vertices: FaceVertices): boolean {
	return scalar_multiply_vectors(
		get_face_normal(vertices),
		subtract_vectors(vertices[0], camera),
	) > 0;
}
