import { type } from "arktype"

export type GameListItemData = typeof GameListItemData.inferOut
export const GameListItemData = type({
	id: "string",
	displayName: "string",
})

export type ServerData = typeof ServerData.inferOut
export const ServerData = type({
	id: "string",
	name: "string",
	serverAddress: "string",
	serverPassword: "string",
	games: GameListItemData.array(),
})

export type SessionData = typeof SessionData.inferOut
export const SessionData = type({
	id: "string",
	serverId: "string",
	gameName: "string",
	playerName: "string",
})

export type GameData = {
	id: string
	name: string
	sha: string
	itemNameMap: Record<number, string>
	locationNameMap: Record<number, string>
}

export type SlotData = {
	id: number
	name: string
	gameId: string
}

export type LocationData = {
	id: string
	name: string
	status: "unreachable" | "reachable" | "checked"
	hint?: string
	hintViewed?: boolean
	note?: string
}

export type ItemKind = "filler" | "useful" | "progression" | "trap"
export type ItemData = {
	id: string
	name: string
	count: number
	used: number
	kind: ItemKind
	note?: string
}

export type HintData = {
	id: string
	itemPlayerId: number
	itemId: number
	locationPlayerId: number
	locationId: number
	status: "priority" | "no priority" | "avoid" | "found"
}
