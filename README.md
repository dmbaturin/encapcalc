encapcalc
=========

An visual tunnel MTU/MSS calculator in pure client-side HTML/JS.

Tunnel MTU/MSS calculation is a common task.
Calculating it is a common task, and many beginners find it confusing.
This project tries to make it easy to do and understand what's going on.

To run it locally, just clone the repo and point your browser to the index.html file.

A live version is available at https://baturin.org/tools/encapcalc/

## Data sources

* GRE: [RFC2784](https://tools.ietf.org/html/rfc2784)
* GRE keys and sequence numbers: [RFC2890](https://tools.ietf.org/html/rfc2890)
* NVGRE: [RFC7637](https://tools.ietf.org/html/rfc7637) (it's really just GRE with the key field reused for virtual network ID)
* VXLAN: [RFC7348](https://tools.ietf.org/html/rfc7348)
* STT: [RFC draft](https://tools.ietf.org/html/draft-davie-stt-01)
* MACSec: "an additional 16-byte MACsec Security Tag or SecTAG was included, as well as a 16-byte Integrity Check Value (ICV) at the end of the frame" ([1](https://www.cisco.com/c/en/us/products/collateral/ios-nx-os-software/identity-based-networking-services/white-paper-c11-737544.html))
* LISP: [RFC6830](https://tools.ietf.org/html/rfc6830)
* EoIP: https://help.mikrotik.com/docs/pages/viewpage.action?pageId=24805521
