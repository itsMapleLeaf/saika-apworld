import { type ArkErrors, type } from "arktype"
import { useEffect, useEffectEvent, useState } from "react"

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

export function usePyWebViewStorage<State>({
	key,
	defaultValue,
	fromSaved,
	toSaved,
}: {
	key: string
	defaultValue: State
	fromSaved: (data: unknown) => State
	toSaved: (value: State) => unknown
}) {
	const [state, setState] = useState<State>(defaultValue)
	const [loaded, setLoaded] = useState(false)

	usePyWebViewApiReady(async () => {
		const stored = await window.pywebview.api.storage_common.get(key)
		setState(fromSaved(stored))
		setLoaded(true)
	})

	const saveEvent = useEffectEvent((key: string, state: State) => {
		window.pywebview.api.storage_common.set(key, toSaved(state))
	})

	useEffect(() => {
		if (!loaded) return
		saveEvent(key, state)
	}, [key, state, loaded])

	return [state, setState] as const
}

export function usePyWebViewStorageState<Value, DefaultValue = undefined>(
	key: string,
	parse: (loaded: unknown) => Value | ArkErrors,
	defaultValue?: DefaultValue,
) {
	const [value, setValue] = useState<Value | DefaultValue>(
		defaultValue as DefaultValue,
	)
	const [loaded, setLoaded] = useState(false)

	usePyWebViewApiReady(async () => {
		const stored = await window.pywebview.api.storage_common.get(key)
		const parsed = parse(stored)
		if (parsed instanceof type.errors) {
			console.error(`failed to load storage data (${key}):`, parsed.summary)
			console.error("original data:", stored)
		} else {
			setValue(parsed)
		}
		setLoaded(true)
	})

	useEffect(() => {
		if (!loaded) return
		window.pywebview.api.storage_common.set(key, value)
	}, [value, loaded, key])

	return [value, setValue] as const
}

export function usePyWebViewApiReady(onReady: () => void) {
	const onReadyEvent = useEffectEvent(() => {
		onReady()
	})
	useEffect(() => {
		const isReady = Object.keys(window.pywebview?.api ?? {}).length > 0
		if (isReady) {
			onReadyEvent()
		} else {
			window.addEventListener("pywebviewready", onReadyEvent, { once: true })
		}
	}, [])
}
