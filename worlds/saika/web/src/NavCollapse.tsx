import { Collapsible, Menu } from "@base-ui-components/react"
import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "./Icon.tsx"

export interface NavCollapseProps {
	label: ReactNode
	className?: string
	isCurrent: boolean
	onClick: () => void
	children: React.ReactNode
	menuOptions: {
		id?: string
		label: string
		icon: string
		onClick: () => void
	}[]
}

export function NavCollapse(props: NavCollapseProps) {
	return (
		<Collapsible.Root className="contents" defaultOpen>
			<div
				className="group flex min-h-7 w-full rounded opacity-75 transition duration-150 hover:bg-gray-800 hover:opacity-100 data-current:bg-gray-800 data-current:opacity-100"
				data-current={props.isCurrent || undefined}
			>
				<Collapsible.Trigger
					render={<div />}
					className={twMerge(
						"flex aspect-square h-full shrink-0 items-center justify-center rounded transition hover:bg-gray-800",
						"group",
						props.className,
					)}
				>
					<Icon
						icon="mingcute:right-fill"
						className="size-4 shrink-0 group-data-panel-open:rotate-90"
					/>
				</Collapsible.Trigger>

				<button
					type="button"
					className="w-full flex-1 truncate rounded text-start text-gray-300 text-sm opacity-75 -outline-offset-2 transition duration-150 hover:bg-gray-800 hover:opacity-100 data-current:bg-gray-800 data-current:opacity-100"
					data-current={props.isCurrent || undefined}
					onClick={props.onClick}
				>
					{props.label}
				</button>

				<Menu.Root>
					<Menu.Trigger className="flex aspect-square h-full shrink-0 items-center justify-center rounded opacity-0 transition hover:bg-gray-800 group-focus-within:opacity-100 group-hover:opacity-100">
						<Icon icon="mingcute:more-2-fill" className="size-4 shrink-0" />
					</Menu.Trigger>
					<Menu.Portal>
						<Menu.Positioner side="right" sideOffset={12} align="start">
							<Menu.Popup className="flex min-w-40 origin-(--transform-origin) flex-col gap-1 rounded-md bg-gray-900 p-1 transition duration-100 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0">
								{props.menuOptions.map((opt) => (
									<Menu.Item
										key={opt.id || opt.label}
										className="flex h-10 items-center justify-start gap-2 rounded px-3 transition hover:bg-gray-800"
										onClick={opt.onClick}
									>
										<Icon icon={opt.icon} className="-mx-0.5 size-5" />
										<span className="flex-1">{opt.label}</span>
									</Menu.Item>
								))}
							</Menu.Popup>
						</Menu.Positioner>
					</Menu.Portal>
				</Menu.Root>
			</div>
			<Collapsible.Panel className="contents">
				{props.children}
			</Collapsible.Panel>
		</Collapsible.Root>
	)
}
