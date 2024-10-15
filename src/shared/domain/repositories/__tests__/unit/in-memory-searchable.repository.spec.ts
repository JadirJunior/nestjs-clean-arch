import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository '

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name', 'price']
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return items

    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 50 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const itemsFiltered = await sut['applyFilter'](items, null)
      expect(itemsFiltered).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'teste', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'Test', price: 50 }),
        new StubEntity({ name: 'fake', price: 50 }),
      ]

      const spyFilterMethod = jest.spyOn(items, 'filter')
      let itemsFiltered = await sut['applyFilter'](items, 'test')
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      itemsFiltered = await sut['applyFilter'](items, 'Test')
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      itemsFiltered = await sut['applyFilter'](items, 'TEST')
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)

      itemsFiltered = await sut['applyFilter'](items, 'TES')
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(4)

      itemsFiltered = await sut['applyFilter'](items, 'no-filter')
      expect(itemsFiltered).toStrictEqual([])
      expect(spyFilterMethod).toHaveBeenCalledTimes(5)
    })
  })
  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
      ]

      let itemsSorted = await sut['applySort'](items, null, null)
      expect(itemsSorted).toStrictEqual(items)

      itemsSorted = await sut['applySort'](items, 'priceees', 'asc')
      expect(itemsSorted).toStrictEqual(items)
    })

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'c', price: 30 }),
      ]

      let itemsSorted = await sut['applySort'](items, 'name', 'asc')
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])

      itemsSorted = await sut['applySort'](items, 'price', 'asc')
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])

      itemsSorted = await sut['applySort'](items, 'name', 'desc')
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])
    })
  })
  describe('applyPaginate method', () => {})
  describe('search method', () => {})
})
