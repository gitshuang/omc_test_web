'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DraggableIcon = function DraggableIcon(_ref) {
  var _ref$viewBox = _ref.viewBox,
      viewBox = _ref$viewBox === undefined ? '0 0 32 32' : _ref$viewBox,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 24 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 24 : _ref$height,
      fill = _ref.fill;
  return _react2.default.createElement(
    'svg',
    { width: width, height: height, fill: fill, viewBox: viewBox },
    _react2.default.createElement('path', { d: 'M31.338,14.538L27.38,10.58C26.994,10.193,26.531,10,26,10c-1.188,0-2,1.016-2,2c0,0.516,0.186,0.986,0.58,1.38L25.2,14H18  V6.8l0.62,0.62C19.014,7.814,19.484,8,20,8c0.984,0,2-0.813,2-2c0-0.531-0.193-0.994-0.58-1.38l-3.973-3.974  C17.08,0.279,16.729,0,16,0s-1.135,0.334-1.463,0.662L10.58,4.62C10.193,5.006,10,5.469,10,6c0,1.188,1.016,2,2,2  c0.516,0,0.986-0.186,1.38-0.58L14,6.8V14H6.8l0.62-0.62C7.814,12.986,8,12.516,8,12c0-0.984-0.813-2-2-2  c-0.531,0-0.994,0.193-1.38,0.58l-3.958,3.958C0.334,14.866,0,15.271,0,16s0.279,1.08,0.646,1.447L4.62,21.42  C5.006,21.807,5.469,22,6,22c1.188,0,2-1.016,2-2c0-0.516-0.186-0.986-0.58-1.38L6.8,18H14v7.2l-0.62-0.62  C12.986,24.186,12.516,24,12,24c-0.984,0-2,0.813-2,2c0,0.531,0.193,0.994,0.58,1.38l3.957,3.958C14.865,31.666,15.271,32,16,32  s1.08-0.279,1.447-0.646l3.973-3.974C21.807,26.994,22,26.531,22,26c0-1.188-1.016-2-2-2c-0.516,0-0.986,0.186-1.38,0.58L18,25.2V18  h7.2l-0.62,0.62C24.186,19.014,24,19.484,24,20c0,0.984,0.813,2,2,2c0.531,0,0.994-0.193,1.38-0.58l3.974-3.973  C31.721,17.08,32,16.729,32,16S31.666,14.866,31.338,14.538z' })
  );
};

DraggableIcon.propTypes = {
  viewBox: _propTypes2.default.string,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  fill: _propTypes2.default.any
};

exports.default = DraggableIcon;