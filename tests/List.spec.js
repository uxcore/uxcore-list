import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import List from '../src';
import Adapter from 'enzyme-adapter-react-16';
import { assign } from 'lodash';
import Enzyme, { mount } from 'enzyme';
import mockData from '../demo/data.js';

Enzyme.configure({ adapter: new Adapter() });
function renderItem(rowData) {
  return (<div>{JSON.stringify(rowData)}</div>);
}
const fetchUrl = '';
const getList = (options = {}) => {
  const opts = assign({
    actionBar: {
      新增: () => { console.log('new'); },
    },
    showSearch: true,
    width: 1000,
    height: 400,
    searchBarPlaceholder: '请输入园区名称',
    data: mockData.data,
    renderItem,
  }, options);
  return mount(React.createElement(List, opts));
};
const barTest = [
  {
    title: '新增行', // 显示名称
    callback: () => { // 点击回调
    },
    render: (title) => { // 定制渲染
      return title;
    }
  },
  {
    title: '编辑所有行',
    callback: () => {
    }
  },
  {
    title: '保存所有行',
    callback: () => {
    }
  }
];
const testProps = {
  actionBar: {
    新增: () => { console.log('new'); },
  },
  showSearch: true,
  width: '1000',
  height: '400',
  searchBarPlaceholder: '请输入园区名称',
  data: mockData.data,
};

describe('List', () => {
  it('render correct', () => {
    const w = mount(<List />);
    expect(w.props().width).to.equal('auto');
    w.setProps({ width: 1000 });
    expect(w.props().width).to.equal(1000);
    w.unmount();
  });

  it('reder with props', () => {
    const w = getList();
    expect(w.props().width).to.equal(1000);
    w.setProps({ data: mockData.data });
    expect(w.props().data).to.equal(mockData.data);
    w.setProps({
      pageSize: 20,
      data: [{ a: 1 }],
    });
    expect(w.props().pageSize).to.equal(20);
    w.unmount();
  });
  it('reder with lifecyles unmount', () => {
    const w = getList({});
    w.setProps({ actionBar: barTest });
    w.unmount();
    expect(w.props().actionBar).to.equal(undefined);
    w.unmount();
  });
  it('render search', () => {
    const w = getList({ fetchUrl });
    expect(w.props().fetchUrl).to.equal(fetchUrl);
    const j = w.find('.kuma-input');
    j.simulate('keydown',{ keyCode: 13 });
    w.unmount();
  });
  it('render pagesize change', () => {
    const w = getList({ fetchUrl });
    w.instance().handlePagerSizeChange(2, 15);
    w.instance().handlePagerChange(1);
    w.unmount();
  });
});