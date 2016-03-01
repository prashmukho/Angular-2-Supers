import {Villain} from '../app/villains/villain';

describe('villain object', () => {
  beforeEach(() => this.villain = new Villain(1, 'Magneto', 'Magnetism'));

  it('has the id given to the constructor', () => {
    expect(this.villain.id).toEqual(1);
  });

  it('has the name given to its constructor', () => {
    expect(this.villain.name).toEqual('Magneto');
  });
  
  it('has the id given in the constructor', () => {
    expect(this.villain.power).toEqual('Magnetism');
  });
})