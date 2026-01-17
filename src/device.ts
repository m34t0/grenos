export function dpi_fix(canvas: HTMLCanvasElement) {
	const dpi = window.devicePixelRatio;
	/* -2 to remove "px" */
	const height = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
	const width = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);

	canvas.setAttribute('height', `${height * dpi}`);
	canvas.setAttribute('width', `${width * dpi}`);
}
