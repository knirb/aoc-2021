const fs = require("fs");

const message = fs.readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data);

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
  literalValue;
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

  setLiteralValue(value) {
    this.literalValue = value;
  }

  getValue() {
    switch (this.type) {
      case 0:
        let sum = 0;
        this.subpackets.forEach((packet) => (sum += packet.getValue()));
        return sum;
      case 1:
        let prod = 1;
        this.subpackets.forEach((packet) => (prod *= packet.getValue()));
        return prod;
      case 2:
        const minValues = [];
        this.subpackets.forEach((packet) => minValues.push(packet.getValue()));
        return Math.min(...minValues);
      case 3:
        const maxValues = [];
        this.subpackets.forEach((packet) => maxValues.push(packet.getValue()));
        return Math.max(...maxValues);
      case 4:
        return parseInt(this.value, 2);
      case 5:
        return this.subpackets[0].getValue() > this.subpackets[1].getValue() ? 1 : 0;
      case 6:
        return this.subpackets[0].getValue() < this.subpackets[1].getValue() ? 1 : 0;
      case 7:
        return this.subpackets[0].getValue() === this.subpackets[1].getValue() ? 1 : 0;
      default:
        break;
    }
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

  getSummedVersions() {
    let summedVersions = this.version;
    this.subpackets.forEach((packet) => (summedVersions += packet.getSummedVersions()));
    return summedVersions;
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

  static parsePackets(string) {
    let packets = [];
    let offset = 0;
    while (offset < string.length - 1) {
      const [packet, length] = this.parseOnePacket(string.slice(offset, string.length));
      if (!packet || !length) break;
      offset += length;
      packets.push(packet);
    }
    return packets;
  }

  static parseLiteralValue(string) {
    let offset = 0;
    let reachedEnd = false;
    let bits = "";

    while (!reachedEnd) {
      const prefix = string.slice(0 + offset, 1 + offset);
      const nr = string.slice(1 + offset, 5 + offset);
      bits += nr;
      offset += 5;
      if (prefix === "0") {
        reachedEnd = true;
      }
    }
    return [bits, offset];
  }

  static parseOperation(string) {
    const lengthTypeId = parseInt(string[0]);
    if (lengthTypeId) {
      const noPackets = parseInt(string.slice(1, 12), 2);
      const [packets, subpacketsLength] = this.parseNPackets(string.slice(12, string.length), noPackets);
      return [packets, subpacketsLength + 12];
    } else {
      const subpacketsLength = parseInt(string.slice(1, 16), 2);
      const packets = this.parsePackets(string.slice(16, 16 + subpacketsLength));
      return [packets, subpacketsLength + 16];
    }
  }

  static parseNPackets(string, n) {
    const packets = [];
    let offset = 0;
    for (let i = 0; i < n; i++) {
      const [packet, length] = this.parseOnePacket(string.slice(offset, string.length));
      packets.push(packet);
      offset += length;
    }
    return [packets, offset];
  }

  static parseOnePacket(string) {
    try {
      const version = parseInt(string.slice(0, 3), 2);
      const type = parseInt(string.slice(3, 6), 2);
      const packet = new Packet(version, type);
      let offset = 6;
      if (packet.getType() === "VALUE") {
        const [value, length] = this.parseLiteralValue(string.slice(6, string.length));
        packet.setValue(value, 2);
        packet.setLiteralValue(parseInt(value, 2));
        return [packet, offset + length];
      } else {
        const [subPackets, length] = this.parseOperation(string.slice(6, string.length));
        subPackets.forEach((subpacket) => packet.addSubpacket(subpacket));
        return [packet, offset + length];
      }
    } catch (e) {
      return [null, null];
    }
  }
}

const binary = Parser.parseHexToBin(message);
const decoded = Parser.parsePackets(binary);

console.log("Part 1: ", decoded[0].getSummedVersions());
console.log("Part 2: ", decoded[0].getValue());
