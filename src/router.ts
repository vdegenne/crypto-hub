// import {ReactiveController, state} from '@snar/lit';
// import {installRouter} from 'pwa-helpers';
import {store} from './store.js'
//
// export enum Page {
// 	HOME,
// 	SESSION,
// }
//
// class Router extends ReactiveController {
// 	@state() page: Page = Page.HOME;
//
// 	navigateComplete = Promise.resolve();
//
// 	constructor() {
// 		super();
// 		installRouter(async (location) => {
// 			this.navigateComplete = new Promise(async (resolve) => {
// 				await store.updateComplete;
// 				const hash = location.hash.slice(1);
// 				const params = new URLSearchParams(hash);
// 				// do something
// 				resolve();
// 			});
// 		});
// 	}
// }
//
// export const router = new Router();

import {Hash, Router} from '@vdegenne/router'

export const router = new (class {
	hash = new Hash<{page: Page}>()
	#router = new Router(async ({location}) => {
		await store.updateComplete
		const [base, quote] = location.pathname
			.replace(/^\/+|\/+$/g, '')
			.split(/\/+/g)
		if (base) {
			store.base = base
			if (quote) {
				store.quote = quote
			}
		}
	})
})()
export default router
