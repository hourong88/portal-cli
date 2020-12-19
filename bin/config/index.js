/*
  @dest: 使用配置文件
  @Author: tree
 */
module.exports  = {
  npmUrl: 'https://registry.npmjs.org/xxx-cli',
  promptTypeList:[{
      type: 'list',
      message: '请选择拉取的模版类型:',
      name: 'type',
      choices: [{
        name: '前端框架',
        value: {
          url: 'http://192.168.3.51/xxx-frame.git',
          gitName: 'portal-frame',
          val:'前端框架'
        }
      }]
  }],
};
