# cidr-deny-allow-transformer
NPM library that can be used to to transform a list of denied IPs within a CIDR into an allow list.

## Motivation
If you're deploying infrastructure-as-code to AWS, you come across SecurityGroups with their
corresponding ingress configuration. SecurityGroups can only be configured to allow but not to deny certain
traffic.

In reality, you often want to deny a certain set of IPs (e.g. IPs of gateways that are exposed to
the internet) while you want to allow the rest of IPs within a CIDR (e.g. you company network).

With this small library you can do exactly that - pass a CIDR and a set of denied IPs and you'll get
all allowed CIDRs.

I recommend using this library, if you're using the [AWS-CDK](https://github.com/aws/aws-cdk) and are
dealing with SecurityGroups.   
