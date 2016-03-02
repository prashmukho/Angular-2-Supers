import {Villain} from '../app/villains/villain';

describe('villain object', () => {
  beforeEach(() => this.villain = new Villain(1, 'Magneto', 'Magnetism', 'Max Eisenhardt'));

  it('has the id given to the constructor', () => {
    expect(this.villain.id).toEqual(1);
  });

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