import {
  SearchParams,
  SearchResult,
} from '../../searchable-repositories-contract'

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.4, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ]

      params.forEach(({ page, expected }) => {
        expect(new SearchParams({ page: page }).page).toBe(expected)
      })
    })

    it('perPage prop', () => {
      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.4, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 2, expected: 2 },
        { perPage: 25, expected: 25 },
      ]

      params.forEach(({ perPage, expected }) => {
        expect(new SearchParams({ perPage: perPage }).perPage).toBe(expected)
      })
    })

    it('sort prop', () => {
      const sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 5.4, expected: '5.4' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 25, expected: '25' },
      ]

      params.forEach(({ sort, expected }) => {
        expect(new SearchParams({ sort: sort }).sort).toBe(expected)
      })
    })

    it('sortDir prop', () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null as any, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: -1, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: true, expected: 'desc' },
        { sortDir: false, expected: 'desc' },
        { sortDir: 'DESC', expected: 'desc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'ASc', expected: 'asc' },
      ]

      params.forEach(({ sortDir, expected }) => {
        expect(
          new SearchParams({ sort: 'field', sortDir: sortDir }).sortDir,
        ).toBe(expected)
      })
    })

    it('filter prop', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '', expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 5.4, expected: '5.4' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ]

      params.forEach(({ filter, expected }) => {
        expect(new SearchParams({ filter: filter }).filter).toBe(expected)
      })
    })
  })

  describe('SearchResult unit tests', () => {
    it('Constructor props', () => {
      let sut = new SearchResult({
        items: ['item1', 'item2', 'item3', 'item4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      })

      expect(sut.toJSON()).toStrictEqual({
        items: ['item1', 'item2', 'item3', 'item4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      })

      sut = new SearchResult({
        items: ['item1', 'item2', 'item3', 'item4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'teste',
      })

      expect(sut.toJSON()).toStrictEqual({
        items: ['item1', 'item2', 'item3', 'item4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'teste',
      })

      sut = new SearchResult({
        items: ['item1', 'item2', 'item3', 'item4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'teste',
      })

      expect(sut.lastPage).toBe(1)

      sut = new SearchResult({
        items: ['item1', 'item2', 'item3', 'item4'] as any,
        total: 54,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'teste',
      })

      expect(sut.lastPage).toBe(6)
    })
  })
})
