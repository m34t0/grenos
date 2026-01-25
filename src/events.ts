import type { KeyCode, OneTimeEvent } from './types';

const pressed_keys: Set<KeyCode> = new Set();
const keyboard_subscribers: Partial<Record<KeyCode, (() => void)[]>> = {};
const one_time_event_subscribers: Partial<Record<OneTimeEvent, (() => void)[]>> = {};

function create_global_events() {
	document.addEventListener('keydown', (event: KeyboardEvent) => {
		pressed_keys.add(event.code as KeyCode);
	});

	document.addEventListener('keyup', (event: KeyboardEvent) => {
		pressed_keys.delete(event.code as KeyCode);
	});

	document.addEventListener('pointerup', () => {
		pressed_keys.clear();
	});
}

function create_keyboard_event_for_element(el: Element | null, event: string, code: KeyCode) {
	el?.addEventListener(event, () => {
		pressed_keys.add(code);
	});
}

function create_one_time_event_for_element(el: Element | null, event: string, code: OneTimeEvent) {
	if (!one_time_event_subscribers[code]) {
		one_time_event_subscribers[code] = [];
	}

	el?.addEventListener(event, () => {
		for (const sub of one_time_event_subscribers[code]!) {
			sub();
		}
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
	const wireframes_checkbox = document.getElementById('wireframes-checkbox');

	create_global_events();
	create_keyboard_event_for_element(up_btn, 'pointerdown', 'ArrowUp');
	create_keyboard_event_for_element(down_btn, 'pointerdown', 'ArrowDown');
	create_keyboard_event_for_element(right_btn, 'pointerdown', 'ArrowRight');
	create_keyboard_event_for_element(left_btn, 'pointerdown', 'ArrowLeft');
	create_keyboard_event_for_element(W_btn, 'pointerdown', 'KeyW');
	create_keyboard_event_for_element(A_btn, 'pointerdown', 'KeyA');
	create_keyboard_event_for_element(S_btn, 'pointerdown', 'KeyS');
	create_keyboard_event_for_element(D_btn, 'pointerdown', 'KeyD');
	create_keyboard_event_for_element(left_bracket_btn, 'pointerdown', 'BracketLeft');
	create_keyboard_event_for_element(right_bracket_btn, 'pointerdown', 'BracketRight');
	create_one_time_event_for_element(wireframes_checkbox, 'change', 'Wireframes');
}

export function create_keyboard_subscriber(
	code: KeyCode,
	sub: (...args: unknown[]) => void,
	...args: unknown[]
) {
	if (!keyboard_subscribers[code]) {
		keyboard_subscribers[code] = [];
	}

	keyboard_subscribers[code].push(() => {
		sub(args)
	});
}

export function create_subscriber_for_one_time_event(
	code: OneTimeEvent,
	sub: (...args: unknown[]) => void,
	...args: unknown[]
) {
	if (!one_time_event_subscribers[code]) {
		one_time_event_subscribers[code] = [];
	}

	one_time_event_subscribers[code].push(() => {
		sub(args);
	});
}

export function notify_keyboard_subscribers() {
	for (const key of pressed_keys) {
		for (const sub of keyboard_subscribers[key] ?? []) {
			sub();
		}
	}
}
