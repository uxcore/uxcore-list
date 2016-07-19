/**
 * List Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const List = require('../src');
const data = require('./data');
const Button = require('uxcore-button');

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderItem(rowData) {
    return (<div>
      <div className="list-header">
        <div className="list-title">{rowData.name}</div>
        <div className="list-button-group">
          <Button size="small" type="outline" style={{ marginRight: 10 }}>编辑</Button>
          <Button size="small" type="secondary">删除</Button>
        </div>
      </div>
      <ul className="list-group">
        <li>
          <div className="list-label">来访目的：</div>
          <div className="list-content">{rowData.purpose.join('、')}</div>
        </li>
        <li>
          <div className="list-label">服务窗：</div>
          <div className="list-content">
            {rowData.window.map((item) =>
              (<a className="list-link" href="http://baidu.com">{item}</a>)
            )}
          </div>
        </li>
        <li>
          <div className="list-label">前台接待：</div>
          <div className="list-content">
            {rowData.person.map((item, index) => {
              const postfix = (index !== rowData.person.length - 1) ? '；' : '';
              return (<a href={item.link}>{`${item.name}${postfix}`}</a>);
            })}
          </div>
        </li>
      </ul>
    </div>);
  }

  render() {
    const options = {
      actionBar: {
        新增: () => { alert('new'); },
      },
      fetchUrl: 'http://30.10.29.4:3000/demo/data.json',
      fitResponse: ((response) => {
        const ret = {
          // content: response,
          content: {},
          success: true,
        };
        return ret;
      }),
      showSearch: true,
      width: 1000,
      height: 400,
      searchBarPlaceholder: '请输入园区名称',
      data,
      renderItem: this.renderItem,
    };
    return (
      <div className="demo">
        <List {...options} />
      </div>
    );
  }
}

module.exports = Demo;
