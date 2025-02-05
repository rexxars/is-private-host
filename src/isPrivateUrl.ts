import type {LookupAddress} from 'node:dns'

import {type HostResolveInfo, isPrivateHost} from './isPrivateHost.js'

/**
 * Resolve result for a given URL
 *
 * @public
 */
export interface UrlResolveInfo {
  isPrivate: boolean
  parsedUrl: URL
  addresses: LookupAddress[]
}

/**
 * Determines if a the given URL resolves to a "private" IP address
 *
 * @param url - URL to check
 * @returns Promise resolving to true if the URL resolves to a private IP address, false otherwise
 * @public
 */
export async function isPrivateUrl(url: string): Promise<boolean>

/**
 * Determines if a the given URL resolves to a "private" IP address
 *
 * @param url - URL to check
 * @param options - Options for the resolve operation
 * @returns Promise resolving to true if the URL resolves to a private IP address, false otherwise
 * @public
 */
export async function isPrivateUrl(url: string, options: Record<string, never>): Promise<boolean>

/**
 * Determines if a the given URL resolves to a "private" IP address
 *
 * @param url - URL to check
 * @param options - Options for the resolve operation
 * @returns Promise resolving to true if the URL resolves to a private IP address, false otherwise
 * @public
 */
export async function isPrivateUrl(url: string, options: {withResolveInfo: false}): Promise<boolean>

/**
 * Determines if a the given URL resolves to a "private" IP address
 *
 * @param url - URL to check
 * @param options - Options for the resolve operation
 * @returns Promise resolving to an object containing the resolve information
 * @public
 */
export async function isPrivateUrl(
  url: string,
  options: {withResolveInfo: true},
): Promise<UrlResolveInfo>

export async function isPrivateUrl(
  url: string,
  options?: {withResolveInfo?: boolean},
): Promise<boolean | HostResolveInfo> {
  const parsedUrl = new URL(url)
  const {isPrivate, addresses} = await isPrivateHost(parsedUrl.hostname, {withResolveInfo: true})
  const resolveInfo: UrlResolveInfo = {isPrivate, parsedUrl, addresses}
  return options && options.withResolveInfo ? resolveInfo : isPrivate
}
