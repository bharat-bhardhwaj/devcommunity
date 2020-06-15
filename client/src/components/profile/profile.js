import React, { Fragment, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfilebyId } from '../../actions/profile';

const Profile = ({ getProfilebyId, profile: { profile, loading },auth, match }) => {
  useEffect(() => {
    getProfilebyId(match.params.id);
    
  }, [getProfilebyId,match.params.id]);


  return <Fragment>
      {profile === null || loading ? <Spinner/> :
      <Fragment>
          <Link to='/profiles' className='btn btn-light'>
              Back to profiles
          </Link>
          {auth.isAuthenticated && auth.loading ===false && auth.user._id=== profile.user._id &&(
          <Link to='/edit-profile' className='btn btn-dark'>
              Edit profile
          </Link>)}
    </Fragment>}
  </Fragment>;
};

Profile.propTypes = {
  getProfilebyId: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfilebyId })(Profile);
