import {html} from 'lit'

export const nothingYet = () => html`
	<div class="flex items-center justify-center gap-3 m-6">
		<md-icon>folder_open</md-icon>
		<span>Nothing yet :-(</span>
	</div>
`

export const loading = () =>
	html`<!-- -->
		<md-circular-progress indeterminate></md-circular-progress>
		<!-- -->`
