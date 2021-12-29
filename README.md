# vue-rem
固定比例自适应ui插件
一、引用样例
*     import cfbgcRem from "cfbgc-rem/lib";
      const options: any = {min: {width: 1366*0.8, height: 691*0.8}, elementName: '#app'}
      Vue.use(cfbgcRem, options);
      （elementName 对应需要约束的 应用class选择器）
二、api使用样例
*     1> 添加回调函数(void)
          this.pushSizeChange(()=>{
              console.log(this.testdata, this.globalRem)
          })
          （页面销毁时建议 从事件栈中移除，优化js消耗）
        2> 移除回调函数（按照事件所在列表index索引）(void)
          this.removeSizeChange(1)
           （样例删除了第二个回调事件）
        3> 清空回调函数(void)
            this.clearSizeChange()
        4> 获取当前回调事件列表(Function Array)
            console.log(this.listSizeChange())
        5> 获取当前rem值常量
            this.globalRem

三、依赖版本
*    vue2.6
