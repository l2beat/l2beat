export interface MultipartBody {
  buffer: Buffer
  contentType: string
  contentLength: number
}

export function createAnalyzeMultipartBody(fileName: string, code: string) {
  const boundary = `l2beat-analyze-${Date.now().toString(36)}`
  const safeFileName = fileName.replace(/[\r\n"]/g, '_')
  const parts = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${safeFileName}"`,
    'Content-Type: text/plain',
    '',
    code,
    `--${boundary}`,
    'Content-Disposition: form-data; name="entrypoint"',
    '',
    fileName,
    `--${boundary}--`,
    '',
  ]
  const buffer = Buffer.from(parts.join('\r\n'))

  return {
    buffer,
    contentType: `multipart/form-data; boundary=${boundary}`,
    contentLength: buffer.length,
  }
}
