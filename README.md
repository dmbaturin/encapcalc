encapcalc
=========

An HTML/JS encapsulation overhead calculator.

Tunnel MTU/MSS calculation is a common task that also
confuses beginners quite often, so let's make it
automated and more visual.

To deploy locally, just copy the index.html to
appropriate location.

See a live demo at http://baturin.org/tools/encapcalc/

## Data sources

* GRE: [RFC2784](https://tools.ietf.org/html/rfc2784)
* GRE keys and sequence numbers: [RFC2890](https://tools.ietf.org/html/rfc2890)
* NVGRE: [RFC7637](https://tools.ietf.org/html/rfc7637) (it's really just GRE with the key field reused for virtual network ID)
* VXLAN: [RFC7348](https://tools.ietf.org/html/rfc7348)
* STT: [RFC draft](https://tools.ietf.org/html/draft-davie-stt-01)
* MACSec: "an additional 16-byte MACsec Security Tag or SecTAG was included, as well as a 16-byte Integrity Check Value (ICV) at the end of the frame" ([1](https://www.cisco.com/c/en/us/products/collateral/ios-nx-os-software/identity-based-networking-services/white-paper-c11-737544.html))
