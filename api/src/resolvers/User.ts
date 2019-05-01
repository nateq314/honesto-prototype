import { CombinedUserDB } from '../schema';

export default {
  id: ({ uid }: CombinedUserDB) => {
    console.log('RESOLVER User.id');
    return uid;
  },
};
