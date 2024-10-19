import { BcryptHashProvider } from '../../bcrypt-hash.provider'

describe('BcryptHashProvider Unit Tests', () => {
  let sut: BcryptHashProvider

  beforeEach(() => {
    sut = new BcryptHashProvider()
  })

  it('Should return encrypted password', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    expect(hash).toBeDefined()
  })

  it('Should return false on invalid password and hash compare', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)

    const result = await sut.compareHash('InvalidPassword', hash)

    expect(result).toBeFalsy()
  })

  it('Should return true on invalid password and hash compare', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)

    const result = await sut.compareHash(password, hash)

    expect(result).toBeTruthy()
  })
})
