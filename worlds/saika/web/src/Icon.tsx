import { Icon as BaseIcon } from "@iconify/react"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function Icon({
	icon,
	...props
}: ComponentProps<"span"> & { icon: string }) {
	return (
		<span {...props} className={twMerge("size-5", props.className)}>
			<BaseIcon icon={icon} className="size-full" />
		</span>
	)
}
