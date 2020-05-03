# cidr-deny-allow-transformer
This is a NPM library that allows you to transform a subset of denied CIDRs within a larger CIDR
into a list of allowed CIDRs.

## Less talk, more library
`npm install cidr-deny-allow-transformer`

Keep track of the versions with the [changelog](https://github.com/Obirah/cidr-deny-allow-transformer/blob/master/CHANGELOG.md).

## Motivation
If you're deploying infrastructure-as-code to AWS, you come across SecurityGroups with their
corresponding ingress configuration. SecurityGroups can only be configured to allow but not to deny
certain traffic.

In reality, you often want to deny certain CIDRs (e.g. those containing IPs of gateways that are
exposed to the internet) while you want to allow the rest of a larger CIDR (e.g. you company network).

With this small library you can do exactly that - pass a CIDR and a subset of denied CIDRs and 
you'll get all allowed CIDRs.

I recommend using this library, if you're using the [AWS-CDK](https://github.com/aws/aws-cdk) and are
dealing with SecurityGroups.

## Usage
Import the transformer...
```
import { CidrDenyAllowTransformer } from 'cidr-deny-allow-transformer';
```

... and find your allowed CIRDs:
```
const allowedCidrs = CidrDenyAllowTransformer.findAllowedCidrs('192.160.0.0/12', '192.162.0.0/18', '192.172.0.0/23', '192.172.56.0/21');
```
