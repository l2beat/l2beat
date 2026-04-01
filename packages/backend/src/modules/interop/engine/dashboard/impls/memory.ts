export function getMemoryUsage() {
  const memoryUsage = process.memoryUsage()

  return {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`, // Resident Set Size - total memory allocated
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`, // Total heap size
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`, // Actual memory used
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`, // Memory used by C++ objects
    arrayBuffers: `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`, // Memory for ArrayBuffers
  }
}
