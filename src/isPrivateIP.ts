import {parseCIDR, parse as parseIP} from 'ipaddr.js'
import {privateRanges} from './privateRanges.js'

/**
 * Checks if an IP address falls within a private/reserved range.
 *
 * @param ipAddress - The IP address to check. Can be either IPv4 or IPv6.
 * @returns True if the IP address is private/reserved, false otherwise.
 * @public
 */
export function isPrivateIP(ipAddress: string): boolean {
  try {
    const parsedIP = parseIP(ipAddress)

    // Check if the IP is within any of the defined private ranges
    const ranges = parsedIP.kind() === 'ipv4' ? privateRanges.ipv4 : privateRanges.ipv6
    return ranges.some((range) => {
      const subnet = parseCIDR(range)
      return parsedIP.match(subnet)
    })
  } catch (error) {
    throw new Error(`Invalid IP address "${ipAddress}"`)
  }
}
