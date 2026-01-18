import type { ComponentProps } from "react"
import { useFormStatus } from "react-dom"
import { twMerge } from "tailwind-merge"
import { Icon } from "./Icon.tsx"

export function FormButton({
	children,
	icon,
	...props
}: ComponentProps<"button"> & { icon: string }) {
	const status = useFormStatus()
	return (
		<button
			type="submit"
			disabled={status.pending}
			{...props}
			className={twMerge(
				"flex h-10 items-center justify-center gap-2 rounded border-2 border-primary-900 bg-primary-800/25 px-3 hover:bg-primary-700/40 active:bg-primary-600/40 active:duration-0 disabled:opacity-50",
				props.className,
			)}
		>
			<span className="-mx-0.5 *:size-5">
				{status.pending ? (
					<Icon icon="mingcute:loading-3-fill" className="animate-spin" />
				) : (
					<Icon icon={icon} />
				)}
			</span>
			<span>{children}</span>
		</button>
	)
}
