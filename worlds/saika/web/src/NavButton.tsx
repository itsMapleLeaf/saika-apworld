import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "./Icon.tsx"

export interface NavButtonProps extends React.ComponentProps<"button"> {
	icon: string
	label: ReactNode
	sublabel?: ReactNode
	isCurrent: boolean
	onClose?: () => void
}

export function NavButton({
	icon,
	label,
	sublabel,
	isCurrent,
	className,
	onClick,
	onClose,
	...props
}: NavButtonProps) {
	return (
		<div
			className="flex w-full items-center rounded opacity-75 transition hover:bg-gray-800 hover:opacity-100 data-current:bg-gray-800 data-current:opacity-100"
			data-current={isCurrent || undefined}
		>
			<button
				type="button"
				onClick={onClick}
				className={twMerge(
					"flex min-h-10 flex-1 items-center justify-start gap-2 rounded px-3 py-2 -outline-offset-2 transition",
					className,
				)}
				{...props}
			>
				<Icon icon={icon} className="-mx-0.5 size-5 shrink-0" />
				<div className="flex min-w-0 flex-1 flex-col text-start">
					<span className="truncate text-base/tight">{label}</span>
					<span className="truncate text-gray-300/90 text-xs/tight">
						{sublabel}
					</span>
				</div>
			</button>

			<button
				type="button"
				data-visible={isCurrent && onClose ? true : undefined}
				className="flex size-8 items-center justify-center rounded opacity-0 -outline-offset-2 transition data-visible:opacity-100"
				onClick={(event) => {
					if (isCurrent) {
						onClose?.()
					} else {
						onClick?.(event)
					}
				}}
			>
				<Icon icon="mingcute:close-fill" className="-mx-0.5 size-5 shrink-0" />
				<span className="sr-only">Close</span>
			</button>
		</div>
	)
}
