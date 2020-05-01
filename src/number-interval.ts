export class NumberInterval {
  constructor(readonly start: number, readonly end: number) {}

  containsValue(value: number): boolean {
    return this.start <= value && this.end >= value
  }

  contains(other: NumberInterval): boolean {
    return this.containsValue(other.start) && this.containsValue(other.end)
  }

  minus(other: NumberInterval): NumberInterval[] {
    if (other.contains(this)) {
      return []
    } else if (this.start === other.start && this.end > other.end) {
      // ssss
      // oo
      return [new NumberInterval(other.end + 1, this.end)]
    } else if (this.end === other.end && this.start < other.start) {
      // ssss
      //   oo
      return [new NumberInterval(this.start, other.start - 1)]
    } else if (other.start < this.start && other.end < this.end) {
      //  ssss
      // oo
      return [new NumberInterval(Math.max(other.end + 1, this.start), this.end)]
    } else if (this.start < other.start && this.end > other.end) {
      // ssss
      //  oo
      return [
        new NumberInterval(this.start, other.start - 1),
        new NumberInterval(other.end + 1, this.end)
      ]
    } else if (other.start > this.start && other.end > this.end) {
      // ssss
      //    oo
      return [new NumberInterval(this.start, Math.min(this.end, other.start - 1))]
    } else {
      //      ss
      // oooo
      return [this]
    }
  }
}
