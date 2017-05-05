/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormsButton from 'components/forms/form-button';
import Card from 'components/card';
import FormPasswordInput from 'components/forms/form-password-input';
import FormTextInput from 'components/forms/form-text-input';
import FormCheckbox from 'components/forms/form-checkbox';
import { loginUser } from 'state/login/actions';
import Notice from 'components/notice';
import { recordTracksEvent } from 'state/analytics/actions';

export class LoginForm extends Component {
	static propTypes = {
		loginUser: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		loginError: PropTypes.string,
		onSuccess: PropTypes.func.isRequired,
		title: PropTypes.string,
	};

	static defaultProps = {
		title: '',
	};

	state = {
		usernameOrEmail: '',
		password: '',
		rememberMe: false,
		submitting: false,
		errorMessage: '',
	};

	dismissNotice = () => {
		this.setState( {
			errorMessage: ''
		} );
	};

	onChangeField = ( event ) => {
		this.setState( {
			[ event.target.name ]: event.target.value
		} );
	};

	onChangeRememberMe = ( event ) => {
		const { name, checked } = event.target;

		this.props.recordTracksEvent( 'calypso_login_block_remember_me_change', { new_value: checked } );

		this.setState( { [ name ]: checked } );
	};

	onSubmitForm = ( event ) => {
		event.preventDefault();
		this.setState( {
			submitting: true
		} );

		this.props.recordTracksEvent( 'calypso_login_block_login_submit' );

		this.props.loginUser( this.state.usernameOrEmail, this.state.password, this.state.rememberMe ).then( () => {
			this.props.recordTracksEvent( 'calypso_login_block_login_success' );
			this.dismissNotice();
			this.props.onSuccess( this.state );
		} ).catch( errorMessage => {
			this.props.recordTracksEvent( 'calypso_login_block_login_failure', {
				error_message: errorMessage
			} );
			this.setState( {
				submitting: false,
				errorMessage
			} );
		} );
	};

	renderNotices() {
		if ( this.state.errorMessage ) {
			return (
				<Notice status="is-error"
					text={ this.state.errorMessage }
					onDismissClick={ this.dismissNotice } />
			);
		}
	}

	render() {
		const isDisabled = {};
		if ( this.state.submitting ) {
			isDisabled.disabled = true;
		}

		return (
			<div>
				{ this.renderNotices() }

				<div className="login__form-header">
					{ this.props.title }
				</div>

				<form onSubmit={ this.onSubmitForm }>
					<Card className="login__form">
						<div className="login__form-userdata">
							<label htmlFor="usernameOrEmail" className="login__form-userdata-username">
								{ this.props.translate( 'Username or Email Address' ) }
							</label>

							<FormTextInput
								className="login__form-userdata-username-input"
								onChange={ this.onChangeField }
								id="usernameOrEmail"
								name="usernameOrEmail"
								value={ this.state.usernameOrEmail }
								{ ...isDisabled } />

							<label htmlFor="password" className="login__form-userdata-username">
								{ this.props.translate( 'Password' ) }
							</label>

							<FormPasswordInput
								className="login__form-userdata-username-password"
								onChange={ this.onChangeField }
								id="password"
								name="password"
								value={ this.state.password }
								{ ...isDisabled } />
						</div>

						<div className="login__form-remember-me">
							<label>
								<FormCheckbox
									name="rememberMe"
									checked={ this.state.rememberMe }
									onChange={ this.onChangeRememberMe }
									{ ...isDisabled } />
								<span>{ this.props.translate( 'Stay logged in' ) }</span>
							</label>
						</div>

						<div className="login__form-action">
							<FormsButton primary { ...isDisabled }>
								{ this.props.translate( 'Log in' ) }
							</FormsButton>
						</div>
					</Card>
				</form>
			</div>
		);
	}
}

export default connect(
	null,
	{
		loginUser,
		recordTracksEvent
	}
)( localize( LoginForm ) );
