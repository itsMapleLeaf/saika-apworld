import { Tabs } from "@base-ui-components/react"
import { type ReactNode, useRef } from "react"
import { Icon } from "./Icon.tsx"
import { SessionLocations } from "./SessionLocations.tsx"
import { SessionItems } from "./SessionItems.tsx"
import { SessionHints } from "./SessionHints.tsx"
import { useElementSize } from "./hooks.ts"
import { SessionChat } from "./SessionChat.tsx"

export function SessionView(props: {
	serverAddress: string
	serverPassword: string
	gameName: string
	playerName: string
	viewId: string | undefined
	onViewIdChange: (viewId: string) => void
}) {
	type ViewMap = Record<
		string,
		{
			icon: string
			content: ReactNode
		}
	>

	const commonViewMap = {
		settings: { icon: "mingcute:settings-2-fill", content: <>Settings</> },
	} satisfies ViewMap

	const narrowScreenViewMap = {
		locations: {
			icon: "mingcute:map-fill",
			content: <SessionLocations />,
		},
		items: {
			icon: "mingcute:package-2-fill",
			content: <SessionItems />,
		},
		chat: {
			icon: "mingcute:message-2-fill",
			content: <SessionChat />,
		},
		hints: {
			icon: "mingcute:question-fill",
			content: <SessionHints />,
		},
		...commonViewMap,
	} satisfies ViewMap

	const wideScreenViewMap = {
		tracker: {
			icon: "mingcute:checkbox-fill",
			content: (
				<div className="grid size-full auto-rows-fr grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] gap-2 ">
					<div className="bg-gray-900 p-1 rounded ">
						{narrowScreenViewMap.locations.content}
					</div>
					<div className="bg-gray-900 p-1 rounded ">
						{narrowScreenViewMap.items.content}
					</div>
					<div className="bg-gray-900 p-1 rounded col-span-full">
						{narrowScreenViewMap.hints.content}
					</div>
					<div className="col-span-full">
						{narrowScreenViewMap.chat.content}
					</div>
				</div>
			),
		},
		...commonViewMap,
	} satisfies ViewMap

	const containerRef = useRef<HTMLDivElement>(null)
	const containerSize = useElementSize(containerRef)

	const views = Object.entries(
		containerSize.width < 640 || containerSize.height < 640
			? narrowScreenViewMap
			: wideScreenViewMap,
	).map(([id, view]) => ({
		...view,
		id,
	}))

	const currentView = views.find((v) => v.id === props.viewId) ?? views[0]

	return (
		<Tabs.Root
			ref={containerRef}
			className="flex size-full flex-col gap-2 p-2"
			value={currentView?.id}
			onValueChange={props.onViewIdChange}
		>
			<Tabs.List className="flex gap-2 overflow-x-auto">
				{views.map((view) => (
					<Tabs.Tab
						key={view.id}
						value={view.id}
						className="flex h-10 items-center gap-2 rounded px-3 capitalize opacity-75 transition hover:bg-gray-800 data-active:bg-gray-800 data-active:opacity-100"
					>
						<Icon icon={view.icon} className="-mx-0.5 size-5 shrink-0" />
						{view.id}
					</Tabs.Tab>
				))}
			</Tabs.List>
			{views.map((view) => (
				<Tabs.Panel key={view.id} value={view.id} className="flex-1 min-h-0">
					{view.content}
				</Tabs.Panel>
			))}
		</Tabs.Root>
	)
}
