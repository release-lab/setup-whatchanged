import * as io from "@actions/io";
import * as path from "path";
import * as installer from "../src/installer";

async function cleanup(): Promise<void> {
  await io.rmRF(path.join(__dirname, "runner"));
}

const randomStr = Math.random().toString(36).substring(7);
const toolDir = path.join(__dirname, "runner", randomStr, "tools");
const tempDir = path.join(__dirname, "runner", randomStr, "temp");

process.env["RUNNER_TOOL_CACHE"] = toolDir;
process.env["RUNNER_TEMP"] = tempDir;

describe("installer tests", () => {
  beforeAll(cleanup, 2000);
  afterAll(cleanup, 2000);

  it("install", async () => {
    const version = "v0.2.0";
    await installer.install(version);
  }, 100000);
});
