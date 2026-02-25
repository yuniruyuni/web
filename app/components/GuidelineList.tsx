import type { Child } from "hono/jsx";

interface GuidelineListProps {
	children: Child;
}

export default function GuidelineList({ children }: GuidelineListProps) {
	return (
		<ul className="md:w-full text-center md:text-left list-outside list-disc">
			{children}
		</ul>
	);
}
