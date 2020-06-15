import axios from 'axios';

import {setAlert} from './alert'

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    
    GET_PROFILES,
    GET_REPOS
} from './types'


//get current user profiles

export const getCurrentProfile =()=> async dispatch =>{
    try {
        const res =await axios.get('/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//get all profiles
export const getProfiles =()=> async dispatch =>{
    dispatch({type:CLEAR_PROFILE});

    try {
        const res =await axios.get('/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//get profile by id
export const getProfilebyId =userID=> async dispatch =>{
    

    try {
        const res =await axios.get(`/api/profile/user/${userID}`);
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
};


//get github repos

export const getGithiubRepos =username=> async dispatch =>{
    

    try {
        const res =await axios.get(`/api/profile/githib/${username}`);
        dispatch({
            type:GET_REPOS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
};



//create or update profile

export const createProfile =(formData,history,edit=false) => async dispatch =>{
    try {

        const config= {
            headers:{
                'Content-Type':'application/json'
            }
        }

        const res =await axios.post('/api/profile',formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert(edit ? 'profile Updated':'profile Created','success'));

        if(!edit){
            history.push('/dashboard');

        }
        
    } catch (err) {

        const errors=err.response.data.errors;
        
        if(errors){
            errors.forEach(error=> dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}


//ADD EXPERIENCE    

export const addExperience =(FormData,history)=> async dispatch=>{
    try {

        const config= {
            headers:{
                'Content-Type':'application/json'
            }
        }

        const res =await axios.put('/api/profile/experience',FormData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Experience added','success'));

        
            history.push('/dashboard');

        
        
    } catch (err) {

        const errors=err.response.data.errors;
        
        if(errors){
            errors.forEach(error=> dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//Add education
export const addEducation =(FormData,history)=> async dispatch=>{
    try {

        const config= {
            headers:{
                'Content-Type':'application/json'
            }
        }

        const res =await axios.put('/api/profile/education',FormData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });

        dispatch(setAlert('Education added','success'));

        
            history.push('/dashboard');

        
        
    } catch (err) {

        const errors=err.response.data.errors;
        
        if(errors){
            errors.forEach(error=> dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}


/// Delete Expereince
export const deleteExperience =id =>async dispatch =>{
    try {
        const res =await axios.delete('/api/profile/experience/${id}');
        dispatch({
            type:PROFILE_ERROR,
            payload:res.data
        });

        dispatch(setAlert('Expereience Removed','success'));

    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//Delete education

export const deleteEducation =id =>async dispatch =>{
    try {
        const res =await axios.delete('/api/profile/education/${id}');
        dispatch({
            type:PROFILE_ERROR,
            payload:res.data
        });

        dispatch(setAlert('Education Removed','success'));

    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}


//DELETE ACCOUNT AND PROFILE

export const deleteAccount =() =>async dispatch =>{
    if(window.confirm('Are you sure? This can NOTt be undone!')){

        try {
            const res =await axios.delete('/api/profile');
            dispatch({type:CLEAR_PROFILE});
            dispatch({type:ACCOUNT_DELETED});
    
            dispatch(setAlert('Your account has been permanently deleted'));
    
        } catch (err) {
            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText,status:err.response.status}
            })
        }

    }
    
}