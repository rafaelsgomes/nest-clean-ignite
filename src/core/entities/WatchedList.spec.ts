import { WatchedList } from './WatchedList'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

let list: NumberWatchedList

describe('watched list', () => {
  beforeEach(() => {
    list = new NumberWatchedList([1, 2, 3])
  })
  it('should be able to create a watched list with inital items', () => {
    expect(list.currentItems).toHaveLength(3)
  })

  it('should be able to add new item to the list', () => {
    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to remove item from the list', () => {
    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should be able to add a new item even if it was removed before', () => {
    list.remove(2)
    list.add(2)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was added before', () => {
    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    list.update([1, 3, 5])

    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })
})
