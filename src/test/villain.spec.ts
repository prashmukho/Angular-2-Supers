describe('villain object', () => {
  beforeEach(() => {
    // TODO: getVillain(<some id>) after testing  VillainService
    this.villain = { name: 'Magneto', power: 'Magnetism', alias: 'Max Eisenhardt' }
  });

  // TODO: get a record from the DB for testing

  // TODO: add _id check

  // these are trivial for now
  it('has the name given to its constructor', () => {
    expect(this.villain.name).toEqual('Magneto');
  });
  
  it('has the power given in the constructor', () => {
    expect(this.villain.power).toEqual('Magnetism');
  });

  it('has the alias given to its constructor', () => {
    expect(this.villain.alias).toEqual('Max Eisenhardt');
  });
})