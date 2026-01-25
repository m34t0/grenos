import type { Point } from './types';

export function translate({ x, y }: Point, width: number, height: number): Point {
	/*
	 * Formula x` = x/z, y` = y/z assumes
	 * that we have coordinate field with
	 * -1 <= x <= 1 and -1 <= y <= 1
	 * and to translate coordinates
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
