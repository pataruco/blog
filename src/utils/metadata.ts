import { Person, Thing } from 'schema-dts';

export const author: Person = {
  '@type': 'Person',
  name: 'Pedro Martin Valera',
};

export const about: Thing =
  'My thoughts about building, teaching and leading product tech teams';

export const BASE_URL = 'https://www.pataruco.dev';
