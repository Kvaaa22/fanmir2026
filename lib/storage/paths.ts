import path from "path";

export const storageRoot = path.resolve(process.cwd(), "storage");

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
