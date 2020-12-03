import * as core from "@actions/core";
import * as installer from "./installer";

async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    if (version) {
      await installer.setup(version);
    } else {
      throw new Error("No version specified.");
    }
  } catch (e) {
    const err = e as Error;
    core.setFailed(err.stack || err.message);
  }
}

run();
