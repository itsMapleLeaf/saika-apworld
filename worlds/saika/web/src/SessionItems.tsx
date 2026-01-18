import { Icon } from "./Icon.tsx"
import { twMerge } from "tailwind-merge"
import { type ItemKind, ItemText } from "./ItemText.tsx"

type Item = {
	id: string
	name: string
	count: number
	used: number
	kind: ItemKind
	note?: string
}

const items: Item[] = [
	{
		id: crypto.randomUUID(),
		name: "Item 1",
		count: 3,
		used: 2,
		kind: "progression",
		note: "hi",
	},
	{
		id: crypto.randomUUID(),
		count: 1,
		used: 0,
		kind: "useful",
		name: "Item 2",
	},
	{
		id: crypto.randomUUID(),
		count: 1,
		used: 1,
		kind: "trap",
		name: "Bomb",
	},
	{
		id: crypto.randomUUID(),
		count: 1,
		used: 1,
		kind: "filler",
		name: "Very very very very very very very very very very very long item name",
	},
]

export function SessionItems() {
	return (
		<ul className="flex flex-col gap-1">
			{items.map((item) => (
				<li key={item.id}>
					<ItemRow item={item} />
				</li>
			))}
		</ul>
	)
}

function ItemRow({ item }: { item: Item }) {
	return (
		<div className="group flex flex-row items-center gap-0.5">
			<button
				type="button"
				className={twMerge(
					"shrink min-w-0",
					"flex flex-row items-center gap-2 rounded px-3 py-1.5 transition hover:bg-gray-800",
				)}
			>
				<ItemText name={item.name} kind={item.kind} />

				{item.used > 0 && (
					<span className="text-gray-400 hover:text-gray-200 transition">
						({item.count - item.used}/{item.count})
					</span>
				)}
			</button>

			<button
				type="button"
				className="rounded p-2 opacity-0 transition hover:bg-gray-800 group-hover:opacity-100 data-visible:opacity-100"
				data-visible={item.note || undefined}
			>
				{item.note ? (
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
