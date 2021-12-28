import {Vue} from "vue-property-decorator";
/*
*       demo
*      this  onsize
        this.pushSizeChange(()=>{
            console.log(this.testdata, this.globalRem)
        })
        this.pushSizeChange(()=>{
            console.log(this.testdata, this.globalRem)
        })
        this.removeSizeChange(1)
        this.clearSizeChange()
        console.log(this.listSizeChange())
*
*
*
* */
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

declare module 'vue/types/vue' {
    interface Vue {
        pushSizeChange: Function,
        globalRem: string,
        clearSizeChange: Function,
        removeSizeChange: Function,
        listSizeChange: any
    }
}

cfbgcRem.install = (Vue: any, options: remOptions) => {
    let standardScale = options.min.width / options.min.height;
    let sizeCallBackList: Function[] = []
    let init = () => {
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
            Vue.prototype.globalRem = rem;

            //  调用回调
            sizeCallBackList.map(fun => {
                try{
                   fun()
                }catch(e){
                    if(process.env.NODE_ENV == 'development'){
                        console.error('vue-rem  error:', e)
                    }
                }
            })

        }, 300)
    }
    init()
    window.addEventListener('resize', init);
    // 添加回调函数
    Vue.prototype.pushSizeChange = (fun: Function) => {
        sizeCallBackList.push(fun)
    }
    // 清空回调函数
    Vue.prototype.clearSizeChange = () => {
        sizeCallBackList = []
    }
    // 删除回调函数
    Vue.prototype.removeSizeChange = (index: number) => {
        sizeCallBackList.splice(index, 1)
    }
    // 查看回调函数
    Vue.prototype.listSizeChange = () => {
        return sizeCallBackList;
    }

}

export default cfbgcRem;
