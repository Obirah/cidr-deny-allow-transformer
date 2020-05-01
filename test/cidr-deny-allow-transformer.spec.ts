import { CidrDenyAllowTransformer } from '../src/cidr-deny-allow-transformer'

describe('CidrDenyAllowTransformer', () => {
  const fullCidr = '192.160.0.0/12'
  const deniedCidrsWithinRange = ['192.162.0.0/18', '192.172.0.0/23', '192.172.56.0/21']
  const deniedCidrsOutsideOfRange = ['192.150.0.0/18', '192.176.0.0/23', '192.176.42.0/21']
  const expectedAllowedCidrs = [
    '192.160.0.0/15',
    '192.162.64.0/18',
    '192.162.128.0/17',
    '192.163.0.0/16',
    '192.164.0.0/14',
    '192.168.0.0/14',
    '192.172.2.0/23',
    '192.172.4.0/22',
    '192.172.8.0/21',
    '192.172.16.0/20',
    '192.172.32.0/20',
    '192.172.48.0/21',
    '192.172.64.0/18',
    '192.172.128.0/17',
    '192.173.0.0/16',
    '192.174.0.0/15'
  ]

  it('should calculate the allowed CIDRs correctly', () => {
    const allowedCidrs = CidrDenyAllowTransformer.findAllowedCidrs(
      fullCidr,
      ...deniedCidrsWithinRange
    )
    expect(allowedCidrs).toEqual(expectedAllowedCidrs)
  })

  it('should not change the CIDRs when a completely different full range is specified', () => {
    const allowedCidrs = CidrDenyAllowTransformer.findAllowedCidrs(
      fullCidr,
      ...deniedCidrsOutsideOfRange
    )
    expect(allowedCidrs).toEqual([fullCidr])
  })
})
