import User from '../../database/User';
import throwIf from '../../../utils/throw-if';

export async function GET({ user: { _id } }) {
  const user = await User.findById(_id, 'name feedback');

  throwIf(!user, new Error('User not found'));

  return user;
}

GET.secured = true;
