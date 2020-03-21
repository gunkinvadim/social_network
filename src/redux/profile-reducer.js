import { profileAPI } from '../api/api'

const initialState = {
    isLoading: false,
    profileData: null,
    isStatusLoading: false,
    status: '',
    isMyProfile: false,
    postsData: [
        { id: 1, text: `Hi, how are you?`, likes: 0, liked: false },
        { id: 2, text: `It's my first post!`, likes: 0, liked: false },
        { id: 3, text: `Fuck You!`, likes: 0, liked: false }
    ]
}


const profileReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'ADD_POST':
            let data = state.postsData
            return {
                ...state,
                postsData: [...data, {
                    id: data[data.length - 1].id + 1,
                    text: action.text,
                    likes: 0,
                    liked: false
                }],
                newPostText: ''
            }
        case 'LIKE_POST':
            return {
                ...state,
                postsData: state.postsData.map((item) => {
                    if (item.id === action.id) {
                        return {
                            ...item,
                            likes: !item.liked ? item.likes + 1 : item.likes - 1,
                            liked: !item.liked
                        }
                    } else {
                        return {...item}
                    }
                })
            }
        case 'SET_PROFILE':
            return {
                ...state,
                profileData: {...action.profileData},
            }
        case 'SET_STATUS':
            return {
                ...state,
                status: action.status
            }
        case 'TOGGLE_STATUS_LOADING':
            return {
                ...state,
                isStatusLoading: action.isStatusLoading
            }
        case 'TOGGLE_IS_MY_PROFILE':
            return {
                ...state,
                isMyProfile: action.isMyProfile
            }
        case 'TOGGLE_PROFILE_LOADING':
            return {
                ...state,
                isLoading: action.isLoading
            }
        default:
            return state
    }
}


// ActionCreators


export const addPost = (text) => ({
    type: 'ADD_POST',
    text
})
export const likePost = (id) => ({
    type: 'LIKE_POST',
    id
})
export const setProfile = (profileData) => ({
    type: 'SET_PROFILE',
    profileData
})
export const setStatus = (status) => ({
    type: 'SET_STATUS',
    status
})
export const toggleStatusLoading = (isStatusLoading) => ({
    type: 'TOGGLE_STATUS_LOADING',
    isStatusLoading
})
export const toggleIsMyProfile = (isMyProfile) => ({
    type: 'TOGGLE_IS_MY_PROFILE',
    isMyProfile
})
export const toggleLoading = (isLoading) => ({ type: 'TOGGLE_PROFILE_LOADING', isLoading })


// ThunkCreators

export const requestProfile = (id, isMyProfile) => (dispatch) => {
    dispatch(toggleLoading(true))

    profileAPI.getProfile(id)
        .then((data) => {
            dispatch(setProfile(data))
            dispatch(toggleIsMyProfile(isMyProfile))
            dispatch(toggleLoading(false))
        })

    profileAPI.getStatus(id)
        .then((data) => dispatch(setStatus(data)))
}

export const updateStatus = (status) => (dispatch) => {
    dispatch(toggleStatusLoading(true))

    profileAPI.updateStatus(status)
        .then(({ resultCode }) => {
            if (resultCode === 0) dispatch(setStatus(status))
            dispatch(toggleStatusLoading(false))
        })
}


export default profileReducer