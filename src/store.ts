import {PropertyValues, ReactiveController, state} from '@snar/lit'
import {FormBuilder} from '@vdegenne/forms/FormBuilder'
import {saveToLocalStorage} from 'snar-save-to-local-storage'
import {availablePages} from './constants.js'
import {cmcManager} from './cmc2.js'

@saveToLocalStorage('crypto-hub:store')
export class AppStore extends ReactiveController {
	F = new FormBuilder(this)

	@state() page: Page = 'main'
	@state() base: string | null = null
	@state() quote: string | null = null
	@state() quoteFallback = 'USDT'
	@state() chatGPTRequest =
		'What can you tell me about the crypto "%name" (symbol: %symbol), give me a table with creators, date of initiation, the utility, still active? cons and pros. Thanks'

	protected updated(changed: PropertyValues<this>) {
		if (changed.has('page')) {
			// import('./router.js').then(({router}) => {
			// 	router.hash.$('page', this.page)
			// })
			const page = availablePages.includes(this.page) ? this.page : '404'
			import(`./pages/page-${page}.ts`)
				.then(() => {
					console.log(`Page ${page} loaded.`)
				})
				.catch(() => {})
		}
	}

	/**
	 * Returns undefined if no base provided, null if no currency found from the base, or MiniCurrency.
	 */
	async getCurrency() {
		if (this.base === null) {
			return undefined
		}
		await cmcManager.ready
		const currency = cmcManager.getCurrencyFromSymbol(this.base, false)
		if (currency === undefined) {
			return null
		}
		return currency
	}

	getQuote() {
		return this.quote || this.quoteFallback || 'USDT'
	}
}

export const store = new AppStore()
