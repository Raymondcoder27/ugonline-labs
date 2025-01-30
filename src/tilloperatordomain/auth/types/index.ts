/**
 * SignIn Payload
 * https://api.v1.ifass.go.ug/auth/login
 *
 */
export interface SignInPayloadInterface {
  username: string
  password: string
}

/**
 * SignUp Payload
 * https://api.v1.ifass.go.ug/auth/signup
 *
 */
export interface SignUpPayloadInterface {
  username: string
  password: string
  phone: string
}

/**
 * Token Refresh Payload
 * https://api.v1.ifass.go.ug/auth/refresh
 *
 */
export interface TokenRefreshPayloadInterface {
  refresh_token: string
}

/**
 * Resend Verification Payload
 * https://api.v1.ifass.go.ug/auth/resend-verification
 *
 */
export interface ResendVerificationPayloadInterface {
  purpose: "email" | "phone" | "change-password"
  username: string
}

export interface SignUpResponseInterface {
  id: string
  username: string
  phone: string
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
}

export interface UserProfileInterface {
  id: string
  firstName:string
  lastName:string
  username: string
  phone: string
  emailVerified: boolean
  phoneVerified: boolean
  email:string
  createdAt: string
  sessions: SessionInterface[]
}

export interface SessionInterface {
  id: string
  active: boolean
  issuedAt: string
  expiresAt: string
  devices:DeviceInterface[]
}

export interface DeviceInterface {
  id: string
  sessionID: string
  ipAddress: string
  userAgent: string
  createdAt: string
  lastActivityAt: string
}

export interface SignInResponseInterface {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  timestamp?: number
}

export interface AuthResponseInterface<T> {
  success: boolean
  type: string
  data: T
  time: number
}

export interface JwtTokenInterface {
  aud: Array<string>
  client: number
  exp: number
  iat: number
  iss: string
  jti: string
  msisdn?: string
  name?: string
  nbf: number
  ssid?: string
  sub: string
  username?: string
}
