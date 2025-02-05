import {expect, test} from 'vitest'

import {isPrivateUrl} from '../src/index.js'

test('public urls return `false`', async () => {
  await expect(isPrivateUrl('https://www.google.com/foo/bar')).resolves.toBe(false)
})

test('public urls return `false` (with resolve info)', async () => {
  await expect(
    isPrivateUrl('https://www.google.com/foo/bar', {withResolveInfo: true}),
  ).resolves.toStrictEqual({
    isPrivate: false,
    addresses: getAddressesExpectation(),
    parsedUrl: expect.objectContaining({
      host: 'www.google.com',
      hostname: 'www.google.com',
      href: 'https://www.google.com/foo/bar',
      pathname: '/foo/bar',
      protocol: 'https:',
    }),
  })
})

test('localhost return `true`', async () => {
  await expect(isPrivateUrl('http://localhost/blatti')).resolves.toBe(true)
})

test('localhost return `true` (with resolve info)', async () => {
  await expect(
    isPrivateUrl('http://localhost/blatti', {withResolveInfo: true}),
  ).resolves.toStrictEqual({
    isPrivate: true,
    addresses: getAddressesExpectation({ipv4: '127.0.0.1', ipv6: '::1'}),
    parsedUrl: expect.objectContaining({
      host: 'localhost',
      href: 'http://localhost/blatti',
      pathname: '/blatti',
      protocol: 'http:',
    }),
  })
})

test('localtest.me return `true`', async () => {
  await expect(isPrivateUrl('https://localtest.me/')).resolves.toBe(true)
})

test('localtest.me return `true` (with resolve info)', async () => {
  await expect(
    isPrivateUrl('https://localtest.me/', {withResolveInfo: true}),
  ).resolves.toStrictEqual({
    isPrivate: true,
    addresses: getAddressesExpectation({ipv4: '127.0.0.1', ipv6: '::1'}),
    parsedUrl: expect.objectContaining({
      host: 'localtest.me',
      href: 'https://localtest.me/',
      pathname: '/',
      protocol: 'https:',
    }),
  })
})

test('rejects if unable to resolve', async () => {
  await expect(isPrivateUrl('http://no-this-is-not-valid.nonexistant/')).rejects.toThrow(
    /Error resolving hostname/i,
  )
})

test('rejects if url is invalid', async () => {
  await expect(isPrivateUrl('not a url')).rejects.toThrow(
    // node/deno/bun gives slightly different error messages
    /(invalid url|cannot be parsed as a url)/i,
  )
})

function getAddressesExpectation(options?: {ipv4?: string; ipv6?: string}) {
  return expect.arrayContaining([
    expect.objectContaining({
      // rough approximation
      address: options?.ipv4 ?? expect.stringMatching(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/),
      family: 4,
    }),
    expect.objectContaining({
      // rough approximation
      address: options?.ipv6 ?? expect.stringMatching(/^[a-f0-9:]+$/),
      family: 6,
    }),
  ])
}
