import { access, copyFile, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";

const baseDir = ".netlify/edge-functions/entry.netlify-edge";

const aliases = [
  ["@qwik-city-not-found-paths.js", "qwik-city-not-found-paths.js"],
  ["@qwik-city-static-paths.js", "qwik-city-static-paths.js"],
  ["@qwik-city-plan.js", "qwik-city-plan.js"],
];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function createAliases() {
  for (const [src, dest] of aliases) {
    const srcPath = `${baseDir}/${src}`;
    const destPath = `${baseDir}/${dest}`;
    if (await exists(srcPath)) {
      await copyFile(srcPath, destPath);
    }
  }
}

async function rewriteImports() {
  const entryFile = `${baseDir}/entry.netlify-edge.js`;
  if (!(await exists(entryFile))) return;

  let content = await readFile(entryFile, "utf8");
  content = content
    .replaceAll("./@qwik-city-not-found-paths.js", "./qwik-city-not-found-paths.js")
    .replaceAll("./@qwik-city-static-paths.js", "./qwik-city-static-paths.js")
    .replaceAll("./@qwik-city-plan.js", "./qwik-city-plan.js");
  await writeFile(entryFile, content, "utf8");
}

await createAliases();
await rewriteImports();
