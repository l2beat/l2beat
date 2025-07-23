type Result =
  | {
      type: 'success'
    }
  | {
      type: 'error'
      status: number
      message: string
      url: string
    }

/**
 * Tests if a page can be fetched successfully
 * @param url - The URL to test
 * @throws {Error} If the fetch fails or returns a non-successful status code
 */
export async function testPage(url: string): Promise<Result> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'L2Beat-Test/1.0',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      return {
        type: 'error',
        status: response.status,
        message: response.statusText,
        url,
      }
    }

    // Optionally check if we got some content
    const contentLength = response.headers.get('content-length')
    if (contentLength && Number.parseInt(contentLength) === 0) {
      return {
        type: 'error',
        status: response.status,
        message: 'Empty response received',
        url,
      }
    }

    return {
      type: 'success',
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        type: 'error',
        status: 500,
        message: error.message,
        url,
      }
    }
    return {
      type: 'error',
      status: 500,
      message: 'Unknown error',
      url,
    }
  }
}
