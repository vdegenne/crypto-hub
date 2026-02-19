import '@material/mwc-top-app-bar'
import {withController} from '@snar/lit'
import {cmcIconUrl} from '@vdegenne/cmc'
import {html, type PropertyValues} from 'lit'
import {withStyles} from 'lit-with-styles'
import {customElement} from 'lit/decorators.js'
import {unsafeSVG} from 'lit/directives/unsafe-svg.js'
import {until} from 'lit/directives/until.js'
import {MaterialShellChild} from 'material-shell/MaterialShellChild'
import {SVG_LOGO} from '../assets/assets.js'
import {availablePages} from '../constants.js'
import {openSettingsDialog} from '../imports.js'
import {store} from '../store.js'
import {themeStore} from '../styles/themeStore.js'
import {loading} from '../templates.js'
import {loadImage, setFaviconFromImage} from '../utils.js'
import styles from './app-shell.css?inline'
import {cmcManager} from '../cmc2.js'

declare global {
	interface Window {
		app: AppShell
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell
	}
}

@customElement('app-shell')
@withStyles(styles)
@withController(store)
export class AppShell extends MaterialShellChild {
	render() {
		return html`<!-- -->
			<mwc-top-app-bar
				?dense=${false}
				style="--mdc-theme-primary:var(--md-sys-color-surface-container);--mdc-theme-on-primary:var(--md-sys-color-on-surface)"
			>
				${this.#renderHeader()}

				<div slot="actionItems" class="flex gap-1">
					<!-- <md-icon-button -->
					<!-- 	toggle -->
					<!-- 	@click=${store.toggleAudio} -->
					<!-- 	?selected=${store.audio} -->
					<!-- > -->
					<!-- 	<md-icon>volume_off</md-icon> -->
					<!-- 	<md-icon slot="selected">volume_up</md-icon> -->
					<!-- </md-icon-button> -->
					<!-- <md-icon-button slot="actionItems" @click=${() =>
						this._logout()}> -->
					<!-- 	<md-icon>logout</md-icon> -->
					<!-- </md-icon-button> -->
					<md-icon-button @click=${openSettingsDialog}>
						<md-icon>settings</md-icon>
					</md-icon-button>
				</div>
				<div>
					<page-main ?active=${store.page === 'main'}></page-main>
					<page-404 ?active=${!availablePages.includes(store.page)}></page-404>

					<md-fab
						size="small"
						class="fixed bottom-5 right-5"
						@click=${this.#onCasinoClick}
					>
						<md-icon slot="icon">casino</md-icon>
					</md-fab>

					<div
						class="fixed bottom-0 left-0 text-xs px-1 bg-[var(--md-sys-color-surface-container-lowest)] text-[var(--md-sys-color-outline)]"
					>
						crypt0-hub &copy; 2025
					</div>
				</div>
			</mwc-top-app-bar>
			<!-- -->`
	}

	#renderHeader() {
		return until(
			(async () => {
				await cmcManager.ready
				const currency = await store.getCurrency()

				return html`<!---->
					<md-list-item
						slot="title"
						class="--ml-[-20px] ml-2"
						slot="navigationIcon"
					>
						<md-icon-button
							slot="start"
							style="--md-icon-button-icon-size:32px;"
							inert
						>
							${currency === undefined
								? html`<!-- -->
										<md-icon>${unsafeSVG(SVG_LOGO)}</md-icon>
										<!-- -->`
								: currency === null
									? html`<md-icon>help</md-icon>`
									: html`
											<md-icon>
												${this.#loadImage(cmcIconUrl(currency.id))}
											</md-icon>
										`}
						</md-icon-button>
						${currency === undefined
							? html`<!-- -->
									<span>Crypto Hub</span>
									<!-- -->`
							: currency === null
								? html`${store.base}`
								: html`<!---->
										<div slot="overline">
											${currency.symbol}${store.quote
												? `/${store.quote.toUpperCase()}`
												: ''}
										</div>
										<div slot="headline" primary>${currency.name}</div>
										<!---->`}
					</md-list-item> `
			})(),
			html`<md-circular-progress
				slot="navigationIcon"
				indeterminate
			></md-circular-progress> `,
		)
	}

	#onCasinoClick = async () => {
		await cmcManager.ready
		const currencies = cmcManager.getAll()
		const c = currencies[Math.floor(Math.random() * currencies.length)]
		if (c) {
			const a = document.createElement('a')
			a.href = `/${c.symbol}`
			a.style.cssText = 'display:none;'
			document.body.append(a)
			a.click()
		}
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		const topAppBar = this.renderRoot.querySelector('mwc-top-app-bar')!
		// fix scroll disappearance issue.
		setTimeout(() => (topAppBar as any).handleResize(), 1)
		// styles for PWA
		const css = new CSSStyleSheet()
		css.replaceSync(`
			.mdc-top-app-bar__section {
				/* padding-left: 0; */
			}
			.mdc-top-app-bar__title {
				padding-left: 0;
			}
			.mdc-top-app-bar {
				-webkit-app-region: drag;
				app-region: drag;
			}
			#actions ::slotted(*), #navigation ::slotted(*) {
				-webkit-app-region: no-drag;
				app-region: no-drag;
			}
		`)
		topAppBar.shadowRoot!.adoptedStyleSheets.push(css)
		if ('windowControlsOverlay' in navigator) {
			// Listen for changes in overlay visibility
			;(<any>navigator.windowControlsOverlay).addEventListener(
				'geometrychange',
				(event: any) => {
					const buttons = this.renderRoot.querySelector<HTMLElement>(
						'[slot="actionItems"]',
					)
					if (!buttons) return
					if (event.visible) {
						buttons.style.paddingTop = `${event.titlebarAreaRect.height}px`
						buttons.style.transform = 'scale(0.8)'
					} else {
						buttons.style.paddingTop = '0'
						buttons.style.transform = 'initial'
					}
				},
			)
		}
	}

	#loadImage(url: string) {
		if (!url) {
			return null
		}

		return until(
			(async () => {
				const image = await loadImage(url)

				const {dominantColorFromImage} = await import(
					'@vdegenne/material-color-helpers/scheme-from-image.js'
				)
				const themeColor = await dominantColorFromImage(image)
				themeStore.themeColor = themeColor
				// await sleep(1)

				setFaviconFromImage(image)

				return html`${image}`
			})(),
			loading(),
		)
	}

	// @confirm({headline: 'Logout', content: 'Are you sure you want to logout?'})
	// private _logout() {
	// 	authManager.logout()
	// }
}

export const app = (window.app = new AppShell())
