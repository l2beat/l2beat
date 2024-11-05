export const AuthError = {
  Domain: 'Domain',
  InvalidConfig: 'InvalidConfig',
  InvalidRequest: 'InvalidRequest',
  InvalidState: 'InvalidState',
}

export type AuthError = (typeof AuthError)[keyof typeof AuthError]

export const AuthErrorMessages: Record<AuthError, string> = {
  [AuthError.Domain]: "The user's email domain is not in the allowed list.",
  [AuthError.InvalidConfig]:
    'The JWT secret is not set, thus authentication is disabled.',
  [AuthError.InvalidRequest]: 'OAuth authentication failed. Please try again.',
  [AuthError.InvalidState]: 'The authentication state is invalid.',
}
