/**
 * List Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';

import PropTypes from 'prop-types';
import ActionBar from './ActionBar';
import ListCore from './ListCore';
import Pagination from 'uxcore-pagination';
import deepcopy from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import NattyFetch from 'natty-fetch';
import assign from 'object-assign';
import classnames from 'classnames';
import Promise from 'lie';

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

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if (!isEqual(nextProps.data, this.data)) {
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
      currentPage: data.currentPage || 1,
      pageSize,
      searchTxt,
    }, fetchParams);
    if (fetchUrl) {
      me.fetch = NattyFetch.create({
        url: fetchUrl,
        data: beforeFetch(fetchData, from),
        fit: response => fitResponse(response),
        process: me.processData,
        jsonp: isJsonp,
        Promise,
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
  fitResponse: response => response,
  beforeFetch: data => data,
  processData: data => data,
  onFetchError: (err) => { console.error(err.stack); },
  width: 'auto',
  height: 'auto',
};


// http://facebook.github.io/react/docs/reusable-components.html
List.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  locale: PropTypes.string,
  emptyText: PropTypes.string,
  fetchUrl: PropTypes.string,
  fetchParams: PropTypes.object,
  searchBarPlaceholder: PropTypes.string,
  data: PropTypes.object,
  renderItem: PropTypes.func,
  fitResponse: PropTypes.func,
  beforeFetch: PropTypes.func,
  processData: PropTypes.func,
  onFetchError: PropTypes.func,
  isJsonp: PropTypes.bool,
  showSearch: PropTypes.bool,
  showPager: PropTypes.bool,
  showPagerTotal: PropTypes.bool,
  pagerSizeOptions: PropTypes.array,
  pageSize: PropTypes.number,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  actionBar: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

List.displayName = 'List';

export default List;
