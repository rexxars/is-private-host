/**
 * @internal
 */
const PRIVATE_IPV4_RANGES = [
  // Unspecified
  '0.0.0.0/8',
  // Private Class A
  '10.0.0.0/8',
  // CGNAT (Optional)
  '100.64.0.0/10',
  // Loopback
  '127.0.0.0/8',
  // Link-local
  '169.254.0.0/16',
  // Private Class B
  '172.16.0.0/12',
  // Private Class C
  '192.168.0.0/16',
]

/**
 * @internal
 */
const PRIVATE_IPV6_RANGES = [
  // Unspecified
  '::/128',
  // Loopback
  '::1/128',
  // IPv4-Mapped IPv6
  '::ffff:0:0/96',
  // NAT64
  '64:ff9b::/96',
  // Unique Local Addresses (ULA)
  'fc00::/7',
  // Link-local
  'fe80::/10',
]

/**
 * @internal
 */
export const privateRanges = {
  ipv4: PRIVATE_IPV4_RANGES,
  ipv6: PRIVATE_IPV6_RANGES,
}
