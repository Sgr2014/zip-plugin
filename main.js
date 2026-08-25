var bar = {
  myName:"liumei",
  printName: function () {
    console.log(myName)
  }
}

function foo() {
  let myName = "guyue"
  return bar.printName
}

let myName = "liuxing"
let _printName = foo()
_printName()

bar.printName()