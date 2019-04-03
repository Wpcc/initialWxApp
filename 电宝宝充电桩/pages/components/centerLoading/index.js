Component({
  properties: {
    loading:{
      type: Boolean,
      value: true
    }
  },
  observers: {
    'loading':function(loading){
      console.log(loading)
    }
  }
})