/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserByUsername } from '../../services/firebase';
import { useState, useEffect } from 'react';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function Header({ username }) {
  const [user, setUser] = useState([])
  useEffect(() => {
    async function getPostUser() {
      const res = await getUserByUsername(username);
     setUser(res[0])
    }
    getPostUser();
  }, [username]);
  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={user.avatarSrc?user.avatarSrc:DEFAULT_IMAGE_PATH}
            alt={`${username} profile picture`}
          />
          <p className="font-bold">{username}</p>
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired
};