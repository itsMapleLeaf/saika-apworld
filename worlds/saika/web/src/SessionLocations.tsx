import { useRef } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "./Icon.tsx"
import type { LocationData } from "./types.ts"

const locations: LocationData[] = [
	{
		id: crypto.randomUUID(),
		name: "Location 1",
		status: "unreachable",
		hint: "there's a thing",
		hintViewed: false,
	},
	{
		id: crypto.randomUUID(),
		name: "Location 2",
		status: "reachable",
		note: "hi",
	},
	{
		id: crypto.randomUUID(),
		name: "Very very very very very very very very very very very very very very long location name",
		status: "checked",
		hint: "there's a thing",
		hintViewed: true,
	},
]

export function SessionLocations() {
	return (
		<ul className="flex flex-col gap-1">
			{locations.map((loc) => (
				<li key={loc.id}>
					<LocationButton {...loc} />
				</li>
			))}
		</ul>
	)
}

type LocationButtonProps = {
	id: string
	name: string
	status: "unreachable" | "reachable" | "checked"
	hint?: string
	hintViewed?: boolean
	note?: string
}

function LocationButton(location: LocationButtonProps) {
	const ref = useRef<HTMLButtonElement>(null)
	const progressRef = useRef<HTMLDivElement>(null)
	const animationRef = useRef<Animation>(null)

	return (
		<div className="group relative isolate flex flex-row items-center gap-0.5">
			<div className="relative min-w-0 shrink">
				<span
					ref={progressRef}
					className="absolute inset-0 -z-10 w-0 rounded bg-primary-400/25"
				/>
				<button
					type="button"
					ref={ref}
					className={twMerge(
						"flex w-full flex-row items-center gap-2 rounded px-3 py-1.5 text-start transition hover:bg-white/10",
						location.status === "reachable" &&
							"text-primary-300 hover:bg-primary-800/20",
						location.status === "checked" && "brightness-60",
					)}
					onPointerDown={() => {
						if (location.status === "checked") return

						const anim = (animationRef.current = progressRef.current!.animate(
							[{ width: "0%" }, { width: "100%" }],
							{ duration: 500 },
						))

						anim.addEventListener("finish", () => {
							console.log("checked")
						})

						const aborter = new AbortController()
						const { signal } = aborter

						window.addEventListener(
							"pointerup",
							() => {
								anim.cancel()
								aborter.abort()
							},
							{ signal },
						)

						anim.addEventListener("cancel", () => aborter.abort(), { signal })
						anim.addEventListener("remove", () => aborter.abort(), { signal })
					}}
					onPointerLeave={() => {
						animationRef.current?.cancel()
					}}
				>
					<span className="-mx-0.5">
						{location.status === "unreachable" ? (
							<Icon icon="mingcute:round-line" />
						) : location.status === "reachable" ? (
							<Icon icon="mingcute:add-circle-line" />
						) : (
							<Icon icon="mingcute:check-circle-fill" />
						)}
					</span>
					<span className="min-w-0 shrink-1">
						{/* <div className="truncate">{location.name}</div> */}
						{location.name}
					</span>
				</button>
			</div>

			{location.hint && (
				<button
					type="button"
					className="rounded p-2 opacity-75 transition hover:bg-gray-800 group-hover:opacity-100"
				>
					{location.hintViewed ? (
						<Icon icon="mingcute:question-line" className="size-4" />
					) : (
						<Icon icon="mingcute:question-fill" className="size-4" />
					)}
				</button>
			)}

			<button
				type="button"
				className="rounded p-2 opacity-0 transition hover:bg-gray-800 group-hover:opacity-100 data-visible:opacity-100"
				data-visible={location.note || undefined}
			>
				{location.note ? (
					<Icon icon="mingcute:edit-4-fill" className="size-4" />
				) : (
					<Icon icon="mingcute:edit-4-line" className="size-4" />
				)}
			</button>

			<button
				type="button"
				className="rounded p-2 opacity-0 transition hover:bg-gray-800 group-hover:opacity-100"
			>
				<Icon icon="mingcute:copy-2-fill" className="size-4" />
			</button>
		</div>
	)
}
