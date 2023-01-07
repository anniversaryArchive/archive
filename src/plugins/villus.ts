import { createClient } from 'villus';

const host: string = 'http://localhost:3000/graphql';

const client = createClient({
  url: host,
});

export default client;
