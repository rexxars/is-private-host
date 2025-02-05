# is-private-host

[![npm version](https://img.shields.io/npm/v/is-private-host.svg?style=flat-square)](https://www.npmjs.com/package/is-private-host)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/is-private-host?style=flat-square)](https://bundlephobia.com/result?p=is-private-host)

Determines if a URL or hostname resolves to a "private" IP, for instance `127.0.0.1`, `192.168.x.x`, `::1` or similar. Can also be used to check a specific IP.

> [!CAUTION]
> It is not safe to cache the results for long - a host may change their DNS records to point to a private IP immediately after a lookup, theoretically.

## Supported engines

- Node.js >= 18
- Deno >= 1.30
- Bun >= 1.1.23

…and any other Javascript environment that implements `lookup()` from `node:dns/promises`.

## Installation

```bash
npm install --save is-private-host
```

## Usage

### True/false on hostname

```ts
import {isPrivateHost} from 'is-private-host'

if (await isPrivateHost('espen.codes')) {
  console.log('It is private! Do not run a request against it!')
} else {
  console.log('It is not private! You should be good to go.')
}
```

### With resolved IPs

```ts
import {isPrivateHost} from 'is-private-host'

const {isPrivate, addresses} = await isPrivateHost('espen.codes', {withResolveInfo: true})

const ips = addresses.map(({address, family}) => {
  // eg `127.0.0.1 (IPv4)` or `::1 (IPv6)`
  return `${address} (IPv${family})`
})

if (isPrivate) {
  console.log(`It is private! It resolves to ${ips.join(' / ')}`)
} else {
  console.log('It is not private! You should be good to go.')
}
```

### With full URLs

```ts
import {isPrivateUrl} from 'is-private-host'

if (await isPrivateUrl('https://espen.codes/projects')) {
  console.log('It is private! Do not run a request against it!')
} else {
  console.log('It is not private! You should be good to go.')
}
```

### Full URLs, with resolve IP and parsed URL

```ts
import {isPrivateUrl} from 'is-private-host'

const {isPrivate, parsedUrl, addresses} = await isPrivateUrl('https://espen.codes/projects', {
  withResolveInfo: true,
})

const ip = addresses[0].address

if (isPrivate) {
  console.log(`It is private! It resolves to ${ip}!`)
} else {
  console.log(`It is not private! Requesting with validated IP (${ip})`)

  // Already an `URL` instance, but cloning to prevent mutation of parsed
  const newUrl = new URL(parsedUrl)

  // Reassign hostname keeping rest of URL intact (protocol, port, path…)
  newUrl.hostname = ip

  // Send to the resolved IP, but keep the original host header
  await fetch(newUrl, {headers: {host: parsedUrl.host}})
}
```

### Checking specific IP

```ts
import {isPrivateIP} from 'is-private-host'

isPrivateIP('127.0.0.1') // `true`
isPrivateIP('192.168.1.1') // `true`
isPrivateIP('8.8.8.8') // `false`
isPrivateIP('foobar') // throws Error, not an IP
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
