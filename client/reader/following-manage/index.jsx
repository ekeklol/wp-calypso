/**
 * External Dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { trim, debounce, random, take } from 'lodash';
import { localize } from 'i18n-calypso';
import page from 'page';
import qs from 'qs';

/**
 * Internal Dependencies
 */
import CompactCard from 'components/card/compact';
import DocumentHead from 'components/data/document-head';
import SearchInput from 'components/search';
import ReaderMain from 'components/reader-main';
import { getReaderFeedsForQuery, getReaderRecommendedSites } from 'state/selectors';
import QueryReaderFeedsSearch from 'components/data/query-reader-feeds-search';
import QueryReaderRecommendedSites from 'components/data/query-reader-recommended-sites';
import FollowingManageSubscriptions from './subscriptions';
import SitesWindowScroller from './sites-window-scroller';
import MobileBackToSidebar from 'components/mobile-back-to-sidebar';
import ConnectedSubscriptionListItem from './connected-subscription-list-item';

class FollowingManage extends Component {
	static propTypes = {
		sitesQuery: PropTypes.string,
		subsQuery: PropTypes.string,
	};

	static defaultProps = {
		subsQuery: '',
		sitesQuery: '',
	}

	state = {
		width: 800,
		seed: random( 0, 10000 )
	}

	// TODO make this common between our different search pages?
	updateQuery = ( newValue ) => {
		this.scrollToTop();
		const trimmedValue = trim( newValue ).substring( 0, 1024 );
		if ( ( trimmedValue !== '' &&
				trimmedValue.length > 1 &&
				trimmedValue !== this.props.query
			) ||
			newValue === ''
		) {
			let searchUrl = '/following/manage';
			if ( newValue ) {
				searchUrl += '?' + qs.stringify( { q: newValue } );
			}
			page.replace( searchUrl );
		}
	}

	scrollToTop = () => {
		window.scrollTo( 0, 0 );
	}

	handleStreamMounted = ( ref ) => {
		this.streamRef = ref;
	}

	handleSearchBoxMounted = ( ref ) => {
		this.searchBoxRef = ref;
	}

	resizeSearchBox = () => {
		if ( this.searchBoxRef && this.streamRef ) {
			const width = this.streamRef.getClientRects()[ 0 ].width;
			if ( width > 0 ) {
				this.searchBoxRef.style.width = `${ width }px`;
			}
			this.setState( { width } );
		}
	}

	componentDidMount() {
		this.resizeListener = window.addEventListener(
			'resize',
			debounce( this.resizeSearchBox, 50 )
		);
		this.resizeSearchBox();
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.resizeListener );
	}

	render() {
		const { sitesQuery, subsQuery, translate, searchResults, getRecommendedSites } = this.props;
		const searchPlaceholderText = translate( 'Search millions of sites' );
		const recommendedSites = take( getRecommendedSites( this.state.seed ), 2 );

		return (
			<ReaderMain className="following-manage">
				<DocumentHead title={ 'Manage Following' } />
				<MobileBackToSidebar>
					<h1>{ translate( 'Manage Followed Sites' ) }</h1>
				</MobileBackToSidebar>
				{ searchResults.length === 0 && <QueryReaderFeedsSearch query={ sitesQuery } /> }
				{ recommendedSites.length === 0 && <QueryReaderRecommendedSites seed={ this.state.seed } /> }
				<h2 className="following-manage__header">{ translate( 'Follow Something New' ) }</h2>
				<div ref={ this.handleStreamMounted } />
				<div className="following-manage__fixed-area" ref={ this.handleSearchBoxMounted }>
					<CompactCard className="following-manage__input-card">
						<SearchInput
							onSearch={ this.updateQuery }
							onSearchClose={ this.scrollToTop }
							autoFocus={ this.props.autoFocusInput }
							delaySearch={ true }
							delayTimeout={ 500 }
							placeholder={ searchPlaceholderText }
							additionalClasses="following-manage__search-new"
							initialValue={ sitesQuery }
							value={ sitesQuery }>
						</SearchInput>
					</CompactCard>
				</div>
				{ ! sitesQuery && (
					<div>
						<h1> Recommended Sites </h1>
						{ recommendedSites && recommendedSites.length === 2 &&
							<div className="following-manage__site-recs">
								<div key="site-rec-1" className="following-manage__site-rec" >
									<ConnectedSubscriptionListItem
										url={ recommendedSites[ 0 ].url }
										feedId={ recommendedSites[ 0 ].feedId }
										siteId={ recommendedSites[ 0 ].blogId }
									/>
								</div>
								<div key="site-rec-2" className="following-manage__site-rec" >
									<ConnectedSubscriptionListItem
										url={ recommendedSites[ 1 ].url }
										feedId={ recommendedSites[ 1 ].feedId }
										siteId={ recommendedSites[ 1 ].blogId }
									/>
								</div>
							</div>
						}
					</div>
				) }
				{ ! sitesQuery && <FollowingManageSubscriptions width={ this.state.width } query={ subsQuery } /> }
				{ !! sitesQuery && <SitesWindowScroller sites={ searchResults } width={ this.state.width } /> }
			</ReaderMain>
		);
	}
}

export default connect(
	( state, ownProps ) => ( {
		searchResults: getReaderFeedsForQuery( state, ownProps.sitesQuery ) || [],
		getRecommendedSites: seed => getReaderRecommendedSites( state, seed ),
	} ),
)( localize( FollowingManage ) );
