import { cidr, ip } from 'node-cidr/dist'
import { NumberInterval } from './number-interval'

export class CidrAllowDenyTransformer {
  static findAllowedCidrs(fullCidr: string, ...denyCidrs: string[]): string[] {
    const fullInterval = CidrAllowDenyTransformer.cidrToInterval(fullCidr)
    const deniedIntervals = denyCidrs.map(deniedCidr =>
      CidrAllowDenyTransformer.cidrToInterval(deniedCidr)
    )

    const allowedIntervals = deniedIntervals.reduce(
      (currentIntervals, deny) =>
        ([] as NumberInterval[]).concat(
          ...currentIntervals.map(currentInterval => currentInterval.minus(deny))
        ),
      [fullInterval]
    )

    return ([] as string[]).concat(
      ...allowedIntervals.map(interval =>
        CidrAllowDenyTransformer.ipRangeToCidrs(
          ip.toString(interval.start),
          ip.toString(interval.end)
        )
      )
    )
  }

  private static cidrToInterval(cidrStr: string): NumberInterval {
    const range = cidr.toIntRange(cidrStr)
    return new NumberInterval(range[0], range[1])
  }

  private static bytesToInt32(bytes: number[]): number {
    return ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]
  }

  private static int32ToBytes(int32: number): number[] {
    return [
      (int32 >>> 24) & 0xff,
      (int32 >>> 16) & 0xff,
      (int32 >>> 8) & 0xff,
      (int32 >>> 0) & 0xff
    ]
  }

  private static ipToIp32(ipAddress: string): number | undefined {
    const matches = ipAddress.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
    if (matches) {
      const ipBytes = []
      for (let index = 1; index < matches.length; index++) {
        const ipByte = Number(matches[index])
        if (ipByte >= 0 && ipByte <= 255) {
          ipBytes.push(ipByte)
        }
      }
      if (ipBytes.length === 4) {
        return CidrAllowDenyTransformer.bytesToInt32(ipBytes)
      }
    }
    return undefined
  }

  private static ip32ToIp(ip32: number): string | undefined {
    return isFinite(ip32)
      ? CidrAllowDenyTransformer.int32ToBytes(ip32 & 0xffffffff).join('.')
      : undefined
  }

  private static maxBlock(ip32: number): number {
    let block = 32
    while (block > 0) {
      if ((ip32 >>> (32 - block)) & 0x00000001) {
        break
      } else {
        block--
      }
    }
    return block
  }

  private static ipRangeToCidrs(firstIp: string, lastIp: string): string[] {
    let firstIp32 = CidrAllowDenyTransformer.ipToIp32(firstIp)
    const lastIp32 = CidrAllowDenyTransformer.ipToIp32(lastIp)

    const cidrs = []
    if (firstIp32 && lastIp32 && firstIp32 <= lastIp32) {
      while (lastIp32 >= firstIp32) {
        const maxSize = CidrAllowDenyTransformer.maxBlock(firstIp32)
        const maxDiff = 32 - Math.floor(Math.log(lastIp32 - firstIp32 + 1) / Math.log(2))
        const size = Math.max(maxSize, maxDiff)
        cidrs.push(CidrAllowDenyTransformer.ip32ToIp(firstIp32) + '/' + size)
        firstIp32 += Math.pow(2, 32 - size)
      }
    }
    return cidrs
  }
}
