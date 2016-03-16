interface Power {
  name: string,
  strength: number
}

export interface Super {
  _id: string;
  name: string;
  power: Power;
  alias?: string;
}