const mockingoose = require('mockingoose');
const Authtoken = require('../../models/authtoken');
const repository = require('../../repositories/authtoken');

describe('authtokenRepository', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test('createAuthToken should create a new authtoken', async () => {
    const token = 'testtoken';
    const expiredata = new Date(new Date().getTime() + 12 * 60 * 60 * 1000); 
    const username = 'testuser';
    const expectedAuthtoken = new Authtoken({ token, expiredata, username });
    mockingoose(Authtoken).toReturn(expectedAuthtoken, 'save');

    const result = await repository.createAuthToken(token, expiredata, username);
    expect(result).toMatchObject(expectedAuthtoken);
  });

  test('findPreviousAuthToken should find previous authtoken for a username', async () => {
    const token = 'testtoken';
    const expiredata = new Date();
    const username = 'testuser';
    const expectedAuthtoken = new Authtoken({ token, expiredata, username });
    mockingoose(Authtoken).toReturn(expectedAuthtoken, 'findOne');

    const result = await repository.findPreviousAuthToken(username);
    expect(result).toMatchObject(expectedAuthtoken);
  });

  test('findAuthTokenByToken should find authtoken by token', async () => {
    const token = 'testtoken';
    const expiredata = new Date();
    const username = 'testuser';
    const expectedAuthtoken = new Authtoken({ token, expiredata, username });
    mockingoose(Authtoken).toReturn(expectedAuthtoken, 'findOne');

    const result = await repository.findAuthTokenByToken(token);
    expect(result).toMatchObject(expectedAuthtoken);
  });

  test('deleteAuthToken should delete authtoken by token', async () => {
    const token = 'testtoken';
    const expectedAuthtoken = new Authtoken({ token });
    mockingoose(Authtoken).toReturn(expectedAuthtoken, 'findOneAndDelete');

    await repository.deleteAuthToken(token);
    const result = await Authtoken.findOne({ token });
    expect(!result).toBe(true);
  });

  test('findAllAuthTokens should return all authtokens', async () => {
    const authtokens = [      { token: 'testtoken1', expiredata: new Date(), username: 'testuser1' },      { token: 'testtoken2', expiredata: new Date(), username: 'testuser2' },    ];
    mockingoose(Authtoken).toReturn(authtokens, 'find');

    const result = await repository.findAllAuthTokens();
    expect(result.length).toBe(authtokens.length);
    expect(result[0]).toMatchObject(authtokens[0]);
    expect(result[1]).toMatchObject(authtokens[1]);
  });
});