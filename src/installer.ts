import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as os from "os";
import * as path from "path";

setEnv();

type Arch = "amd64" | "386" | "arm64" | "armv6" | "armv7";

type Platform = "darwin" | "freebsd" | "linux" | "openbsd" | "windows";

function getWhatChangedArch(): Arch {
  const arch = os.arch();
  switch (arch) {
    case "ia32":
    case "x32":
      return "386";
    case "x64":
      return "amd64";
    case "arm":
      // @ts-expect-error ignore error
      const armv = process.config.variables.arm_version;

      if (!armv) return "armv7";

      return `armv${armv}` as Arch;
    default:
      return arch as Arch;
  }
}

function getWhatChangedPlatform(): Platform {
  const platform = os.platform();
  switch (platform) {
    case "win32":
      return "windows";
    default:
      return platform as Platform;
  }
}

function getDownloadURL(version: string): string {
  const url = `https://github.com/axetroy/whatchanged/releases/download/${version}/whatchanged_${getWhatChangedPlatform()}_${getWhatChangedArch()}.tar.gz`;
  return url;
}

export async function setup(version: string): Promise<void> {
  let cachePath = tc.find("whatchanged", version, getWhatChangedArch());

  if (cachePath) {
    core.debug(`Found in cache @ ${cachePath}`);
  } else {
    cachePath = await install(version);
  }

  // prepend the tools path. instructs the agent to prepend for future tasks
  core.addPath(cachePath);
}

export async function install(version: string): Promise<string> {
  tc.cacheFile;
  const downloadUrl = getDownloadURL(version);

  core.debug(`download what-changed from '${downloadUrl}'`);

  const downloadPath = await tc.downloadTool(downloadUrl);

  core.debug(`download file '${downloadPath}'`);

  const binaryFile = await tc.extractTar(downloadPath);

  core.debug(`extract to '${binaryFile}'`);

  const distPath = await tc.cacheDir(
    binaryFile,
    "whatchanged",
    version,
    getWhatChangedArch()
  );

  return distPath;
}

function setEnv(): void {
  // On load grab temp directory and cache directory and remove them from env (currently don't want to expose this)
  let tempDirectory: string = process.env["RUNNER_TEMP"] || "";
  let cacheRoot: string = process.env["RUNNER_TOOL_CACHE"] || "";
  // If directories not found, place them in common temp locations
  if (!tempDirectory || !cacheRoot) {
    let baseLocation: string;
    if (process.platform === "win32") {
      // On windows use the USERPROFILE env variable
      baseLocation = process.env["USERPROFILE"] || "C:\\";
    } else {
      if (process.platform === "darwin") {
        baseLocation = process.env["HOME"] || "/Users";
      } else {
        baseLocation = process.env["HOME"] || "/home";
      }
    }
    if (!tempDirectory) {
      tempDirectory = path.join(baseLocation, "actions", "temp");
    }
    if (!cacheRoot) {
      cacheRoot = path.join(baseLocation, "actions", "cache");
    }
    process.env["RUNNER_TEMP"] = tempDirectory;
    process.env["RUNNER_TOOL_CACHE"] = cacheRoot;
  }
}
