import {chatGptUrl, googleUrl} from '@vdegenne/links'
import {withController} from '@snar/lit'
import {binanceUrl} from '@vdegenne/binance/utils.js'
import {css, html} from 'lit'
import {withStyles} from 'lit-with-styles'
import {customElement} from 'lit/decorators.js'
import {
	SVG_BINANCE,
	SVG_CHATGPT,
	SVG_CMC,
	SVG_GOOGLE,
} from '../assets/assets.js'
import {store} from '../store.js'
import {PageElement} from './PageElement.js'
import {cmcUrl} from '@vdegenne/cmc'
import {until} from 'lit/directives/until.js'
import {loading} from '../templates.js'
import {makeChatGPTRequest} from '../utils.js'

declare global {
	interface HTMLElementTagNameMap {
		'page-main': PageMain
	}
}

@customElement('page-main')
@withController(store)
@withStyles(css`
	:host {
	}
`)
export class PageMain extends PageElement {
	render() {
		return html`<!-- -->
			<div class="max-w-3xl mt-12">${this.#renderContent()}</div>
			<!-- -->`
	}

	#renderContent() {
		return until(
			(async () => {
				const currency = await store.getCurrency()
				if (currency === undefined) {
					return this.#renderNoBase()
				}
				document.title = currency?.symbol || store.base!
				return this.#renderCurrency(currency)
			})(),
			loading(),
		)
	}

	#renderNoBase() {
		return html`<!-- -->
			no base
			<!-- -->`
	}

	#renderCurrency(currency: CMC.MiniCurrency | null) {
		return html`<!-- -->
			<div class="flex flex-wrap gap-3 items-center justify-center">
				<md-filled-tonal-button href=${cmcUrl(currency?.slug ?? store.base!)}>
					<md-icon slot="icon">${SVG_CMC}</md-icon>
					<span>CoinMarketCap</span>
				</md-filled-tonal-button>

				<md-filled-button
					href=${binanceUrl(currency?.symbol ?? store.base!, store.getQuote())}
				>
					<md-icon slot="icon">${SVG_BINANCE}</md-icon>
					<span>Binance</span>
				</md-filled-button>

				<md-outlined-button
					href="${googleUrl(`${currency?.name ?? store.base!} crypto`)}"
				>
					<md-icon slot="icon">${SVG_GOOGLE}</md-icon>
					<span>Search</span>
				</md-outlined-button>

				<md-elevated-button
					href=${chatGptUrl(
						makeChatGPTRequest(store.chatGPTRequest, currency ?? store.base),
					)}
				>
					<md-icon slot="icon">${SVG_CHATGPT}</md-icon>
					<span>Ask ChatGPT</span>
				</md-elevated-button>
			</div>
			<!-- -->`
	}
}

// export const pageMain = new PageMain();
