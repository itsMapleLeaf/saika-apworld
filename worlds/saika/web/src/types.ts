export type Server = {
	id: string
	name: string
	serverAddress: string
	serverPassword: string
	games: ServerGame[]
}

export type Session = {
	id: string
	serverId: string
	gameName: string
	playerName: string
}

export type ServerGame = {
	id: string
	displayName: string
}
