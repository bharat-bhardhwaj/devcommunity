import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfilebyId } from '../../actions/profile';

const Profile = ({ getProfilebyId, profile: { profile, loading },auth, match }) => {
  useEffect(() => {
    getProfilebyId(match.params.id);
  }, [getProfilebyId]);


  return <div>profile</div>;
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
