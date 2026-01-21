import { Fragment } from "react/jsx-runtime"
import { Icon } from "./Icon.tsx"
import { ItemText } from "./ItemText.tsx"

export function SessionChat() {
	return (
		<div className="flex size-full flex-col gap-2">
			<ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded bg-gray-900 p-1 px-2 py-1.5">
				{Array.from({ length: 100 }).map((_, i) => (
					<Fragment key={i}>
						<li>
							<ItemText name="Item" kind="progression" /> is at{" "}
							<span className="text-green-300">Location</span> in{" "}
							<span className="text-blue-300">Player</span>'s world.{" "}
							<span className="text-green-300">(priority)</span>
						</li>

						<li>
							<ItemText name="Item" kind="useful" /> is at{" "}
							<span className="text-green-300">Location</span> at{" "}
							<span className="text-yellow-300">Entrance</span> in{" "}
							<span className="text-fuchsia-300">ItsaMe</span>'s world.{" "}
							<span className="text-red-300">(avoid)</span>
						</li>

						<li>
							<ItemText
								name="Very very very very very very very very very very very very very very
					very very very long item name"
								kind="trap"
							/>{" "}
							is at{" "}
							<span className="text-green-300">
								Very very very very very very very very very very very very very
								very very very very long location name
							</span>{" "}
							in <span className="text-blue-300">Player</span>'s world.{" "}
							<span className="text-orange-300">(no priority)</span>
						</li>

						<li>
							<ItemText name="Item" kind="filler" /> is at{" "}
							<span className="text-green-300">Location</span> in{" "}
							<span className="text-blue-300">Player</span>'s world.{" "}
							<span className="text-gray-400">(found)</span>
						</li>
					</Fragment>
				))}
			</ul>
			<div className="flex gap-2">
				<textarea
					className="field-sizing-content w-full flex-1 rounded bg-gray-900 px-3 py-2"
					placeholder="Say something..."
				/>
				<button
					type="button"
					className="flex aspect-square h-full items-center justify-center rounded transition hover:bg-gray-800"
				>
					<Icon icon="mingcute:send-fill" />
				</button>
			</div>
		</div>
	)
}
