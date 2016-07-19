/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

const SearchBar = require('./SearchBar');
const classnames = require('classnames');
const Button = require('uxcore-button');
const React = require('react');

class ActionBar extends React.Component {

  /**
  *  convert ActionBar config from hash to array
  */
  getActionItem(config) {
    let items = [];
    if (config instanceof Array) {
      items = config;
    } else if (typeof config === 'object') {
      Object.keys(config).forEach((item) => {
        if (config.hasOwnProperty(item)) {
          items.push({
            title: item,
            callback: config[item],
          });
        }
      });
    }
    return items;
  }

  handleSearch(value) {
    this.props.onSearch(value);
  }

  renderActionBtn(item, index) {
    const me = this;
    const itemProps = {
      className: `${me.props.prefixCls}-item`,
      onClick: item.callback || (() => {}),
      key: index,
    };
    if (!!item.render && typeof item.render === 'function') {
      return <div {...itemProps}>{item.render(item.title)}</div>;
    }
    return <Button type="outline" size="medium" {...itemProps}>{item.title}</Button>;
  }

  renderSearchBar() {
    if (this.props.showSearch) {
      const me = this;
      const searchBarProps = {
        onSearch: me.handleSearch.bind(me),
        key: 'searchbar',
        placeholder: me.props.searchBarPlaceholder,
      };
      return <SearchBar {...searchBarProps} />;
    }
    return null;
  }

  render() {
    const me = this;
    const props = this.props;
    const barConfig = props.actionBarConfig;
    return (
      <div
        className={classnames({
          [props.prefixCls]: props.prefixCls,
          'fn-clear': true,
        })}
      >
        {me.getActionItem(barConfig).map((item, index) => me.renderActionBtn(item, index))}
        {me.renderSearchBar()}
      </div>
      );
  }

}

ActionBar.propTypes = {
  showSearch: React.PropTypes.bool,
  onSearch: React.PropTypes.func,
};

ActionBar.defaultProps = {
  prefixCls: 'kuma-list-actionbar',
};

module.exports = ActionBar;
