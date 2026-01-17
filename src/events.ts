import type { ArrowCode } from './types';

const pressed_keys: Set<ArrowCode> = new Set();
const subscribers: Partial<Record<ArrowCode, (() => void)[]>> = {};

function create_global_events() {
	document.addEventListener('keydown', (event: KeyboardEvent) => {
		pressed_keys.add(event.code as ArrowCode);
	});

	document.addEventListener('keyup', (event: KeyboardEvent) => {
		pressed_keys.delete(event.code as ArrowCode);
	});

	document.addEventListener('pointerup', () => {
		pressed_keys.clear();
	});
}

function create_event_for_element(el: Element | null, event: string, code: ArrowCode) {
	el?.addEventListener(event, () => {
		pressed_keys.add(code);
	});
}

export function add_events() {
	const up_btn = document.querySelector('.controls__up');
	const down_btn = document.querySelector('.controls__down');
	const right_btn = document.querySelector('.controls__right');
	const left_btn = document.querySelector('.controls__left');

	create_global_events();
	create_event_for_element(up_btn, 'pointerdown', 'ArrowUp');
	create_event_for_element(down_btn, 'pointerdown', 'ArrowDown');
	create_event_for_element(right_btn, 'pointerdown', 'ArrowRight');
	create_event_for_element(left_btn, 'pointerdown', 'ArrowLeft');
}

export function create_subscriber(
	code: ArrowCode,
	sub: (...args: unknown[]) => void,
	...args: unknown[]
) {
	if (!subscribers[code]) {
		subscribers[code] = [];
	}

	subscribers[code].push(() => {
		sub(args)
	});
}

export function notify_subscribers() {
	for (const key of pressed_keys) {
		for (const sub of subscribers[key] ?? []) {
			sub();
		}
	}
}
