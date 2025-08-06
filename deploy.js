#!/usr/bin/env bun

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

// ANSI color codes for nicer output
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
};

console.log(
	`\n${colors.bright}${colors.cyan}🚀 Starting Vercel Deployment Process${colors.reset}\n`,
);

// Check if vercel CLI is installed
try {
	execSync("vercel --version", { stdio: "ignore" });
} catch (error) {
	console.log(
		`${colors.yellow}⚠️  Vercel CLI not found. Installing...${colors.reset}`,
	);
	try {
		execSync("npm install -g vercel", { stdio: "inherit" });
		console.log(
			`${colors.green}✅ Vercel CLI installed successfully${colors.reset}`,
		);
	} catch (installError) {
		console.error(
			`${colors.red}❌ Failed to install Vercel CLI${colors.reset}`,
		);
		process.exit(1);
	}
}

// Check if package.json exists
if (!existsSync(join(process.cwd(), "package.json"))) {
	console.error(
		`${colors.red}❌ package.json not found. Make sure you're in the correct directory.${colors.reset}`,
	);
	process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const isProd = args.includes("--prod") || args.includes("-p");
const skipBuild = args.includes("--skip-build") || args.includes("-s");

// Build the application
if (!skipBuild) {
	console.log(`${colors.cyan}📦 Building application...${colors.reset}`);
	try {
		execSync("bun run build", { stdio: "inherit" });
		console.log(
			`${colors.green}✅ Build completed successfully${colors.reset}`,
		);
	} catch (error) {
		console.error(`${colors.red}❌ Build failed${colors.reset}`);
		process.exit(1);
	}
}

// Deploy to Vercel
console.log(
	`\n${colors.cyan}🚀 Deploying to Vercel (${isProd ? "production" : "preview"})...${colors.reset}`,
);

try {
	const command = isProd ? "vercel --prod" : "vercel";
	execSync(command, { stdio: "inherit" });
	console.log(
		`\n${colors.green}${colors.bright}✅ Deployment successful!${colors.reset}`,
	);
} catch (error) {
	console.error(`\n${colors.red}❌ Deployment failed${colors.reset}`);
	process.exit(1);
}
