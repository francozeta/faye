import { spawn, spawnSync } from "node:child_process";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const projectId = process.env.SUPABASE_PROJECT_REF ?? "kzdmzisotpjeapggchba";
const schema = process.env.SUPABASE_SCHEMA ?? "public";
const timeoutMs = Number(process.env.SUPABASE_TYPES_TIMEOUT_MS ?? 90000);
const outFile = resolve("database.types.ts");
const tempFile = `${outFile}.tmp`;
const resolvePnpmCommand = () => {
  if (process.platform !== "win32") {
    return "pnpm";
  }

  const result = spawnSync("where.exe", ["pnpm.exe"], { encoding: "utf8" });
  return result.stdout.split(/\r?\n/).find(Boolean) ?? "pnpm";
};

const command = resolvePnpmCommand();

const args = [
  "dlx",
  "supabase@2.109.0",
  "gen",
  "types",
  "--project-id",
  projectId,
  "--schema",
  schema,
  "--lang",
  "typescript",
];

const run = () =>
  new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      env: { ...process.env, CI: process.env.CI ?? "true" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      if (process.platform === "win32" && child.pid) {
        spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
          stdio: "ignore",
        });
      } else {
        child.kill();
      }
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", rejectRun);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolveRun({ code, stdout, stderr, timedOut });
    });
  });

const { code, stdout, stderr, timedOut } = await run();

if (timedOut) {
  throw new Error(
    `Supabase type generation timed out after ${timeoutMs}ms. Check Supabase CLI auth for project ${projectId}.`,
  );
}

if (code !== 0) {
  throw new Error(stderr || stdout || `Supabase CLI exited with code ${code}`);
}

if (!stdout.includes("export type Database")) {
  throw new Error(
    [
      "Supabase CLI did not return TypeScript database types.",
      stderr.trim(),
      stdout.trim(),
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

await mkdir(dirname(outFile), { recursive: true });
await writeFile(tempFile, stdout);
await rename(tempFile, outFile);
await rm(tempFile, { force: true });

console.log(`Wrote ${outFile}`);
