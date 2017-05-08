/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import magicLogin from './magic-login/reducer';

import {
	LOGIN_REQUEST,
	LOGIN_REQUEST_FAILURE,
	LOGIN_REQUEST_SUCCESS,
	TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST,
	TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_FAILURE,
	TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_SUCCESS,
	LOGIN_TWOFACTOR_UPDATE_NONCE,
	LOGIN_TWOFACTOR_PUSH_POLL_COMPLETED,
	LOGIN_TWOFACTOR_PUSH_POLL_START,
	LOGIN_TWOFACTOR_PUSH_POLL_STOP,
} from 'state/action-types';

export const isRequesting = createReducer( false, {
	[ LOGIN_REQUEST ]: () => true,
	[ LOGIN_REQUEST_FAILURE ]: () => false,
	[ LOGIN_REQUEST_SUCCESS ]: () => false,
} );

export const requestError = createReducer( null, {
	[ LOGIN_REQUEST ]: () => null,
	[ LOGIN_REQUEST_SUCCESS ]: () => null,
	[ LOGIN_REQUEST_FAILURE ]: ( state, { error } ) => error
} );

export const requestSuccess = createReducer( null, {
	[ LOGIN_REQUEST ]: () => null,
	[ LOGIN_REQUEST_SUCCESS ]: () => true,
	[ LOGIN_REQUEST_FAILURE ]: () => false
} );

export const twoFactorAuth = createReducer( null, {
	[ LOGIN_REQUEST ]: () => null,
	[ LOGIN_REQUEST_SUCCESS ]: ( state, { data, rememberMe } ) => data ? { ...data, remember_me: rememberMe } : null,
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_FAILURE ]: ( state, { twoStepNonce } ) => Object.assign( {}, state, {
		two_step_nonce: twoStepNonce
	} ),
	[ LOGIN_TWOFACTOR_UPDATE_NONCE ]: ( state, { twoStepNonce } ) => ( { ...state, two_step_nonce: twoStepNonce } ),
	[ LOGIN_REQUEST_FAILURE ]: () => null
} );

export const isRequestingTwoFactorAuth = createReducer( false, {
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST ]: () => true,
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_FAILURE ]: () => false,
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_SUCCESS ]: () => false,
} );

export const twoFactorAuthRequestError = createReducer( null, {
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST ]: () => null,
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_SUCCESS ]: () => null,
	[ TWO_FACTOR_AUTHENTICATION_LOGIN_REQUEST_FAILURE ]: ( state, { error } ) => error
} );

export const twoFactorAuthPushPoll = createReducer( { inProgress: false, success: false }, {
	[ LOGIN_TWOFACTOR_PUSH_POLL_START ]: state => ( { ...state, inProgress: true, success: false } ),
	[ LOGIN_TWOFACTOR_PUSH_POLL_STOP ]: state => ( { ...state, inProgress: false } ),
	[ LOGIN_TWOFACTOR_PUSH_POLL_COMPLETED ]: state => ( { ...state, inProgress: false, success: true } ),
} );

export default combineReducers( {
	isRequesting,
	isRequestingTwoFactorAuth,
	magicLogin,
	requestError,
	requestSuccess,
	twoFactorAuth,
	twoFactorAuthRequestError,
	twoFactorAuthPushPoll,
} );
