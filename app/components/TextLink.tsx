import clsx from "clsx";
import type { Child } from "hono/jsx";

interface TextLinkProps {
	href: string;
	children: Child;
	className?: string;
}

export default function TextLink({ href, children, className }: TextLinkProps) {
	const isExternal = href.startsWith("http");

	return (
		<a
			href={href}
			className={clsx(
				"font-medium text-blue-600 underline hover:no-underline",
				"dark:text-blue-500",
				className,
			)}
			{...(isExternal && {
				target: "_blank",
				rel: "noopener noreferrer",
			})}
		>
			{children}
		</a>
	);
}
