import {ReactiveController} from '@snar/lit';
import {MGamepad, MiniGamepad, Mode} from '@vdegenne/mini-gamepad';
import {state} from 'lit/decorators.js';
import {store} from './store.js';
import {clickButton} from './utils.js';
import {getElement} from 'html-vision';
import {app} from './app-shell/app-shell.js';

class GamepadController extends ReactiveController {
	@state() gamepad: MGamepad | undefined;

	get mapping() {
		return this.gamepad?.mapping;
	}

	constructor() {
		super();
		const minigp = new MiniGamepad({
			// pollSleepMs: 900,
			toastModel: false,
			focusDeadTimeMs: 200,
		});
		minigp.onConnect((gamepad) => {
			this.gamepad = gamepad;
			const {
				LEFT_STICK_LEFT,
				LEFT_STICK_RIGHT,
				RIGHT_STICK_LEFT,
				RIGHT_STICK_RIGHT,
				RIGHT_BUTTONS_BOTTOM,
				RIGHT_BUTTONS_RIGHT,
				L1,
				LEFT_BUTTONS_RIGHT,
				LEFT_BUTTONS_BOTTOM,
				RIGHT_BUTTONS_LEFT,
				R1,
				LEFT_BUTTONS_LEFT,
				RIGHT_BUTTONS_TOP,
				MIDDLE_LEFT,
			} = gamepad.model.mapping;

			gamepad.for(LEFT_STICK_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.PRIMARY:
						break;
					case Mode.SECONDARY:
						break;
					case Mode.TERTIARY:
						if (store.page === 'viewer') {
							// clickButton('#arrow-back');
							// store.previous();
						}
						break;
				}
			});
			gamepad.for(LEFT_STICK_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.TERTIARY:
						if (store.page === 'viewer') {
							// clickButton('#arrow-forward');
							// store.next();
						}
						break;
				}
			});
			gamepad.for(RIGHT_BUTTONS_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
				}
			});

			gamepad.for(RIGHT_STICK_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						clickButton('#arrow-back');
						break;
				}
			});
			gamepad.for(RIGHT_STICK_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						clickButton('#arrow-forward');
						break;
				}
			});

			gamepad.for(RIGHT_BUTTONS_BOTTOM).before(async ({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.TERTIARY:
						const searchInput = await getElement('md-outlined-text-field');
						if (
							store.page === 'search' &&
							app.shadowRoot.activeElement !== searchInput
						) {
							store.search = store.search.slice(0, -1);
							searchInput?.focus();
						}
						break;
				}
			});
			gamepad.for(RIGHT_BUTTONS_RIGHT).before(({mode}) => {
				if (mode === Mode.NORMAL) {
				}
			});

			gamepad.for(L1).before(({mode}) => {
				if (mode === Mode.NORMAL) {
				}
			});
			gamepad.for(R1).before(({mode}) => {
				if (mode === Mode.NORMAL) {
				}
			});

			gamepad.for(LEFT_BUTTONS_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
				}
			});

			gamepad.for(LEFT_BUTTONS_BOTTOM).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.PRIMARY:
						break;
				}
			});

			gamepad.for(LEFT_BUTTONS_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.PRIMARY:
						break;
					case Mode.TERTIARY:
						break;
				}
			});

			gamepad.for(RIGHT_BUTTONS_TOP).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.PRIMARY:
						break;
					case Mode.SECONDARY:
					case Mode.TERTIARY:
				}
			});

			gamepad.for(MIDDLE_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						store.togglePage();
						break;

					default:
						break;
				}
			});
		});
	}
}

export const gamepadCtrl = new GamepadController();
