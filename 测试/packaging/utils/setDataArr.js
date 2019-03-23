/**
 * 设置微信当中数组数据
 * args为对象类型，{key,value}
 */
export const setDataArr = (arr, args) => {
  for(let i=0; i<arr.length; i++){
    // for……in 循环出传递进来的数据
    for(let item in args){
      let obj = {}

      console.log(item)
      console.log(arr[i])
      console.log(arr[i].item)
      // let key = arr.i.item
      // let value = args[item]
      // obj[key] = value
      
      // this.setData(obj)
    }
  }
}