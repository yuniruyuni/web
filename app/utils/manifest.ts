import fs from "node:fs";
import path from "node:path";

export function getClientAssets() {
	if (import.meta.env.DEV) {
		return {
			css: "/app/style.css",
			js: "/app/client.ts",
		};
	}

	try {
		const manifestPath = path.join(process.cwd(), "dist/.vite/manifest.json");
		const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
		const clientEntry = manifest["app/client.ts"];

		return {
			css: clientEntry.css ? `/${clientEntry.css[0]}` : null,
			js: `/${clientEntry.file}`,
		};
	} catch (error) {
		console.error("Failed to read manifest:", error);
		return {
			css: null,
			js: null,
		};
	}
}
