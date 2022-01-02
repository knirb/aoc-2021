const fs = require("fs");

const message = fs.readFileSync(`${__dirname}/operation.txt`, "utf-8", (err, data) => data);

//Packet info:
//0-2 : Version
//2-5 : Type ID

//Type ID === 4 means:  encodes a 4-bit binary number, with a leading 1 bit
//The last binary number does not have a leading 1-bit
//5-end has length % 5 unecessary bits

//Type ID !== 4 means: operation
//Followed by a length type ID bit:
// - 0 means next 15 bits show the length (in bits) of the subpackets contained in the packet
// - 1 means next 11 bits show the number of subpackets contained by this packet

//Following the operation is the subpackets

class Packet {
  version;
  type;
  value;
  subpackets = [];

  constructor(version, type) {
    this.version = version;
    this.type = type;
  }

  getType() {
    return this.type === 4 ? "VALUE" : "OPERATION";
  }
  getTypeNumerical() {
    return this.type;
  }

  setValue(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  addSubpacket(packet) {
    this.subpackets.push(packet);
  }

  getSubpackets() {
    return this.subpackets;
  }

  hasSubpackets() {
    return this.subpackets.length > 0;
  }
}

class Parser {
  static hexMap = {
    0: "0000",
    1: "0001",
    2: "0010",
    3: "0011",
    4: "0100",
    5: "0101",
    6: "0110",
    7: "0111",
    8: "1000",
    9: "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };

  static parseHexToBin(hex) {
    let res = "";
    for (let i = 0; i < hex.length; i++) {
      res += this.hexMap[hex[i]];
    }
    return res;
  }
  static decodePackets(string) {
    let packets = [];
    let offset = 0;

    const version = parseInt(string.slice(0 + offset, 3 + offset), 2);
    const type = parseInt(string.slice(3 + offset, 6 + offset), 2);
    const packet = new Packet(version, type);
    if (packet.getType() === "VALUE") {
      const value = this.parseLiteralValue(string.slice(offset + 6, string.length));
      packet.setValue(value);
    } else {
      const subPackets = this.parseOperation(string.slice(offset + 6, string.length));
      subPackets.forEach((subpacket) => packet.addSubpacket(subpacket));
    }
    packets.push(packet);
    return packets;
  }

  static parseLiteralValue(string) {
    let offset = 0;
    let reachedEnd = false;
    let bits = "";
    while (!reachedEnd && offset < string.length) {
      const prefix = string.slice(0 + offset, 1 + offset);
      const nr = string.slice(1 + offset, 5 + offset);
      bits += nr;
      offset += 5;
      if (prefix === "0") {
        reachedEnd = true;
      }
    }
    return bits;
  }

  static parseOperation(string) {
    const lengthTypeId = parseInt(string[0]);
    console.log(lengthTypeId);
    if (lengthTypeId) {
      const noPackets = parseInt(string.slice(1, 12), 2);
      return [noPackets];
    } else {
      const subpacketsLength = parseInt(string.slice(1, 16), 2);
      return [subpacketsLength];
    }
  }
}

const binary = Parser.parseHexToBin(message);
const decoded = Parser.decodePackets(binary);
console.log(decoded);
