import { FormButton } from "./FormButton.tsx"
import type { ServerGame } from "./types.ts"

export function ServerView({
	games,
	onSubmitSession,
}: {
	games: ServerGame[]
	onSubmitSession: (values: { gameName: string; playerName: string }) => unknown
}) {
	return (
		<div className="grid size-full place-content-center gap-3">
			<h2 className="text-center font-light text-2xl text-gray-400">
				Enter Player Details
			</h2>
			<form
				className="flex w-80 flex-col gap-3 rounded-md bg-gray-800 p-3"
				action={async (formData) => {
					const gameName = formData.get("game") as string
					const playerName = formData.get("player") as string
					if (!playerName) return

					try {
						await onSubmitSession({
							gameName,
							playerName,
						})
					} catch (error) {
						console.error(error)
						alert(
							`Error: ${
								(error as Error)?.message ?? "An unknown error occurred"
							}`,
						)
					}
				}}
			>
				<label>
					<div className="text-gray-300 text-sm">Game</div>
					<select
						name="game"
						className="h-10 w-full min-w-0 rounded bg-black/40 px-3 focus:bg-black/70"
					>
						{games.map((game) => (
							<option key={game.id} value={game.id}>
								{game.displayName}
							</option>
						))}
					</select>
				</label>

				<label>
					<div className="text-gray-300 text-sm">Player Name</div>
					<input
						name="player"
						className="h-10 w-full min-w-0 rounded bg-black/40 px-3 focus:bg-black/70"
						placeholder="HatKid"
					/>
				</label>

				<FormButton icon="mingcute:open-door-fill">Enter</FormButton>
			</form>
		</div>
	)
}
