import clsx from "clsx";
import type { Child } from "hono/jsx";

interface GuidelineItemProps {
	children: Child;
	bold?: boolean;
	className?: string;
}

export default function GuidelineItem({
	children,
	bold = false,
	className,
}: GuidelineItemProps) {
	return (
		<li className={clsx("text-gray-600", bold && "font-bold", className)}>
			{children}
		</li>
	);
}
