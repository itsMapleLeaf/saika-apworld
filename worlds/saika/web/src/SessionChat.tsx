import { Fragment } from "react/jsx-runtime"
import { ItemText } from "./ItemText.tsx"
import { Icon } from "./Icon.tsx"

export function SessionChat() {
	return (
		<div className="flex flex-col gap-2 size-full">
			<ul className="flex flex-col gap-2 py-1.5 px-2 bg-gray-900 p-1 rounded flex-1 min-h-0 overflow-y-auto">
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
					className="bg-gray-900 px-3 py-2 rounded w-full field-sizing-content flex-1"
					placeholder="Say something..."
				/>
				<button
					type="button"
					className="h-full aspect-square hover:bg-gray-800 transition rounded flex items-center justify-center"
				>
					<Icon icon="mingcute:send-fill" />
				</button>
			</div>
		</div>
	)
}
