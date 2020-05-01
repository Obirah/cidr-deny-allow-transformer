import { NumberInterval } from '../src/number-interval'

describe('NumberInterval', () => {
  const testInterval = new NumberInterval(7, 29)

  it('should return true if a value is contained in the interval', () => {
    expect(testInterval.containsValue(11)).toEqual(true)
  })

  it('should return false if a value is not contained in the interval - lower than start', () => {
    expect(testInterval.containsValue(3)).toEqual(false)
  })

  it('should return false if a value is not contained in the interval - greater than end', () => {
    expect(testInterval.containsValue(37)).toEqual(false)
  })

  it('should return true if another interval is contained in the interval', () => {
    expect(testInterval.contains(new NumberInterval(11, 23))).toEqual(true)
  })

  it('should return false if another interval is not contained in the interval - lower bound lower than start ', () => {
    expect(testInterval.contains(new NumberInterval(5, 23))).toEqual(false)
  })

  it('should return false if another interval is not contained in the interval - upper bound greater than end ', () => {
    expect(testInterval.contains(new NumberInterval(11, 37))).toEqual(false)
  })

  it('should return an empty array if the interval is contained in the interval to be subtracted', () => {
    expect(testInterval.minus(new NumberInterval(5, 33))).toEqual([])
  })

  it('should return the back portion of the interval if subtracting the front portion', () => {
    expect(testInterval.minus(new NumberInterval(7, 19))).toEqual([new NumberInterval(20, 29)])
  })

  it('should return the front portion of the interval if subtracting the back portion', () => {
    expect(testInterval.minus(new NumberInterval(20, 29))).toEqual([new NumberInterval(7, 19)])
  })

  it('should return the back portion of the interval if subtracting an interval overlapping in the front', () => {
    expect(testInterval.minus(new NumberInterval(5, 11))).toEqual([new NumberInterval(12, 29)])
  })

  it('should return the two enclosing intervals when subtracting an interval that splits the interval', () => {
    expect(testInterval.minus(new NumberInterval(17, 23))).toEqual([
      new NumberInterval(7, 16),
      new NumberInterval(24, 29)
    ])
  })

  it('should return the front portion of the interval if subtracting an interval overlapping in the back', () => {
    expect(testInterval.minus(new NumberInterval(11, 33))).toEqual([new NumberInterval(7, 10)])
  })

  it('should return the interval if subtracting an interval that is completely in front of the interval', () => {
    expect(testInterval.minus(new NumberInterval(1, 3))).toEqual([testInterval])
  })

  it('should return the interval if subtracting an interval that is completely behind the interval', () => {
    expect(testInterval.minus(new NumberInterval(101, 111))).toEqual([testInterval])
  })
})
