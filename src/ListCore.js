/**
 * List Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';

import PropTypes from 'prop-types';
import i18n from './i18n';
class ListCore extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItems() {
    const me = this;
    const { prefixCls, data, renderItem, locale, emptyText } = me.props;
    if (data) {
      return data.map((item, index) =>
        (<div className={`${prefixCls}-item`} key={index}>
          {renderItem(item)}
        </div>)
      );
    }
    return (
      <div className={`${prefixCls}-nodata`}>
        {i18n[locale].nodata}
      </div>
    );
  }

  render() {
    const me = this;
    const { prefixCls } = me.props;
    return (
      <div className={`${prefixCls}-core`}>
        {me.renderItems()}
      </div>
    );
  }
}

ListCore.defaultProps = {
  prefixCls: 'kuma-list',
};


// http://facebook.github.io/react/docs/reusable-components.html
ListCore.propTypes = {
  prefixCls: PropTypes.string,
  data: PropTypes.array,
  renderItem: PropTypes.func,
};

ListCore.displayName = 'ListCore';

export default ListCore;
