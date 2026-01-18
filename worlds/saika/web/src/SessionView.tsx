import { Tabs } from "@base-ui-components/react"
import {
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react"
import { Icon } from "./Icon.tsx"

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
		locations: { icon: "mingcute:map-fill", content: <>Locations</> },
		items: { icon: "mingcute:package-2-fill", content: <>Items</> },
		chat: { icon: "mingcute:message-2-fill", content: <>Chat</> },
		hints: { icon: "mingcute:question-fill", content: <>Hints</> },
		...commonViewMap,
	} satisfies ViewMap

	const wideScreenViewMap = {
		tracker: {
			icon: "mingcute:checkbox-fill",
			content: (
				<div className="grid size-full auto-rows-fr grid-cols-[1fr_--spacing(64)] gap-2">
					<div className="">{narrowScreenViewMap.locations.content}</div>
					<div className="">{narrowScreenViewMap.items.content}</div>
					<div className="col-span-full">
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
		containerSize.width < 640 && containerSize.height < 640
			? narrowScreenViewMap
			: wideScreenViewMap,
	).map(([id, view]) => ({
		...view,
		id,
	}))

	const currentView = views.find((v) => v.id === props.viewId) ?? views[0]

	return (
		<div ref={containerRef} className="size-full">
			<Tabs.Root
				className="flex h-full flex-col gap-2 p-2"
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
					<Tabs.Panel key={view.id} value={view.id} className="flex-1">
						{view.content}
					</Tabs.Panel>
				))}
			</Tabs.Root>
		</div>
	)
}

function useElementSize(ref: RefObject<Element | null>) {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		if (!ref.current) return

		setWidth(ref.current.clientWidth)
		setHeight(ref.current.clientHeight)

		const observer = new ResizeObserver((entries) => {
			const entry = entries.at(-1)
			if (!entry) {
				console.warn("No resize entries")
				return
			}
			setWidth(entry.contentRect.width)
			setHeight(entry.contentRect.height)
		})

		observer.observe(ref.current)
		return () => observer.disconnect()
	}, [ref])

	return { width, height }
}
