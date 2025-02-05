import type {LookupAddress} from 'node:dns'
import {lookup} from 'node:dns/promises'

import {isPrivateIP} from './isPrivateIP.js'

/**
 * Resolve result for a given hostname
 *
 * @public
 */
export interface HostResolveInfo {
  isPrivate: boolean
  addresses: LookupAddress[]
}

/**
 * Determines if a the given hostname resolves to a "private" IP address
 *
 * @param hostname - Hostname to check
 * @returns Promise resolving to true if the hostname resolves to a private IP address, false otherwise
 * @public
 */
export async function isPrivateHost(hostname: string): Promise<boolean>

/**
 * Determines if a the given hostname resolves to a "private" IP address
 *
 * @param hostname - Hostname to check
 * @param options - Options for the resolve operation
 * @returns Promise resolving to true if the hostname resolves to a private IP address, false otherwise
 * @public
 */
export async function isPrivateHost(
  hostname: string,
  options: Record<string, never>,
): Promise<boolean>

/**
 * Determines if a the given hostname resolves to a "private" IP address
 *
 * @param hostname - Hostname to check
 * @param options - Options for the resolve operation
 * @returns Promise resolving to true if the hostname resolves to a private IP address, false otherwise
 * @public
 */
export async function isPrivateHost(
  hostname: string,
  options: {withResolveInfo: false},
): Promise<boolean>

/**
 * Determines if a the given hostname resolves to a "private" IP address
 *
 * @param hostname - Hostname to check
 * @param options - Options for the resolve operation
 * @returns Promise resolving to an object containing the resolve information
 * @public
 */
export async function isPrivateHost(
  hostname: string,
  options: {withResolveInfo: true},
): Promise<HostResolveInfo>

export async function isPrivateHost(
  hostname: string,
  options?: {withResolveInfo?: boolean},
): Promise<boolean | HostResolveInfo> {
  try {
    const addresses = await lookup(hostname, {
      // Check both IPv4 and IPv6 records since we don't know which one will be used in the end
      all: true,
    })

    const isPrivate = addresses.some(({address}) => isPrivateIP(address))
    return options && options.withResolveInfo ? {isPrivate, addresses} : isPrivate
  } catch (error: unknown) {
    throw new Error(
      `Error resolving hostname "${hostname}": ${error instanceof Error ? error.message : error}`,
      {cause: error},
    )
  }
}
