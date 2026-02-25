import build from "@hono/vite-build/bun";
import adapter from "@hono/vite-dev-server/bun";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import client from "honox/vite/client";
import { defineConfig } from "vite";

const entry = "./app/server.ts";

export default defineConfig(({ mode }) => {
	if (mode === "client") {
		return {
			plugins: [client(), tailwindcss()],
			build: {
				outDir: "dist",
				emptyOutDir: false,
			},
		};
	}
	return {
		plugins: [
			honox({
				devServer: { adapter },
				client: { input: ["/app/style.css"] },
			}),
			tailwindcss(),
			ssg({ entry }),
			build(),
		],
		build: {
			outDir: "dist",
			emptyOutDir: false,
		},
		publicDir: "public",
		ssr: {
			external: ["react", "react-dom"],
		},
	};
});
