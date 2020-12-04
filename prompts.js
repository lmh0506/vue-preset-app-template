module.exports = [
  {
    type: 'confirm',
    name: 'isWechat',
    message: 'Does the project use WeChat jsdk',
    default: false
  },
  {
    type: 'confirm',
    name: 'isAmap',
    message: 'Does the project use Amap',
    default: false
  },
  {
    when: answers => answers.isAmap === true,
    type: 'input',
    name: 'AmapKey',
    message: 'please enter AmapKey',
    default: 'Default AmapKey',
  }
]