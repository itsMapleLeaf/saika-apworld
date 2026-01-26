export type PyWebviewConfigFileStore = {
	get: (key: string) => unknown | null
	set: (key: string, value: unknown) => void
}

export type PyWebviewApi = {
	storage_common: PyWebviewConfigFileStore
	add_session: (args: {
		id: string
		server_address: string
		server_password: string
		game_name: string
		player_name: string
	}) => void
	remove_session: (id: string) => void
}

declare global {
	var pywebview: {
		api: PyWebviewApi
	}
}
