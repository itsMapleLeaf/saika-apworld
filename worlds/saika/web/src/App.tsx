import * as AP from "archipelago.js"
import { type } from "arktype"
import { Activity, type ReactNode, useState } from "react"
import { ConnectView } from "./ConnectView.tsx"
import { NavButton } from "./NavButton.tsx"
import { NavCollapse } from "./NavCollapse.tsx"
import { usePyWebViewStorageState } from "./pywebview.ts"
import { ServerView } from "./ServerView.tsx"
import { SessionView } from "./SessionView.tsx"
import { type GameListItemData, ServerData, SessionData } from "./types.ts"

export function App() {
	const [servers, setServers] = usePyWebViewStorageState(
		"servers",
		ServerData.array(),
		[],
	)

	const [sessions, setSessions] = usePyWebViewStorageState(
		"sessions",
		SessionData.array(),
		[],
	)

	const [sessionViewId, setSessionViewId] = usePyWebViewStorageState(
		"sessionViewId",
		type.string,
	)

	const addServer = async (input: {
		name: string
		serverAddress: string
		serverPassword: string
	}): Promise<void> => {
		const client = new AP.Client()
		const roomInfo = await client.socket.connect(input.serverAddress)

		const id = crypto.randomUUID()

		const games = roomInfo.games
			.filter((id) => id !== "Archipelago")
			.map((id): GameListItemData => ({ id, displayName: id }))
			.sort((a, b) =>
				a.displayName
					.toLocaleLowerCase()
					.localeCompare(b.displayName.toLocaleLowerCase()),
			)

		setServers((servers) => [...servers, { ...input, id, games }])
		setCurrentViewId(id)
	}

	type View = {
		id: string
		label?: ReactNode
		sublabel?: ReactNode
		icon: string
		content: ReactNode
	}

	const connectView: View = {
		id: "Connect",
		icon: "mingcute:plugin-fill",
		content: <ConnectView onSubmitServer={addServer} />,
	}

	const settingsView: View = {
		id: "Settings",
		icon: "mingcute:settings-2-fill",
		content: <p>Settings</p>,
	}

	const serverViews = servers.map((server) => {
		const view = {
			id: server.id,
			label: server.name,
			icon: "mingcute:earth-3-fill",
			server,
			content: (
				<ServerView
					games={server.games}
					onSubmitSession={(input) => {
						const id = crypto.randomUUID()

						window.pywebview.api.add_session({
							id,
							server_address: server.serverAddress,
							server_password: server.serverPassword,
							game_name: input.gameName,
							player_name: input.playerName,
						})

						setSessions((sessions) => [
							...sessions,
							{
								...input,
								id,
								serverId: server.id,
							},
						])
					}}
				/>
			),
			sessionViews: sessions
				.filter((session) => session.serverId === server.id)
				.map(
					(session): View => ({
						id: session.id,
						label: session.playerName,
						sublabel: session.gameName,
						icon: "mingcute:game-2-fill",
						content: (
							<SessionView
								{...server}
								{...session}
								viewId={sessionViewId}
								onViewIdChange={setSessionViewId}
							/>
						),
					}),
				),
		}
		return view satisfies View
	})

	const allViews: [View, ...View[]] = [
		connectView,
		...serverViews,
		...serverViews.flatMap((server) => server.sessionViews),
		settingsView,
	]

	const [currentViewId, setCurrentViewId] = useState(allViews[0].id)

	const currentView =
		allViews.find((view) => view.id === currentViewId) ?? allViews[0]

	const navItemProps = (view: View) => ({
		icon: view.icon,
		label: view.label || view.id,
		sublabel: view.sublabel,
		isCurrent: view.id === currentView.id,
		onClick: () => setCurrentViewId(view.id),
	})

	return (
		<div className="flex h-dvh w-dvw items-stretch">
			<div className="flex min-h-0 w-56 shrink-0 flex-col gap-1.5 bg-gray-900 p-2">
				<NavButton {...navItemProps(connectView)} />

				<div className="basis-px self-stretch bg-gray-700/70" />

				<div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto *:shrink-0">
					{serverViews.map((view) => (
						<NavCollapse
							key={view.id}
							{...navItemProps(view)}
							menuOptions={[
								{
									label: "Copy Address",
									icon: "mingcute:clipboard-fill",
									onClick: () => {
										navigator.clipboard.writeText(view.server.serverAddress)
									},
								},
								{
									label: "Rename",
									icon: "mingcute:edit-2-fill",
									onClick: () => {
										const newName = prompt(
											"Enter a new server name:",
											view.server.name,
										)

										if (newName === null) return

										setServers((servers) =>
											servers.map((s) =>
												s.id === view.server.id ? { ...s, name: newName } : s,
											),
										)
									},
								},
								{
									label: "Delete",
									icon: "mingcute:close-fill",
									onClick: () => {
										const serverSessions = new Map(
											sessions
												.filter((s) => s.serverId === view.server.id)
												.map((s) => [s.id, s]),
										)
										for (const [id] of serverSessions) {
											window.pywebview.api.remove_session(id)
										}
										setServers((servers) =>
											servers.filter((s) => s.id !== view.server.id),
										)
										setSessions((sessions) =>
											sessions.filter((s) => !serverSessions.has(s.id)),
										)
									},
								},
							]}
						>
							{view.sessionViews.map((view) => (
								<NavButton
									key={view.id}
									{...navItemProps(view)}
									onClose={() => {
										window.pywebview.api.remove_session(view.id)
										setSessions((sessions) =>
											sessions.filter((s) => s.id !== view.id),
										)
									}}
								/>
							))}
						</NavCollapse>
					))}
				</div>

				<div className="basis-px self-stretch bg-gray-700/70" />

				<NavButton {...navItemProps(settingsView)} />
			</div>

			<div className="min-w-0 flex-1">
				{allViews.map((view) => (
					<Activity
						key={view.id}
						mode={view.id === currentViewId ? "visible" : "hidden"}
					>
						{view.content}
					</Activity>
				))}
			</div>
		</div>
	)
}
