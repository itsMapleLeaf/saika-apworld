import { ItemText } from "./ItemText.tsx"

export function SessionHints() {
	return (
		<ul className="flex flex-col gap-2 py-1.5 px-2">
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
					Very very very very very very very very very very very very very very
					very very very long location name
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
		</ul>
	)
}

function HintElement() {
	return (
		<>
			<ItemText name="Item" kind="progression" /> is at{" "}
			<span className="text-green-300">Location</span> in{" "}
			<span className="text-blue-300">Player</span>'s world.{" "}
			<span className="text-green-300">(priority)</span>
		</>
	)
}
