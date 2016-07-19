/**
 * List Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
const React = require('react');
const ActionBar = require('./ActionBar');
const ListCore = require('./ListCore');
const Pagination = require('uxcore-pagination');
const deepcopy = require('deepcopy');
const deepEqual = require('deep-equal');
const NattyFetch = require('natty-fetch');
const assign = require('object-assign');
const classnames = require('classnames');

class List extends React.Component {

  constructor(props) {
    super(props);
    this.data = deepcopy(props.data);
    this.handleActionBarSearch = this.handleActionBarSearch.bind(this);
    this.handlePagerChange = this.handlePagerChange.bind(this);
    this.handlePagerSizeChange = this.handlePagerSizeChange.bind(this);
    this.processData = this.processData.bind(this);
    this.state = {
      data: this.data,
      pageSize: props.pageSize,
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if (!deepEqual(nextProps.data, this.data)) {
      this.data = deepcopy(nextProps.data);
      newState.data = this.data;
    }
    if (nextProps.pageSize !== this.props.pageSize) {
      newState.pageSize = nextProps.pageSize;
    }
    this.setState(newState);
  }

  componentWillUnmount() {
    const me = this;
    if (me.fetch) {
      me.fetch.abort();
    }
  }

  /**
   * only call this method in fetchData()
   */
  processData(data) {
    const me = this;
    const { processData } = me.props;
    return processData(data);
  }

  handleActionBarSearch(key) {
    const me = this;
    me.setState({
      searchTxt: key,
    }, () => {
      me.fetchData('search');
    });
  }

  handlePagerSizeChange(currentPage, pageSize) {
    const me = this;
    me.setState({
      pageSize,
    }, () => {
      me.fetchData('pagination');
    });
  }

  handlePagerChange(currentPage) {
    const me = this;
    const data = assign({}, me.state.data);
    data.currentPage = currentPage;
    me.setState({
      data,
    }, () => {
      me.fetchData('pagination');
    });
  }

  fetchData(from) {
    const me = this;
    const { fetchUrl, fitResponse, beforeFetch, onFetchError, fetchParams } = me.props;
    const { data, pageSize, searchTxt } = me.state;
    const isJsonp = me.props.isJsonp === undefined ? /\.jsonp/.test(fetchUrl) : me.props.isJsonp;
    const fetchData = assign({
      currentPage: data.currentPage,
      pageSize,
      searchTxt,
    }, fetchParams);
    if (fetchUrl) {
      me.fetch = NattyFetch.create({
        url: fetchUrl,
        data: beforeFetch(fetchData, from),
        fit: (response) => fitResponse(response),
        processData: me.processData,
        jsonp: isJsonp,
      });
      me.fetch().then((content) => {
        me.setState({
          data: content,
        });
      }).catch((err) => {
        onFetchError(err);
      });
    }
  }

  renderActionBar() {
    const me = this;
    const {
        showSearch,
        actionBar,
        searchBarPlaceholder,
    } = me.props;
    const actionBarProps = {
      onSearch: this.handleActionBarSearch,
      key: 'actionbar',
      actionBarConfig: actionBar,
      showSearch,
      searchBarPlaceholder,
    };
    return <ActionBar {...actionBarProps} />;
  }

  renderListCore() {
    const me = this;
    const data = me.state.data || {};
    return (
      <ListCore
        data={data.data}
        renderItem={me.props.renderItem}
        locale={me.props.locale}
      />
    );
  }

  renderPager() {
    const me = this;
    const { data } = me.state;
    const { prefixCls, showPager, locale, showPagerTotal, pageSize, pagerSizeOptions } = me.props;
    /**
     *
     * data structure
     * {
     *   data: [],
     *   currentPage: 1,
     *   totalCount: 30
     * }
     *
     */
    if (showPager && data && data.totalCount && data.currentPage) {
      return (
        <div className={`${prefixCls}-pager`}>
          <Pagination
            total={data.totalCount}
            locale={locale}
            showSizeChanger
            showQuickJumper
            showTotal={showPagerTotal}
            total={data.totalCount}
            onShowSizeChange={me.handlePagerSizeChange}
            onChange={me.handlePagerChange}
            current={data.currentPage}
            pageSize={pageSize}
            sizeOptions={pagerSizeOptions}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    const me = this;
    const { prefixCls, width, height, className } = me.props;
    return (
      <div
        className={classnames({
          [`${prefixCls}`]: true,
          [className]: !!className,
        })}
        style={{ width, height }}
      >
        {me.renderActionBar()}
        {me.renderListCore()}
        {me.renderPager()}
      </div>
    );
  }
}

List.defaultProps = {
  prefixCls: 'kuma-list',
  locale: 'zh-cn',
  fetchParams: {},
  searchBarPlaceholder: '请输入',
  showPagerTotal: true,
  showSearch: false,
  showPager: true,
  pageSize: 10,
  pagerSizeOptions: [10, 20, 30, 40],
  data: {},
  renderItem: () => {},
  fitResponse: (response) => response,
  beforeFetch: (data) => data,
  processData: (data) => data,
  onFetchError: (err) => { console.error(err.stack); },
  width: 'auto',
  height: 'auto',
};


// http://facebook.github.io/react/docs/reusable-components.html
List.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  locale: React.PropTypes.string,
  emptyText: React.PropTypes.string,
  fetchUrl: React.PropTypes.string,
  fetchParams: React.PropTypes.object,
  searchBarPlaceholder: React.PropTypes.string,
  data: React.PropTypes.object,
  renderItem: React.PropTypes.func,
  fitResponse: React.PropTypes.func,
  beforeFetch: React.PropTypes.func,
  processData: React.PropTypes.func,
  onFetchError: React.PropTypes.func,
  isJsonp: React.PropTypes.bool,
  showSearch: React.PropTypes.bool,
  showPager: React.PropTypes.bool,
  showPagerTotal: React.PropTypes.bool,
  pagerSizeOptions: React.PropTypes.array,
  pageSize: React.PropTypes.number,
  width: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  actionBar: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
};

List.displayName = 'List';

module.exports = List;
