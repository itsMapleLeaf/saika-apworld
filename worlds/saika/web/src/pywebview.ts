type PyWebviewApi = {
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
