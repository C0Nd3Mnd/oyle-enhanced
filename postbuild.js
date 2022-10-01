import pkg from "./package.json" assert { type: "json" };
import { promises as fs } from "fs";

async function postbuild() {
  const json = await fs.readFile("dist/manifest.json");
  const manifest = JSON.parse(json);

  manifest.version = pkg.version;

  await fs.writeFile("dist/manifest.json", JSON.stringify(manifest));
}

postbuild().then(() => console.log("Postbuild done"));
