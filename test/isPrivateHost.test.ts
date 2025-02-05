import {expect, test} from 'vitest'
import {isPrivateHost} from '../src/isPrivateHost.js'

test('public hosts return `false`', async () => {
  await expect(isPrivateHost('www.google.com')).resolves.toBe(false)
})

test('public hosts return `false` (with resolve info)', async () => {
  await expect(isPrivateHost('www.google.com', {withResolveInfo: true})).resolves.toStrictEqual({
    isPrivate: false,
    addresses: getAddressesExpectation(),
  })
})

test('localhost return `true`', async () => {
  await expect(isPrivateHost('localhost')).resolves.toBe(true)
})

test('localhost return `true` (with resolve info)', async () => {
  await expect(isPrivateHost('localhost', {withResolveInfo: true})).resolves.toStrictEqual({
    isPrivate: true,
    addresses: getAddressesExpectation({ipv4: '127.0.0.1', ipv6: '::1'}),
  })
})

test('localtest.me return `true`', async () => {
  await expect(isPrivateHost('localtest.me')).resolves.toBe(true)
})

test('localtest.me return `true` (with resolve info)', async () => {
  await expect(isPrivateHost('localtest.me', {withResolveInfo: true})).resolves.toStrictEqual({
    isPrivate: true,
    addresses: getAddressesExpectation({ipv4: '127.0.0.1', ipv6: '::1'}),
  })
})

test('rejects if unable to resolve', async () => {
  await expect(isPrivateHost('no this is not valid')).rejects.toThrow(/Error resolving hostname/i)
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
