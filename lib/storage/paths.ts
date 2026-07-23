import path from "path";
import { stat } from "fs/promises";

const configuredStorageRoot = process.env.STORAGE_ROOT?.trim();

export const storageRoot = configuredStorageRoot
  ? path.resolve(/* turbopackIgnore: true */ configuredStorageRoot)
  : path.join(process.cwd(), "storage");

function getStorageSegments(storedPath: string) {
  const segments = path.normalize(storedPath).split(/[\\/]+/).filter(Boolean);
  const storageIndex = segments.findLastIndex(
    (segment) => segment.toLowerCase() === "storage",
  );

  return storageIndex === -1 ? segments : segments.slice(storageIndex + 1);
}

export function createStorageRelativePath(...segments: string[]) {
  return path.join("storage", ...segments);
}

export function resolveStoragePath(storedPath: string) {
  const segments = getStorageSegments(storedPath);

  if (segments.length === 0) {
    return storageRoot;
  }

  return path.join(storageRoot, ...segments);
}

export function isInsideStorage(filePath: string) {
  const relativePath = path.relative(storageRoot, filePath);

  return (
    relativePath !== "" &&
    !relativePath.startsWith("..") &&
    !path.isAbsolute(relativePath)
  );
}

export async function isStoredFileAvailable(storedPath: string | null | undefined) {
  if (!storedPath) {
    return false;
  }

  const resolvedFilePath = resolveStoragePath(storedPath);

  if (!isInsideStorage(resolvedFilePath)) {
    return false;
  }

  try {
    const fileStat = await stat(resolvedFilePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}
