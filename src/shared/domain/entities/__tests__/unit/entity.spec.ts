import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 2 }

    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity._id).not.toBeNull()
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('Should accept a valid uuid', () => {
    const props = { prop1: 'value1', prop2: 2 }
    const id = '3803b5ac-b2f3-4302-b87c-18bf57e5b18f'
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity._id)).toBeTruthy()
    expect(entity._id).toBe(id)
  })

  it('Should convert a entity to a Javascript Object', () => {
    const props = { prop1: 'value1', prop2: 2 }
    const id = '3803b5ac-b2f3-4302-b87c-18bf57e5b18f'
    const entity = new StubEntity(props, id)

    expect(entity.toJson()).toStrictEqual({ id, ...props })
  })
})
