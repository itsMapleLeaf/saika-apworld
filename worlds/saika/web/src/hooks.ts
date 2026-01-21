import { type RefObject, useEffect, useState } from "react"

export function useElementSize(ref: RefObject<Element | null>) {
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
