import {describe, expect, test} from 'vitest'

import {isPrivateIP} from '../src/index.js'

// Valid private and public IPs for testing
const testCases = [
  // Private IPv4 ranges
  ['10.0.0.1', true],
  ['10.255.255.255', true],
  ['172.16.0.1', true],
  ['172.31.255.255', true],
  ['192.168.1.1', true],
  ['192.168.255.255', true],

  // Public IPv4 addresses
  ['8.8.8.8', false],
  ['1.1.1.1', false],
  ['123.45.67.89', false],

  // Private IPv6 ranges
  ['fc00::1', true], // Unique local address (ULA)
  ['fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', true],

  // Public IPv6 addresses
  ['2001:db8::1', false], // Documentation prefix, not strictly public but not private either
  ['2606:4700:4700::1111', false], // Cloudflare DNS
  ['2620:119:35::35', false], // OpenDNS
] as const

// Invalid IPs that should throw an error
const invalidIPs = [
  '',
  'not.an.ip',
  '999.999.999.999',
  '3001::1::1',
  'abcd',
  '192.168.1.256', // Out of range
] as const

describe('isPrivateIP', () => {
  test.each(testCases)('should return %s for IP %s', (ip, expected) => {
    expect(isPrivateIP(ip)).toBe(expected)
  })

  test.each(invalidIPs)('should throw an error for invalid IP %s', (ip) => {
    expect(() => isPrivateIP(ip)).toThrow(/invalid ip address/i)
  })
})
