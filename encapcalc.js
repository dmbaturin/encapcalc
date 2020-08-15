// Copyright (c) 2020 Daniil Baturin and others
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Base protocols that get auto-generated buttons
var baseProtocols = {
  "Ethernet": 14,
  "PPPoE": 8,
  "IPv4": 20,
  "IPv6": 40,
  "UDP": 8,
  "TCP": 20,
  "MPLS": 4,
  "L2TPv3": 8,
  "GRE": 4,
  "LISP": 16,
  "VXLAN": 16,
  "NVGRE": 8,
  "STT": 38,
  "WireGuard": 40,
};

// These are additional options
var virtualProtocols = {
  "GRE-key": 4,
  "GRE-sequence-number": 4,
  "Ethernet-VLAN": 4,
  "Ethernet-QinQ": 4,
  "Ethernet-MACSec": 32
};

// "Composite" protocol shortcuts
var protocolShortcuts = {
  "EoIP": ["IPv4", "GRE", "Ethernet"],
  "IPIP": ["IPv4", "IPv4"],
  "SIT (6in4)": ["IPv4", "IPv6"],
  "IP6IP6": ["IPv6", "IPv6"]
};

// Forms with options for specific protocols
protocolOptions = {
  "GRE": "<div><input type='checkbox' onchange='calculateOverhead()' class='protocol-item-GRE-key'> Key (4 bytes)</div>" +
         "<div><input type='checkbox' onchange='calculateOverhead()' class='protocol-item-GRE-sequence-number'> Sequence numbers (4 bytes)</div>",
  "Ethernet": "<div><input type='checkbox' onchange='calculateOverhead()' class='protocol-item-Ethernet-VLAN'>802.1q VLAN (4 bytes)</div>" +
              "<div><input type='checkbox' onchange='calculateOverhead()' class='protocol-item-Ethernet-QinQ'>802.1ad QinQ (4 bytes)</div>" +
              "<div><input type='checkbox' onchange='calculateOverhead()' class='protocol-item-Ethernet-MACSec'>MACSec (32 bytes)</div>"
};

function calculateOverhead() {
    var mtu = document.querySelector("#parent-mtu").value;
    var protocols = document.querySelectorAll("*[class^='protocol-item-']");
    var overhead = 0;

    for(var i = 0; i < protocols.length; i++) {
        var p = protocols[i];
        if(p.tagName.toLowerCase() == "input") {
            if(!p.checked) { continue; }
        }

       protocolName = protocols[i].className.replace(/^protocol-item-/, '');
       overhead += window.protocolData[protocolName];
    }

    var mode = document.ifaceoptions.mode.value;
    if(mode == "sub") {
        pdu = Number(mtu) - Number(overhead);
    } else {
        pdu = Number(mtu) + Number(overhead);
    }

    document.querySelector("#overhead").innerHTML = overhead + " bytes";
    document.querySelector("#tunnel-mtu").innerHTML = pdu + " bytes";
}

// Since all UI changes require re-calculating the values,
// we wrap all events in a handler that forces re-calculation.
function handleEvent(e, f) {
    f(e);
    calculateOverhead();
}

function generateProtocolButtons() {
    var protocolList = document.querySelector("#protocol-list");

    // Add base protocols
    for(protocolName in baseProtocols) {
        var button = document.createElement("input");
        button.setAttribute('type', 'button');
        button.setAttribute('value', protocolName);
        button.setAttribute('class', 'protocol-button');
        button.addEventListener("click", function (e) {
            handleEvent(e, function () {addProtocol(e.target.value)})});

        protocolList.appendChild(button);
    }

    // Add shortcuts for complex protocols
    for(ps in protocolShortcuts) {
        var button = document.createElement("input");
        button.setAttribute('type', 'button');
        button.setAttribute('value', ps);
        button.setAttribute('class', 'protocol-button');
        button.addEventListener("click", function (e) {
            handleEvent(e, function () {addProtocols(e.target.value)})});

        protocolList.appendChild(button);
    }
}

function addProtocol(name) {
    protocols = document.querySelector('#protocols');

    protocolWrapper = document.createElement('div');
    protocolWrapper.setAttribute('class', 'protocol-block-wrapper');
    protocolWrapper.setAttribute('id', window.serial);

    protocol = document.createElement('div');
    protocol.setAttribute('class', 'protocol-block');

    protocolWrapper.appendChild(protocol);

    content = "<div class='protocol-text'> <span class='protocol-item-" + name + "'>" + name + "</span> (" +
             window.protocolData[name] + " bytes) </div>";
    content += "<div class='remove-button'> <input type='button' value='Remove'/> </div>";

    protocol.innerHTML = "<div class='protocol-options'>" + content + "</div>";

    if(protocolOptions[name]) {
        optionsForm = document.createElement("div");
        optionsForm.innerHTML = protocolOptions[name];
        protocol.appendChild(optionsForm);
    }

    var serial = window.serial; // Force lexical scoping
          protocol.querySelector("div.remove-button input").addEventListener("click", function (e) {
              handleEvent(e, function () {removeElement(serial)})});

    protocols.appendChild(protocolWrapper);
    window.serial += 1;
}

function addProtocols(name) {
    var protos = window.protocolShortcuts[name];
    protos.forEach(addProtocol);
}

function removeElement(id) {
    element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

function setModeFrameSize() {
    document.querySelector("#mtu-desc").innerHTML = "Payload size: ";
    document.querySelector("#result-desc").innerHTML = "Frame size: "
}

function setModePDU() {
    document.querySelector("#mtu-desc").innerHTML = "Parent interface MTU: ";
    document.querySelector("#result-desc").innerHTML = "Maximum PDU size: ";
}

function mergeObjects(l, r) {
    for (var key in r){
        if(r.hasOwnProperty(key)) {
            l[key] = r[key];
        }
    }
   return l;
}

// UI setup
document.addEventListener("DOMContentLoaded", function () {
    // Dirty hack to ensure protocol block id uniqueness
    // Incremented every time when user adds a protocol
    // Other solutions would be dependent on the protocol block layout
    window.serial = 0;

    generateProtocolButtons();
    document.querySelector("#parent-mtu").addEventListener("input", calculateOverhead);
    document.querySelector("#mode-pdu").addEventListener("change", function (e) {handleEvent(e, setModePDU)});
    document.querySelector("#mode-frame-size").addEventListener("change", function (e) {handleEvent(e, setModeFrameSize)});

    window.protocolData = mergeObjects(baseProtocols, virtualProtocols);
    window.protocolShortcuts = protocolShortcuts;

    calculateOverhead();
});
