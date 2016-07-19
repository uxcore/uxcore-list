## uxcore-list

React list with built-in actionBar, Search & Pagination

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url] 
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-list.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-list
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-list.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-list
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-list.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-list?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-list.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-list
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-list.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-list#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-list.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-list.svg
[sauce-url]: https://saucelabs.com/u/uxcore-list

![](https://gw.alicdn.com/tps/TB14_QlKVXXXXaTXFXXXXXXXXXX-1012-647.png)


### Development

```sh
git clone https://github.com/uxcore/uxcore-list
cd uxcore-list
npm install
npm run server
```

if you'd like to save your install time，you can use uxcore-tools globally.

```sh
npm install uxcore-tools -g
git clone https://github.com/uxcore/uxcore-list
cd uxcore-list
npm run dep
npm run start
```

### Test Case

```sh
npm run test
```

### Coverage

```sh
npm run coverage
```

## Demo

http://uxcore.github.io/components/list

## Contribute

Yes please! See the [CONTRIBUTING](https://github.com/uxcore/uxcore/blob/master/CONTRIBUTING.md) for details.

## API

## Props

| Name | Type | Required | Default | Since | Comments |
|---|---|---|---|---|---|
|width               |number              |optional  |auto        | -         |表格的宽度|
|height              |number              |optional  |auto        | -         |表格的高度|
|showPager           |boolean             |optional  |true        | -         |是否显示分页|
|showPagerTotal      |boolean             |optional  |false       | -         |是否显示分页的总数部分|
|showSearch          |boolean             |optional  |false       | -         |是否显示内置的搜索栏| 
|locale              |string              |optional  |zh-cn       | -         |国家化，目前支持 zh-cn/en-us|
|beforeFetch         |function(data, from)|optional  |noop        | -         |两个参数，data 表示表格请求数据时即将发送的参数，from 表示这次请求数据的行为从哪里产生，内置的有 `search`(搜索栏),`order`(排序) & `pagination`(分页)，该函数需要返回值，返回值为真正请求所携带的参数。|
|processData         |function(data)      |optional  |noop        | -         |有时源返回的数据格式，并不符合 Table 的要求，可以通过此函数进行调整，参数 data 是返回数据中 content 字段的 value，该函数需要返回值，返回值为符合 content 字段 value 的数据结构。|
|pageSize            |number              |optional  |10          | -         |每页显示多少条数据|
|pagerSizeOptions    |array               |optional  |[10,20,30,40] | -       |显示的可选 pageSize|
|data                |object              |optional  |-           | -         |在远端数据还没有返回时用作默认数据|
|fetchUrl            |string              |optional  |""          | -         |表格的数据源|
|fetchParams         |object              |optional  |-           | -         |表格在请求数据时，会额外附带的参数，具有最高的优先级|
|actionBar           |object/array        |optional  |null        | -         |表格内置的操作条配置，详细[见此](#actionbar)|
|onFetchError        |function(result)    |optional  |noop        | -         |在返回数据中 success 不是 true 的情况下触发，返回所有请求得到的数据|