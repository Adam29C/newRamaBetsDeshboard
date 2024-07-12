function test(n){
console.log(n)
if(n>1){
    test(n-1)
}
console.log(n);
};
test(10)