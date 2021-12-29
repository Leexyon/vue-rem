import {Vue} from "vue-property-decorator";

const cfbgcRem: any = {};
let remListener: any = null;

interface remOptionsMin {
    width: number,
    height: number
}

interface remOptions {
    elementName: string,
    min: remOptionsMin
}

interface cfbgcRemOptions {
    globalRem: number,
    pushSizeChange: Function,
    clearSizeChange: Function,
    removeSizeChange: Function,
    listSizeChange: Function,
}

declare module 'vue/types/vue' {
    interface Vue {
        cfbgcRem: cfbgcRemOptions,
    }
}

cfbgcRem.install = (Vue: any, options: remOptions) => {

    class cfbgcRem {
        private sizeCallBackList: Function[];
        private globalRem: number | any;

        constructor() {
            console.log('初始化')
            this.init()
            this.sizeCallBackList = []
        }

        init() {
            let standardScale = options.min.width / options.min.height;

            let start = () => {
                clearTimeout(remListener)
                remListener = setTimeout(() => {
                    const rem = window.innerWidth < options.min.width ? (options.min.width / 95).toFixed(2) : (window.innerWidth / 95).toFixed(2);
                    document.documentElement.style.fontSize = rem + 'px';
                    // 设置比例
                    // 获取 dom 及对象
                    let windowSize: any = {
                        innerWidth: window.innerWidth,
                        innerHeight: window.innerHeight,
                    }
                    let bodyEl = document.body;
                    // 使用前reset
                    const reset = () => {
                        bodyEl.style.alignItems = 'center';
                        bodyEl.style.justifyContent = 'center';
                    }
                    // 小于最小范围后处理
                    const overSmallSize = () => {
                        reset()
                        mainAppEl.style.width = options.min.width + 'px';
                        mainAppEl.style.height = options.min.height + 'px';
                        if (window.innerWidth < options.min.width) {
                            bodyEl.style.justifyContent = 'flex-start';
                        }
                        if (windowSize.innerHeight < options.min.height) {
                            bodyEl.style.alignItems = 'flex-start';
                        }
                    }
                    const overBigSize = () => {
                        reset()
                        let currentScale = window.innerWidth / windowSize.innerHeight;
                        if (standardScale > currentScale) {
                            // 太高了
                            mainAppEl.style.width = '100%';
                            mainAppEl.style.height = mainAppEl!.clientWidth / standardScale + 'px';
                        } else {
                            // 太宽了
                            mainAppEl.style.height = '100%';
                            mainAppEl.style.width = standardScale * mainAppEl!.clientHeight + 'px';
                        }
                    }
                    const mainAppEl: any = document.querySelector(options.elementName)
                    if (windowSize.innerWidth < options.min.width || windowSize.innerHeight < options.min.height) {
                        overSmallSize();
                    } else {
                        overBigSize()
                    }

                    // 销毁
                    windowSize = null;
                    // @ts-ignore
                    bodyEl = null;

                    // 将数据传出
                    this.globalRem = Number(rem);

                    //  调用回调
                    this.sizeCallBackList.map(fun => {
                        fun()
                    })

                }, 300)
            }
            start()
            window.addEventListener('resize', start);
        }

        pushSizeChange = (fun: Function) => {
            this.sizeCallBackList.push(fun)
        }
        // 清空回调函数
        clearSizeChange = () => {
            this.sizeCallBackList = []
        }
        // 删除回调函数
        removeSizeChange = (index: number) => {
            this.sizeCallBackList.splice(index, 1)
        }
        // 查看回调函数
        listSizeChange = () => {
            return this.sizeCallBackList;
        }
    }


    // 添加回调函数

    let cfbgcRemClient = new cfbgcRem()

    Vue.mixin({
        beforeCreate: function () {
            cfbgcRemClient.init()
        }
    })
    Vue.prototype.cfbgcRem = cfbgcRemClient

}

export default cfbgcRem;
