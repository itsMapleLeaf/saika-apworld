import { twMerge } from "tailwind-merge"
import { Icon } from "./Icon.tsx"

export type ItemKind = "filler" | "useful" | "progression" | "trap"

export function ItemText({ name, kind }: { name: string; kind: ItemKind }) {
	return (
		<span
			className={twMerge(
				"inline-flex items-baseline gap-2 shrink min-w-0 max-w-full text-start",
				kind === "progression" && "text-pink-300",
				kind === "useful" && "text-purple-300",
				kind === "trap" && "text-red-300",
				kind === "filler" && "text-cyan-300",
			)}
		>
			<span title={kind} className={twMerge("-mx-0.5 self-center")}>
				{kind === "progression" ? (
					<Icon icon="mingcute:heart-fill" />
				) : kind === "useful" ? (
					<Icon icon="mingcute:star-fill" />
				) : kind === "trap" ? (
					<Icon icon="mingcute:bomb-fill" />
				) : (
					<Icon icon="mingcute:package-2-fill" />
				)}
			</span>
			<span className="shrink min-w-0">{name}</span>
		</span>
	)
}
