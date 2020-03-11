import Vue from 'vue';

let vm = new Vue({
  el: '#app', // 表示要渲染的元素是#app
  data() {
    return {
      msg: 'hello',
      school: {
        name: 'black',
        age: 18
      },
      arr: [[1, 2], 3],
    }
  },
  computed: {
  },
  watch: {
  }
});

// console.log(vm.msg);
// console.log(vm.msg = 'world');
// console.log(vm.arr.push(123));
// console.log(vm.arr.push({a: 1}));
// console.log(vm.arr[3].a = 100);

setTimeout(() => {
  // vm.msg = 'hello world';
  // vm.arr.push(4);
  // console.log(vm.arr[0]);
  // vm.arr[0].push(5);
  vm.msg = '1';
  vm.msg = '2';
  vm.msg = '3';
  vm.msg = '4';
}, 2000);