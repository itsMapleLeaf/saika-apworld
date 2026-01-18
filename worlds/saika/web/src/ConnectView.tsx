import { FormButton } from "./FormButton.tsx"

export function ConnectView({
	onSubmitServer,
}: {
	onSubmitServer: (values: {
		name: string
		serverAddress: string
		serverPassword: string
	}) => unknown
}) {
	return (
		<div className="grid size-full place-content-center gap-3">
			<h2 className="text-center font-light text-2xl text-gray-400">Connect</h2>
			<form
				className="flex w-80 flex-col gap-3 rounded-md bg-gray-800 p-3"
				method="post"
				action={async (formData) => {
					const name = formData.get("name") as string
					const serverAddress = formData.get("address") as string
					const serverPassword = (formData.get("password") || "") as string
					if (!serverAddress) return

					try {
						await onSubmitServer({
							name: name || serverAddress,
							serverAddress,
							serverPassword,
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
					<div className="text-gray-300 text-sm">Server Name</div>
					<input
						name="name"
						className="h-10 w-full min-w-0 rounded bg-black/40 px-3 focus:bg-black/70"
						placeholder="The Best Multi Ever"
					/>
				</label>
				<label>
					<div className="text-gray-300 text-sm">Server Address</div>
					<input
						name="address"
						required
						className="h-10 w-full min-w-0 rounded bg-black/40 px-3 focus:bg-black/70"
						placeholder="archipelago.gg:69420"
					/>
				</label>
				<label>
					<div className="text-gray-300 text-sm">Password</div>
					<input
						name="password"
						className="h-10 w-full min-w-0 rounded bg-black/40 px-3 focus:bg-black/70"
						placeholder="••••••••"
					/>
				</label>
				<FormButton icon="mingcute:plugin-fill">Connect</FormButton>
			</form>
		</div>
	)
}
