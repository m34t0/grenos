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
	/* These buttons just imitate keyboard */
	const up_btn = document.querySelector('.controls__up');
	const left_btn = document.querySelector('.controls__left');
	const down_btn = document.querySelector('.controls__down');
	const right_btn = document.querySelector('.controls__right');
	const W_btn = document.querySelector('.controls__W');
	const A_btn = document.querySelector('.controls__A');
	const S_btn = document.querySelector('.controls__S');
	const D_btn = document.querySelector('.controls__D');
	const left_bracket_btn = document.querySelector('.controls__left-bracket');
	const right_bracket_btn = document.querySelector('.controls__right-bracket');

	create_global_events();
	create_event_for_element(up_btn, 'pointerdown', 'ArrowUp');
	create_event_for_element(down_btn, 'pointerdown', 'ArrowDown');
	create_event_for_element(right_btn, 'pointerdown', 'ArrowRight');
	create_event_for_element(left_btn, 'pointerdown', 'ArrowLeft');
	create_event_for_element(W_btn, 'pointerdown', 'KeyW');
	create_event_for_element(A_btn, 'pointerdown', 'KeyA');
	create_event_for_element(S_btn, 'pointerdown', 'KeyS');
	create_event_for_element(D_btn, 'pointerdown', 'KeyD');
	create_event_for_element(left_bracket_btn, 'pointerdown', 'BracketLeft');
	create_event_for_element(right_bracket_btn, 'pointerdown', 'BracketRight');
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
